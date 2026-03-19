export async function POST(request) {
  try {
    const { image, mediaType } = await request.json();
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: 'Extract the final score from this EA FC/FIFA match result screenshot. Return ONLY JSON: {"team1":"Name","score1":0,"team2":"Name","score2":0} or {"error":"reason"}' }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return Response.json({ error: data.error.message || 'API error' }, { status: 400 });
    }

    const text = data.content?.[0]?.text || '{}';
    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
