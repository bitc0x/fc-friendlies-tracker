'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ============ FC 26 TEAMS DATABASE ============
const FC26_TEAMS = {
  "Premier League": { country: "England", teams: ["Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion", "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Leeds United", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Sunderland", "Tottenham", "West Ham", "Wolverhampton"] },
  "EFL Championship": { country: "England", teams: ["Birmingham City", "Blackburn Rovers", "Bristol City", "Charlton Athletic", "Coventry City", "Derby County", "Hull City", "Ipswich Town", "Leicester City", "Middlesbrough", "Millwall", "Norwich City", "Oxford United", "Portsmouth", "Preston North End", "Queens Park Rangers", "Sheffield United", "Sheffield Wednesday", "Southampton", "Stoke City", "Swansea City", "Watford", "West Bromwich Albion", "Wrexham"] },
  "LaLiga": { country: "Spain", teams: ["Alaves", "Athletic Bilbao", "Atletico Madrid", "Celta Vigo", "Elche", "Espanyol", "FC Barcelona", "Getafe", "Girona", "Levante", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Oviedo", "Real Sociedad", "Sevilla", "Valencia", "Villarreal"] },
  "LaLiga 2": { country: "Spain", teams: ["Albacete", "Almeria", "Andorra", "Burgos", "Cadiz", "Castellon", "Cordoba CF", "Deportivo La Coruna", "Eibar", "Granada", "Huesca", "Las Palmas", "Leganes", "Malaga", "Mirandes", "Racing Santander", "Sporting de Gijon", "Valladolid", "Zaragoza"] },
  "Bundesliga": { country: "Germany", teams: ["1. FC Heidenheim", "1. FC Koln", "1899 Hoffenheim", "Bayer Leverkusen", "Bayern Munich", "Borussia Dortmund", "Borussia Monchengladbach", "Eintracht Frankfurt", "FC Augsburg", "FC St. Pauli", "Hamburger SV", "Mainz 05", "RB Leipzig", "SC Freiburg", "Union Berlin", "VfB Stuttgart", "VfL Wolfsburg", "Werder Bremen"] },
  "2. Bundesliga": { country: "Germany", teams: ["1. FC Kaiserslautern", "1. FC Magdeburg", "1. FC Nurnberg", "Arminia Bielefeld", "Darmstadt 98", "Dynamo Dresden", "Eintracht Braunschweig", "Fortuna Dusseldorf", "Greuther Furth", "Hannover 96", "Hertha BSC", "Holstein Kiel", "Karlsruher SC", "Preussen Munster", "SC Paderborn", "Schalke 04", "SV Elversberg", "VfL Bochum"] },
  "Serie A": { country: "Italy", teams: ["AS Roma", "Atalanta", "Bologna", "Cagliari", "Como", "Cremonese", "Fiorentina", "Genoa", "Hellas Verona", "Inter", "Juventus", "Lazio", "Lecce", "Milan", "Napoli", "Parma", "Pisa", "Sassuolo", "Torino", "Udinese"] },
  "Serie B": { country: "Italy", teams: ["Avellino", "Bari", "Carrarese", "Catanzaro", "Cesena", "Empoli", "Frosinone", "Juve Stabia", "Mantova", "Modena", "Monza", "Padova", "Palermo", "Pescara", "Reggiana", "Sampdoria", "Spezia", "Venezia"] },
  "Ligue 1": { country: "France", teams: ["Angers SCO", "AS Monaco", "Auxerre", "FC Lorient", "FC Nantes", "FC Metz", "Havre AC", "LOSC Lille", "OGC Nice", "Olympique de Marseille", "Olympique Lyonnais", "Paris FC", "Paris Saint-Germain", "Racing Club de Lens", "RC Strasbourg", "Stade Brestois 29", "Stade Rennais FC", "Toulouse FC"] },
  "Ligue 2": { country: "France", teams: ["Amiens SC", "AS Saint-Etienne", "Clermont Foot", "Dunkerque", "En Avant Guingamp", "FC Annecy", "Grenoble Foot 38", "Laval", "Le Mans", "Montpellier HSC", "Nancy", "Pau FC", "Red Star FC", "Stade de Reims", "SC Bastia", "Troyes"] },
  "Eredivisie": { country: "Netherlands", teams: ["Ajax", "AZ", "Excelsior", "FC Utrecht", "FC Volendam", "Feyenoord", "Fortuna Sittard", "Go Ahead Eagles", "Groningen", "Heracles Almelo", "NAC Breda", "NEC Nijmegen", "PEC Zwolle", "PSV", "SC Heerenveen", "Sparta Rotterdam", "Twente"] },
  "Liga Portugal": { country: "Portugal", teams: ["Alverca", "Arouca", "AVS", "Casa Pia", "CD Nacional", "Estoril", "Estrela Amadora", "Famalicao", "FC Porto", "Gil Vicente", "Moreirense", "Rio Ave", "Santa Clara", "SL Benfica", "Sporting CP", "Sporting de Braga", "Tondela", "Vitoria de Guimaraes"] },
  "Saudi Pro League": { country: "Saudi Arabia", teams: ["Al Ahli", "Al-Fateh", "Al Fayha", "Al Hazem", "Al Hilal", "Al Ittihad", "Al Khaleej", "Al Kholood", "Al Najma", "Al Nassr", "Al Okhdood", "Al Qadsiah", "Al Riyadh SC", "Al Shabab", "Al Taawoun", "Damac", "Ettifaq FC", "Neom"] },
  "MLS": { country: "USA", teams: ["Atlanta United", "Austin FC", "CF Montreal", "Charlotte FC", "Chicago Fire", "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Cincinnati", "FC Dallas", "Houston Dynamo", "Inter Miami CF", "LA Galaxy", "Los Angeles FC", "Minnesota United", "Nashville SC", "New England Revolution", "New York City FC", "New York Red Bulls", "Orlando City", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Diego FC", "San Jose Earthquakes", "Seattle Sounders", "Sporting Kansas City", "St Louis City", "Toronto FC", "Vancouver Whitecaps"] },
  "Liga MX": { country: "Mexico", teams: ["America", "Atlas", "Atletico San Luis", "Cruz Azul", "Guadalajara", "FC Juarez", "Leon", "Mazatlan", "Monterrey", "Necaxa", "Pachuca", "Puebla", "Queretaro", "Santos Laguna", "Tijuana", "Toluca", "UANL", "UNAM"] },
  "Argentina": { country: "Argentina", teams: ["Aldosivi", "Atletico Tucuman", "Argentinos Jrs", "Barracas Central", "Banfield", "Belgrano", "Boca Juniors", "Central Cordoba", "Defensa y Justicia", "Estudiantes", "Gimnasia", "Godoy Cruz", "Huracan", "Independiente", "Lanus", "Newells", "Platense", "Racing Club", "River Plate", "Rosario Central", "San Lorenzo", "Talleres", "Tigre", "Union", "Velez Sarsfield"] },
  "Scottish Premiership": { country: "Scotland", teams: ["Aberdeen", "Celtic", "Dundee", "Dundee United", "Falkirk", "Heart of Midlothian", "Hibernian", "Kilmarnock", "Livingston", "Motherwell", "Rangers", "St Mirren"] },
  "Belgian Pro League": { country: "Belgium", teams: ["Cercle Brugge", "Charleroi", "Club Brugge", "Genk", "Gent", "Leuven", "Mechelen", "Royal Antwerp FC", "RSC Anderlecht", "Sint-Truiden", "Standard Liege", "Union SG", "Westerlo"] },
  "Austrian Bundesliga": { country: "Austria", teams: ["Blau-Weiss", "FC Red Bull Salzburg", "FK Austria Wien", "Grazer AK", "LASK", "SCR Altach", "SK Rapid Wien", "SK Sturm Graz", "SV Ried", "TSV Hartberg", "Wolfsberger AC", "WSG Tirol"] },
  "Swiss Super League": { country: "Switzerland", teams: ["BSC Young Boys", "FC Basel", "FC Lausanne-Sport", "FC Lugano", "FC Luzern", "FC Sion", "FC St. Gallen", "FC Zurich", "Grasshopper", "Servette FC", "Thun", "Winterthur"] },
  "Super Lig": { country: "Turkey", teams: ["Alanyaspor", "Antalyaspor", "Besiktas", "Eyupspor", "Fenerbahce", "Galatasaray", "Gaziantep FK", "Genclerbirligi", "Goztepe", "Istanbul Basaksehir", "Kasimpasa", "Kayserispor", "Kocaelispor", "Konyaspor", "Rizespor", "Samsunspor", "Trabzonspor"] },
  "Danish Superliga": { country: "Denmark", teams: ["Aarhus", "Brondby IF", "FC Kobenhavn", "FC Midtjylland", "FC Nordsjaelland", "Fredericia", "OB Odense", "Randers FC", "Silkeborg IF", "Sonderjyske", "Vejle Boldklub", "Viborg FF"] },
  "Eliteserien": { country: "Norway", teams: ["Bodo/Glimt", "Bryne", "Fredrikstad", "Hamarkameratene", "Haugesund", "KFUM Oslo", "Kristiansund", "Molde", "Rosenborg", "Sandefjord", "Sarpsborg 08", "SK Brann", "Stromsgodset", "Tromso", "Valerenga", "Viking"] },
  "Allsvenskan": { country: "Sweden", teams: ["AIK", "BK Hacken", "Degerfors IF", "Djurgardens IF", "GAIS", "Halmstads BK", "Hammarby IF", "IF Brommapojkarna", "IF Elfsborg", "IFK Goteborg", "IFK Norrkoping", "IFK Varnamo", "IK Sirius", "Malmo FF", "Mjallby AI", "Osters IF"] },
  "Ekstraklasa": { country: "Poland", teams: ["Arka Gdynia", "Cracovia", "GKS Katowice", "Gornik Zabrze", "Jagiellonia Bialystok", "Korona Kielce", "Lechia Gdansk", "Lech Poznan", "Legia Warszawa", "Motor Lublin", "Piast Gliwice", "Pogon Szczecin", "Radomiak Radom", "Rakow Czestochowa", "Widzew Lodz", "Zaglebie Lubin"] },
  "Chinese Super League": { country: "China", teams: ["Beijing Guoan", "Changchun Yatai", "Chengdu Rongcheng", "Dalian Yingbo", "Henan Jianye", "Meizhou Hakka", "Qingdao Hainiu", "Shandong Taishan", "Shanghai Shenhua", "Shanghai Port", "Shenzhen Peng City", "Tianjin TEDA", "Wuhan Three Towns", "Zhejiang"] },
  "K League 1": { country: "South Korea", teams: ["Daegu FC", "Daejeon Hana Citizen", "FC Anyang", "FC Seoul", "Gangwon FC", "Gimcheon Sangmu", "Gwangju FC", "Jeonbuk Hyundai Motors", "Jeju United", "Pohang Steelers", "Suwon FC", "Ulsan Hyundai"] },
  "A-League": { country: "Australia", teams: ["Adelaide United", "Auckland FC", "Brisbane Roar", "Central Coast Mariners", "Macarthur FC", "Melbourne City", "Melbourne Victory", "Newcastle Jets", "Perth Glory", "Sydney FC", "Western Sydney Wanderers", "Wellington Phoenix", "Western United"] },
  "Rest of World": { country: "Various", teams: ["AFC Richmond", "AEK Athens", "Al Ahly", "Al Ain FC", "APOEL FC", "Atletico Nacional", "Dinamo Kiev", "Dinamo Zagreb", "Ferencvarosi TC", "Hajduk Split", "HJK Helsinki", "Kaizer Chiefs", "Mamelodi Sundowns", "Olympiacos FC", "Orlando Pirates", "Panathinaikos", "PAOK", "Qarabag FK", "Shakhtar Donetsk", "Slavia Praha", "Sparta Praha", "Viktoria Plzen"] },
  "National Teams": { country: "International", teams: ["Argentina", "Croatia", "Czechia", "Denmark", "England", "Finland", "France", "Germany", "Ghana", "Hungary", "Iceland", "Italy", "Mexico", "Morocco", "Netherlands", "Northern Ireland", "Norway", "Poland", "Portugal", "Qatar", "Republic of Ireland", "Romania", "Scotland", "Spain", "Sweden", "Ukraine", "United States", "Wales"] }
};

// Flatten all teams
const ALL_TEAMS = Object.entries(FC26_TEAMS).flatMap(([league, data]) =>
  data.teams.map(team => ({ name: team, league, country: data.country }))
);

// ============ STORAGE HELPER ============
const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

// ============ MAIN COMPONENT ============
export default function FCTracker() {
  const [view, setView] = useState('standings');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showTournamentSetup, setShowTournamentSetup] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [showDraw, setShowDraw] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [showKnockoutMatch, setShowKnockoutMatch] = useState(null);
  
  // Form states
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPSN, setNewPlayerPSN] = useState('');
  const [matchData, setMatchData] = useState({ player1: '', player2: '', score1: 0, score2: 0 });
  const [teamSelections, setTeamSelections] = useState({});
  const [tournamentType, setTournamentType] = useState('knockout');
  const [groupCount, setGroupCount] = useState(2);
  
  // Draw animation
  const [drawAnimation, setDrawAnimation] = useState(null);
  const [drawnOrder, setDrawnOrder] = useState([]);
  
  // OCR
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [twitchChannel, setTwitchChannel] = useState('');
  const fileInputRef = useRef(null);

  const ELO_K = 32;
  const ELO_START = 1200;

  // Load data on mount
  useEffect(() => {
    setPlayers(storage.get('fct-players') || []);
    setMatches(storage.get('fct-matches') || []);
    setTournament(storage.get('fct-tournament'));
    setSeasons(storage.get('fct-seasons') || []);
    setCurrentSeason(storage.get('fct-current-season'));
    setTwitchChannel(storage.get('fct-twitch') || '');
    setLoading(false);
  }, []);

  const save = (key, data, setter) => { setter(data); storage.set(key, data); };

  // ELO
  const getAllEloRatings = () => {
    const ratings = {};
    players.forEach(p => { ratings[p.id] = ELO_START; });
    [...matches].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(m => {
      const p1Elo = ratings[m.player1] || ELO_START;
      const p2Elo = ratings[m.player2] || ELO_START;
      const expected1 = 1 / (1 + Math.pow(10, (p2Elo - p1Elo) / 400));
      const outcome1 = m.score1 > m.score2 ? 1 : m.score1 < m.score2 ? 0 : 0.5;
      ratings[m.player1] = Math.round(p1Elo + ELO_K * (outcome1 - expected1));
      ratings[m.player2] = Math.round(p2Elo + ELO_K * ((1 - outcome1) - (1 - expected1)));
    });
    return ratings;
  };

  const eloRatings = getAllEloRatings();

  // Player CRUD
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = { id: Date.now().toString(), name: newPlayerName.trim(), psn: newPlayerPSN.trim() || null, created: new Date().toISOString() };
    save('fct-players', [...players, newPlayer], setPlayers);
    setNewPlayerName(''); setNewPlayerPSN(''); setShowAddPlayer(false);
  };

  // Match CRUD
  const addMatch = (p1, p2, s1, s2, knockoutRound = null, knockoutMatchIdx = null) => {
    if (!p1 || !p2 || p1 === p2) return;
    const newMatch = {
      id: Date.now().toString(), player1: p1, player2: p2,
      score1: parseInt(s1) || 0, score2: parseInt(s2) || 0,
      date: new Date().toISOString(),
      seasonId: currentSeason?.id || null, tournamentId: tournament?.id || null,
      team1: tournament?.teamSelections?.[p1] || null, team2: tournament?.teamSelections?.[p2] || null,
      knockoutRound, knockoutMatchIdx
    };
    const newMatches = [...matches, newMatch];
    save('fct-matches', newMatches, setMatches);
    
    // Auto-advance knockout bracket
    if (tournament && knockoutRound !== null && knockoutMatchIdx !== null) {
      const winner = newMatch.score1 > newMatch.score2 ? p1 : newMatch.score2 > newMatch.score1 ? p2 : null;
      if (winner) {
        const updatedTournament = JSON.parse(JSON.stringify(tournament));
        if (!updatedTournament.knockoutResults) updatedTournament.knockoutResults = {};
        if (!updatedTournament.knockoutResults[knockoutRound]) updatedTournament.knockoutResults[knockoutRound] = {};
        updatedTournament.knockoutResults[knockoutRound][knockoutMatchIdx] = { winner, score: `${newMatch.score1}-${newMatch.score2}` };
        
        // Advance winner to next round
        const nextRound = knockoutRound + 1;
        const nextMatchIdx = Math.floor(knockoutMatchIdx / 2);
        const isFirstOfPair = knockoutMatchIdx % 2 === 0;
        
        if (!updatedTournament.knockoutBracket[nextRound]) {
          const currentRoundSize = updatedTournament.knockoutBracket[knockoutRound]?.length || 0;
          if (currentRoundSize > 2) {
            updatedTournament.knockoutBracket[nextRound] = new Array(currentRoundSize / 2).fill(null);
          }
        }
        
        if (updatedTournament.knockoutBracket[nextRound]) {
          updatedTournament.knockoutBracket[nextRound][nextMatchIdx * 2 + (isFirstOfPair ? 0 : 1)] = winner;
        }
        
        save('fct-tournament', updatedTournament, setTournament);
      }
    }
    
    setMatchData({ player1: '', player2: '', score1: 0, score2: 0 });
    setShowAddMatch(false); setShowKnockoutMatch(null); setShowOCR(false); setOcrResult(null);
  };

  // Standings calculation
  const calculateStandings = (filterTournament = false) => {
    const stats = {};
    players.forEach(p => {
      stats[p.id] = { id: p.id, name: p.name, psn: p.psn, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
    });
    
    let relevantMatches = currentSeason ? matches.filter(m => m.seasonId === currentSeason.id) : matches;
    if (filterTournament && tournament) relevantMatches = relevantMatches.filter(m => m.tournamentId === tournament.id);
    
    relevantMatches.forEach(m => {
      if (!stats[m.player1] || !stats[m.player2]) return;
      stats[m.player1].played++; stats[m.player2].played++;
      stats[m.player1].gf += m.score1; stats[m.player1].ga += m.score2;
      stats[m.player2].gf += m.score2; stats[m.player2].ga += m.score1;
      stats[m.player1].gd = stats[m.player1].gf - stats[m.player1].ga;
      stats[m.player2].gd = stats[m.player2].gf - stats[m.player2].ga;
      if (m.score1 > m.score2) { stats[m.player1].won++; stats[m.player1].points += 3; stats[m.player2].lost++; }
      else if (m.score2 > m.score1) { stats[m.player2].won++; stats[m.player2].points += 3; stats[m.player1].lost++; }
      else { stats[m.player1].drawn++; stats[m.player2].drawn++; stats[m.player1].points++; stats[m.player2].points++; }
    });

    const getH2H = (id1, id2) => {
      let p1Pts = 0, p2Pts = 0;
      relevantMatches.forEach(m => {
        if (m.player1 === id1 && m.player2 === id2) { if (m.score1 > m.score2) p1Pts += 3; else if (m.score2 > m.score1) p2Pts += 3; else { p1Pts++; p2Pts++; } }
        else if (m.player1 === id2 && m.player2 === id1) { if (m.score1 > m.score2) p2Pts += 3; else if (m.score2 > m.score1) p1Pts += 3; else { p1Pts++; p2Pts++; } }
      });
      return p1Pts - p2Pts;
    };
    const getGoalAvg = (s) => s.ga === 0 ? (s.gf > 0 ? 999 : 0) : s.gf / s.ga;

    return Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const h2h = getH2H(b.id, a.id);
      if (h2h !== 0) return h2h;
      return getGoalAvg(b) - getGoalAvg(a);
    });
  };

  // Group stage fixtures generator
  const generateGroupFixtures = (groupPlayers) => {
    const fixtures = [];
    for (let i = 0; i < groupPlayers.length; i++) {
      for (let j = i + 1; j < groupPlayers.length; j++) {
        fixtures.push({ home: groupPlayers[i], away: groupPlayers[j] });
      }
    }
    for (let i = fixtures.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fixtures[i], fixtures[j]] = [fixtures[j], fixtures[i]];
    }
    return fixtures;
  };

  // Tournament draw
  const performDraw = async () => {
    const playerIds = players.map(p => p.id);
    const sorted = [...playerIds].sort((a, b) => (eloRatings[b] || ELO_START) - (eloRatings[a] || ELO_START));
    
    const numPots = playerIds.length <= 4 ? 1 : playerIds.length <= 8 ? 2 : playerIds.length <= 12 ? 3 : 4;
    const potSize = Math.ceil(sorted.length / numPots);
    const pots = [];
    for (let i = 0; i < numPots; i++) pots.push(sorted.slice(i * potSize, (i + 1) * potSize));
    
    pots.forEach(pot => {
      for (let i = pot.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pot[i], pot[j]] = [pot[j], pot[i]];
      }
    });

    setDrawAnimation({ phase: 'drawing', currentPot: 0 });
    const drawn = [];
    
    for (let potIdx = 0; potIdx < pots.length; potIdx++) {
      setDrawAnimation(prev => ({ ...prev, currentPot: potIdx + 1 }));
      for (const playerId of pots[potIdx]) {
        await new Promise(r => setTimeout(r, 600));
        drawn.push({ playerId, pot: potIdx + 1 });
        setDrawnOrder([...drawn]);
      }
      await new Promise(r => setTimeout(r, 400));
    }

    let tournamentData = {
      id: Date.now().toString(),
      type: tournamentType,
      players: playerIds,
      teamSelections,
      created: new Date().toISOString()
    };

    if (tournamentType === 'knockout') {
      const bracketSize = Math.pow(2, Math.ceil(Math.log2(playerIds.length)));
      const bracket = new Array(bracketSize).fill(null);
      const flattened = pots.flat();
      
      flattened.forEach((pid, idx) => {
        if (idx < bracketSize) bracket[idx] = pid;
      });
      
      tournamentData.knockoutBracket = { 0: bracket };
      tournamentData.knockoutResults = {};
      tournamentData.phase = 'knockout';
    } else if (tournamentType === 'groups') {
      const groups = Array.from({ length: groupCount }, () => []);
      let groupIdx = 0;
      let direction = 1;
      
      pots.flat().forEach(pid => {
        groups[groupIdx].push(pid);
        groupIdx += direction;
        if (groupIdx >= groupCount) { groupIdx = groupCount - 1; direction = -1; }
        else if (groupIdx < 0) { groupIdx = 0; direction = 1; }
      });
      
      const groupFixtures = groups.map(g => generateGroupFixtures(g));
      
      tournamentData.groups = groups;
      tournamentData.groupFixtures = groupFixtures;
      tournamentData.phase = 'groups';
    }

    setDrawAnimation({ phase: 'complete' });
    await new Promise(r => setTimeout(r, 500));
    save('fct-tournament', tournamentData, setTournament);
    setShowDraw(false); setShowTournamentSetup(false); setShowTeamSelect(false);
    setDrawAnimation(null); setDrawnOrder([]);
  };

  // H2H
  const getH2HRecord = (p1Id, p2Id) => {
    let w = 0, d = 0, l = 0, gf = 0, ga = 0;
    matches.forEach(m => {
      if (m.player1 === p1Id && m.player2 === p2Id) {
        gf += m.score1; ga += m.score2;
        if (m.score1 > m.score2) w++; else if (m.score1 < m.score2) l++; else d++;
      } else if (m.player1 === p2Id && m.player2 === p1Id) {
        gf += m.score2; ga += m.score1;
        if (m.score2 > m.score1) w++; else if (m.score2 < m.score1) l++; else d++;
      }
    });
    return { w, d, l, gf, ga, played: w + d + l };
  };

  const getPlayerName = (id) => players.find(p => p.id === id)?.name || 'TBD';
  const getPlayerForm = (pid) => matches.filter(m => m.player1 === pid || m.player2 === pid).slice(-5).map(m => {
    const isP1 = m.player1 === pid;
    const my = isP1 ? m.score1 : m.score2, their = isP1 ? m.score2 : m.score1;
    return my > their ? 'W' : my < their ? 'L' : 'D';
  });

  // OCR
  const processOCR = async (base64, mediaType) => {
    setOcrProcessing(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 500,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Extract the final score from this EA FC/FIFA match result screenshot. Return ONLY JSON: {"team1":"Name","score1":0,"team2":"Name","score2":0} or {"error":"reason"}' }
          ]}]
        })
      });
      const data = await response.json();
      const result = JSON.parse((data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim());
      setOcrResult(result.error ? { error: result.error } : result);
    } catch (e) { setOcrResult({ error: 'Failed to process image' }); }
    setOcrProcessing(false);
  };

  const captureTwitch = async () => {
    if (!twitchChannel.trim()) return;
    setOcrProcessing(true);
    save('fct-twitch', twitchChannel.trim(), setTwitchChannel);
    try {
      const url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchChannel.toLowerCase().replace(/[^a-z0-9_]/g, '')}-1920x1080.jpg?t=${Date.now()}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });
      await processOCR(base64, 'image/jpeg');
    } catch (e) { setOcrResult({ error: 'Could not capture stream. Is it live?' }); setOcrProcessing(false); }
  };

  const standings = calculateStandings();
  const eloRanking = [...players].sort((a, b) => (eloRatings[b.id] || ELO_START) - (eloRatings[a.id] || ELO_START));

  if (loading) return <div style={s.container}><div style={s.loading}>Loading...</div></div>;

  return (
    <div style={s.container}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logoArea}>
          <div style={s.logo}>FC</div>
          <div>
            <h1 style={s.title}>FRIENDLIES TRACKER</h1>
            <p style={s.subtitle}>{currentSeason?.name || 'All Time'} | {players.length} Players | {matches.length} Matches</p>
          </div>
        </div>
        <div style={s.headerBtns}>
          <button onClick={() => setShowAddPlayer(true)} style={s.btnSec}>+ Player</button>
          <button onClick={() => setShowOCR(true)} style={s.btnPri}>Scan</button>
          <button onClick={() => setShowAddMatch(true)} style={s.btnAcc}>+ Match</button>
        </div>
      </header>

      {/* Nav */}
      <nav style={s.nav}>
        {['standings', 'elo', 'h2h', 'matches', 'tournament'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{...s.navBtn, ...(view === v ? s.navActive : {})}}>
            {v === 'elo' ? 'ELO' : v.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={s.main}>
        {/* Standings */}
        {view === 'standings' && (
          <div style={s.card}>
            <div style={s.cardHead}><h2 style={s.cardTitle}>LEAGUE TABLE</h2><span style={s.badge}>H2H + Goal Avg</span></div>
            {standings.length === 0 ? <p style={s.empty}>Add players to start</p> : (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead><tr>
                    <th style={s.th}>#</th><th style={{...s.th, textAlign:'left'}}>PLAYER</th>
                    <th style={s.th}>P</th><th style={s.th}>W</th><th style={s.th}>D</th><th style={s.th}>L</th>
                    <th style={s.th}>GF</th><th style={s.th}>GA</th><th style={s.th}>GD</th><th style={s.th}>PTS</th><th style={s.th}>FORM</th>
                  </tr></thead>
                  <tbody>
                    {standings.map((st, i) => {
                      const form = getPlayerForm(st.id);
                      const team = tournament?.teamSelections?.[st.id];
                      return (
                        <tr key={st.id} style={{...s.tr, ...(i === 0 ? s.trGold : i < 4 ? s.trTop : {})}}>
                          <td style={s.td}><span style={{...s.pos, ...(i === 0 ? s.posGold : i < 4 ? s.posTop : {})}}>{i + 1}</span></td>
                          <td style={{...s.td, textAlign: 'left'}}>
                            <div style={s.playerCell}>
                              <span style={s.playerName}>{st.name}</span>
                              {team && <span style={s.teamTag}>{team}</span>}
                            </div>
                          </td>
                          <td style={s.td}>{st.played}</td>
                          <td style={{...s.td, color: '#4ade80'}}>{st.won}</td>
                          <td style={s.td}>{st.drawn}</td>
                          <td style={{...s.td, color: '#f87171'}}>{st.lost}</td>
                          <td style={s.td}>{st.gf}</td><td style={s.td}>{st.ga}</td>
                          <td style={{...s.td, color: st.gd > 0 ? '#4ade80' : st.gd < 0 ? '#f87171' : '#888'}}>{st.gd > 0 ? '+' : ''}{st.gd}</td>
                          <td style={s.tdPts}>{st.points}</td>
                          <td style={s.td}><div style={s.formRow}>{form.map((f, fi) => <span key={fi} style={{...s.formDot, background: f === 'W' ? '#4ade80' : f === 'L' ? '#f87171' : '#888'}}>{f}</span>)}</div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ELO */}
        {view === 'elo' && (
          <div style={s.card}>
            <div style={s.cardHead}><h2 style={s.cardTitle}>ELO RATINGS</h2><span style={s.badge}>K={ELO_K}</span></div>
            <div style={s.eloList}>
              {eloRanking.map((p, i) => {
                const elo = eloRatings[p.id] || ELO_START;
                const diff = elo - ELO_START;
                return (
                  <div key={p.id} style={{...s.eloCard, ...(i === 0 ? s.eloGold : {})}}>
                    <span style={{...s.pos, ...(i === 0 ? s.posGold : i < 3 ? s.posTop : {})}}>{i + 1}</span>
                    <div style={s.eloInfo}><span style={s.eloName}>{p.name}</span></div>
                    <div style={s.eloScore}>
                      <span style={s.eloNum}>{elo}</span>
                      <span style={{...s.eloDiff, color: diff > 0 ? '#4ade80' : diff < 0 ? '#f87171' : '#888'}}>{diff > 0 ? '+' : ''}{diff}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* H2H */}
        {view === 'h2h' && (
          <div style={s.card}>
            <div style={s.cardHead}><h2 style={s.cardTitle}>HEAD TO HEAD</h2></div>
            {players.length < 2 ? <p style={s.empty}>Need 2+ players</p> : (
              <div style={{...s.h2hGrid, gridTemplateColumns: `120px repeat(${players.length}, 1fr)`}}>
                <div></div>
                {players.map(p => <div key={p.id} style={s.h2hHead}>{p.name.slice(0,3).toUpperCase()}</div>)}
                {players.map(p1 => (
                  <React.Fragment key={p1.id}>
                    <div style={s.h2hRowHead}>{p1.name}</div>
                    {players.map(p2 => {
                      if (p1.id === p2.id) return <div key={p2.id} style={s.h2hSelf}></div>;
                      const rec = getH2HRecord(p1.id, p2.id);
                      const wr = rec.played > 0 ? rec.w / rec.played : 0.5;
                      return (
                        <div key={p2.id} style={{...s.h2hCell, background: rec.played === 0 ? 'transparent' : wr > 0.5 ? `rgba(74,222,128,${0.15+wr*0.35})` : wr < 0.5 ? `rgba(248,113,113,${0.15+(1-wr)*0.35})` : 'rgba(136,136,136,0.2)'}}>
                          {rec.played > 0 ? <><span style={s.h2hScore}>{rec.w}-{rec.d}-{rec.l}</span><span style={s.h2hGoals}>{rec.gf}:{rec.ga}</span></> : '-'}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matches */}
        {view === 'matches' && (
          <div style={s.card}>
            <div style={s.cardHead}><h2 style={s.cardTitle}>MATCH HISTORY</h2></div>
            <div style={s.matchList}>
              {[...matches].reverse().slice(0, 20).map(m => (
                <div key={m.id} style={s.matchCard}>
                  <div style={s.matchDate}>{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  <div style={s.matchContent}>
                    <div style={{...s.matchPlayer, ...(m.score1 > m.score2 ? s.matchWinner : {})}}>
                      <span>{getPlayerName(m.player1)}</span>
                      {m.team1 && <span style={s.matchTeam}>{m.team1}</span>}
                    </div>
                    <div style={s.matchScoreBox}>
                      <span style={m.score1 > m.score2 ? s.scoreWin : {}}>{m.score1}</span>
                      <span style={s.scoreSep}>-</span>
                      <span style={m.score2 > m.score1 ? s.scoreWin : {}}>{m.score2}</span>
                    </div>
                    <div style={{...s.matchPlayer, ...s.matchPlayerR, ...(m.score2 > m.score1 ? s.matchWinner : {})}}>
                      <span>{getPlayerName(m.player2)}</span>
                      {m.team2 && <span style={s.matchTeam}>{m.team2}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tournament */}
        {view === 'tournament' && (
          <div style={s.card}>
            <div style={s.cardHead}>
              <h2 style={s.cardTitle}>TOURNAMENT</h2>
              {!tournament ? (
                <button onClick={() => setShowTournamentSetup(true)} style={s.btnPri}>Create</button>
              ) : (
                <button onClick={() => { save('fct-tournament', null, setTournament); }} style={s.btnDanger}>End</button>
              )}
            </div>

            {tournament?.phase === 'groups' && tournament.groups && (
              <div style={s.groupsContainer}>
                <h3 style={s.sectionTitle}>GROUP STAGE</h3>
                <div style={s.groupsGrid}>
                  {tournament.groups.map((group, gi) => {
                    const groupStandings = calculateStandings(true).filter(st => group.includes(st.id));
                    return (
                      <div key={gi} style={s.groupCard}>
                        <h4 style={s.groupTitle}>GROUP {String.fromCharCode(65 + gi)}</h4>
                        <table style={s.groupTable}>
                          <thead><tr><th style={s.gth}>Player</th><th style={s.gth}>P</th><th style={s.gth}>W</th><th style={s.gth}>D</th><th style={s.gth}>L</th><th style={s.gth}>GD</th><th style={s.gth}>Pts</th></tr></thead>
                          <tbody>
                            {groupStandings.map((st, i) => (
                              <tr key={st.id} style={i < 2 ? s.qualifyRow : {}}>
                                <td style={s.gtd}>{st.name}</td>
                                <td style={s.gtd}>{st.played}</td><td style={s.gtd}>{st.won}</td>
                                <td style={s.gtd}>{st.drawn}</td><td style={s.gtd}>{st.lost}</td>
                                <td style={s.gtd}>{st.gd}</td><td style={s.gtdPts}>{st.points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={s.fixturesTitle}>Fixtures</div>
                        <div style={s.fixtures}>
                          {tournament.groupFixtures?.[gi]?.map((fix, fi) => {
                            const played = matches.find(m => m.tournamentId === tournament.id && 
                              ((m.player1 === fix.home && m.player2 === fix.away) || (m.player1 === fix.away && m.player2 === fix.home)));
                            return (
                              <div key={fi} style={s.fixture}>
                                <span style={s.fixPlayer}>{getPlayerName(fix.home)}</span>
                                {played ? (
                                  <span style={s.fixScore}>{played.player1 === fix.home ? played.score1 : played.score2} - {played.player1 === fix.home ? played.score2 : played.score1}</span>
                                ) : (
                                  <span style={s.fixVs}>vs</span>
                                )}
                                <span style={s.fixPlayer}>{getPlayerName(fix.away)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tournament?.phase === 'knockout' && tournament.knockoutBracket && (
              <div style={s.bracketContainer}>
                <h3 style={s.sectionTitle}>KNOCKOUT BRACKET</h3>
                <div style={s.bracketScroll}>
                  {Object.entries(tournament.knockoutBracket).map(([roundStr, roundPlayers]) => {
                    const round = parseInt(roundStr);
                    const matchups = [];
                    for (let i = 0; i < roundPlayers.length; i += 2) {
                      matchups.push({ p1: roundPlayers[i], p2: roundPlayers[i + 1], matchIdx: i / 2 });
                    }
                    return (
                      <div key={round} style={s.bracketRound}>
                        <h4 style={s.roundTitle}>{roundPlayers.length === 2 ? 'FINAL' : roundPlayers.length === 4 ? 'SEMI-FINALS' : roundPlayers.length === 8 ? 'QUARTER-FINALS' : `ROUND ${round + 1}`}</h4>
                        {matchups.map((m, mi) => {
                          const result = tournament.knockoutResults?.[round]?.[m.matchIdx];
                          return (
                            <div key={mi} style={s.bracketMatch} onClick={() => !result && m.p1 && m.p2 && setShowKnockoutMatch({ round, matchIdx: m.matchIdx, p1: m.p1, p2: m.p2 })}>
                              <div style={{...s.bracketPlayer, ...(result?.winner === m.p1 ? s.bracketWinner : {}), ...(!m.p1 ? s.bracketTBD : {})}}>
                                <span>{m.p1 ? getPlayerName(m.p1) : 'TBD'}</span>
                                {tournament.teamSelections?.[m.p1] && <span style={s.bracketTeam}>{tournament.teamSelections[m.p1]}</span>}
                              </div>
                              {result ? (
                                <div style={s.bracketResult}>{result.score}</div>
                              ) : (
                                <div style={s.bracketVs}>{m.p1 && m.p2 ? 'Click to play' : 'vs'}</div>
                              )}
                              <div style={{...s.bracketPlayer, ...(result?.winner === m.p2 ? s.bracketWinner : {}), ...(!m.p2 ? s.bracketTBD : {})}}>
                                <span>{m.p2 ? getPlayerName(m.p2) : 'TBD'}</span>
                                {tournament.teamSelections?.[m.p2] && <span style={s.bracketTeam}>{tournament.teamSelections[m.p2]}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!tournament && <p style={s.empty}>Create a tournament to get started</p>}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddPlayer && <Modal onClose={() => setShowAddPlayer(false)} title="ADD PLAYER">
        <input type="text" placeholder="Name" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} style={s.input} autoFocus />
        <input type="text" placeholder="PSN ID (optional)" value={newPlayerPSN} onChange={e => setNewPlayerPSN(e.target.value)} style={s.input} />
        <div style={s.modalBtns}><button onClick={() => setShowAddPlayer(false)} style={s.btnSec}>Cancel</button><button onClick={addPlayer} style={s.btnPri}>Add</button></div>
      </Modal>}

      {showAddMatch && <Modal onClose={() => setShowAddMatch(false)} title="LOG MATCH">
        <select value={matchData.player1} onChange={e => setMatchData({...matchData, player1: e.target.value})} style={s.select}>
          <option value="">Player 1</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={s.scoreRow}>
          <input type="number" min="0" max="99" value={matchData.score1} onChange={e => setMatchData({...matchData, score1: e.target.value})} style={s.scoreInput} />
          <span style={s.vs}>VS</span>
          <input type="number" min="0" max="99" value={matchData.score2} onChange={e => setMatchData({...matchData, score2: e.target.value})} style={s.scoreInput} />
        </div>
        <select value={matchData.player2} onChange={e => setMatchData({...matchData, player2: e.target.value})} style={s.select}>
          <option value="">Player 2</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={s.modalBtns}><button onClick={() => setShowAddMatch(false)} style={s.btnSec}>Cancel</button><button onClick={() => addMatch(matchData.player1, matchData.player2, matchData.score1, matchData.score2)} style={s.btnAcc}>Log</button></div>
      </Modal>}

      {showKnockoutMatch && <Modal onClose={() => setShowKnockoutMatch(null)} title="KNOCKOUT MATCH">
        <div style={s.knockoutMatchup}>
          <span style={s.knockoutPlayer}>{getPlayerName(showKnockoutMatch.p1)}</span>
          <span style={s.knockoutVs}>VS</span>
          <span style={s.knockoutPlayer}>{getPlayerName(showKnockoutMatch.p2)}</span>
        </div>
        <div style={s.scoreRow}>
          <input type="number" min="0" max="99" value={matchData.score1} onChange={e => setMatchData({...matchData, score1: e.target.value})} style={s.scoreInput} />
          <span style={s.vs}>-</span>
          <input type="number" min="0" max="99" value={matchData.score2} onChange={e => setMatchData({...matchData, score2: e.target.value})} style={s.scoreInput} />
        </div>
        <div style={s.modalBtns}>
          <button onClick={() => setShowKnockoutMatch(null)} style={s.btnSec}>Cancel</button>
          <button onClick={() => addMatch(showKnockoutMatch.p1, showKnockoutMatch.p2, matchData.score1, matchData.score2, showKnockoutMatch.round, showKnockoutMatch.matchIdx)} style={s.btnAcc}>Submit Result</button>
        </div>
      </Modal>}

      {showTournamentSetup && !showTeamSelect && !showDraw && <Modal onClose={() => setShowTournamentSetup(false)} title="CREATE TOURNAMENT">
        <div style={s.typeOptions}>
          <button onClick={() => setTournamentType('knockout')} style={{...s.typeBtn, ...(tournamentType === 'knockout' ? s.typeSel : {})}}>
            <span style={s.typeTitle}>Knockout</span><span style={s.typeDesc}>Single elimination bracket</span>
          </button>
          <button onClick={() => setTournamentType('groups')} style={{...s.typeBtn, ...(tournamentType === 'groups' ? s.typeSel : {})}}>
            <span style={s.typeTitle}>Groups + Knockout</span><span style={s.typeDesc}>Group stage then elimination</span>
          </button>
        </div>
        {tournamentType === 'groups' && (
          <div style={s.groupCountRow}>
            <span>Number of groups:</span>
            <select value={groupCount} onChange={e => setGroupCount(parseInt(e.target.value))} style={s.selectSmall}>
              {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
        <div style={s.modalBtns}><button onClick={() => setShowTournamentSetup(false)} style={s.btnSec}>Cancel</button><button onClick={() => setShowTeamSelect(true)} style={s.btnPri}>Select Teams</button></div>
      </Modal>}

      {showTeamSelect && <Modal onClose={() => setShowTeamSelect(false)} title="SELECT TEAMS" wide>
        <p style={s.modalDesc}>Each player picks their team for this tournament</p>
        <div style={s.teamSelectList}>
          {players.map(p => (
            <div key={p.id} style={s.teamSelectRow}>
              <span style={s.teamSelectName}>{p.name}</span>
              <TeamSearchSelect value={teamSelections[p.id] || ''} onChange={team => setTeamSelections({...teamSelections, [p.id]: team})} />
            </div>
          ))}
        </div>
        <div style={s.modalBtns}><button onClick={() => setShowTeamSelect(false)} style={s.btnSec}>Back</button><button onClick={() => { setShowTeamSelect(false); setShowDraw(true); performDraw(); }} style={s.btnAcc}>Proceed to Draw</button></div>
      </Modal>}

      {showDraw && <Modal title="TOURNAMENT DRAW">
        {drawAnimation?.phase === 'drawing' && <p style={s.drawStatus}>Drawing from Pot {drawAnimation.currentPot}...</p>}
        <div style={s.drawnGrid}>
          {drawnOrder.map((d, i) => (
            <div key={i} style={s.drawnCard}>
              <span style={s.drawnPot}>Pot {d.pot}</span>
              <span style={s.drawnName}>{getPlayerName(d.playerId)}</span>
              {teamSelections[d.playerId] && <span style={s.drawnTeam}>{teamSelections[d.playerId]}</span>}
            </div>
          ))}
        </div>
        {drawAnimation?.phase === 'complete' && <p style={s.drawComplete}>Draw complete!</p>}
      </Modal>}

      {showOCR && <Modal onClose={() => { setShowOCR(false); setOcrResult(null); }} title="SCAN SCORE" wide>
        <div style={s.ocrTabs}>
          <div style={s.ocrTab}>
            <h4 style={s.ocrTabTitle}>Twitch Stream</h4>
            <div style={s.twitchRow}>
              <span style={s.twitchPre}>twitch.tv/</span>
              <input type="text" placeholder="channel" value={twitchChannel} onChange={e => setTwitchChannel(e.target.value)} style={s.twitchInput} />
            </div>
            <button onClick={captureTwitch} disabled={ocrProcessing} style={s.btnPri}>Capture Frame</button>
          </div>
          <div style={s.ocrOr}>OR</div>
          <div style={s.ocrTab}>
            <h4 style={s.ocrTabTitle}>Upload Screenshot</h4>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              const b64 = await new Promise(r => { const rd = new FileReader(); rd.onload = () => r(rd.result.split(',')[1]); rd.readAsDataURL(file); });
              await processOCR(b64, file.type);
            }} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} style={s.uploadBtn}>Choose File</button>
          </div>
        </div>
        {ocrProcessing && <div style={s.ocrLoading}><div style={s.spinner}></div>Analyzing...</div>}
        {ocrResult && !ocrResult.error && (
          <div style={s.ocrResult}>
            <div style={s.ocrDetected}><span style={s.ocrScoreDisplay}>{ocrResult.team1} {ocrResult.score1} - {ocrResult.score2} {ocrResult.team2}</span></div>
            <select value={matchData.player1} onChange={e => setMatchData({...matchData, player1: e.target.value, score1: ocrResult.score1})} style={s.select}>
              <option value="">{ocrResult.team1} played by...</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={matchData.player2} onChange={e => setMatchData({...matchData, player2: e.target.value, score2: ocrResult.score2})} style={s.select}>
              <option value="">{ocrResult.team2} played by...</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={() => addMatch(matchData.player1, matchData.player2, ocrResult.score1, ocrResult.score2)} disabled={!matchData.player1 || !matchData.player2} style={s.btnAcc}>Confirm Match</button>
          </div>
        )}
        {ocrResult?.error && <div style={s.ocrError}>{ocrResult.error}</div>}
      </Modal>}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ============ TEAM SEARCH SELECT COMPONENT ============
function TeamSearchSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = useMemo(() => {
    if (!search) return ALL_TEAMS.slice(0, 50);
    const q = search.toLowerCase();
    return ALL_TEAMS.filter(t => t.name.toLowerCase().includes(q) || t.league.toLowerCase().includes(q)).slice(0, 30);
  }, [search]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={s.teamSelect}>
      <div style={s.teamSelectTrigger} onClick={() => setOpen(!open)}>
        {value ? (
          <div style={s.teamSelectValue}>
            <span style={s.teamInitials}>{value.slice(0, 2).toUpperCase()}</span>
            <span>{value}</span>
          </div>
        ) : <span style={s.teamSelectPlaceholder}>Select team...</span>}
      </div>
      {open && (
        <div style={s.teamDropdown}>
          <input type="text" placeholder="Search teams..." value={search} onChange={e => setSearch(e.target.value)} style={s.teamSearchInput} autoFocus />
          <div style={s.teamList}>
            {filtered.map((t, i) => (
              <div key={i} style={s.teamOption} onClick={() => { onChange(t.name); setOpen(false); setSearch(''); }}>
                <span style={s.teamInitials}>{t.name.slice(0, 2).toUpperCase()}</span>
                <div style={s.teamOptionInfo}>
                  <span style={s.teamOptionName}>{t.name}</span>
                  <span style={s.teamOptionLeague}>{t.league}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ MODAL COMPONENT ============
function Modal({ onClose, title, children, wide }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{...s.modal, ...(wide ? s.modalWide : {})}} onClick={e => e.stopPropagation()}>
        <h3 style={s.modalTitle}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ============ STYLES ============
const s = {
  container: { minHeight: '100vh', background: 'linear-gradient(145deg, #080810, #0f0f1a, #0a0a12)', color: '#e5e5e5', fontFamily: "'Archivo', sans-serif" },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', flexWrap: 'wrap', gap: '1rem' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', color: '#000' },
  title: { fontSize: '1.2rem', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '0.65rem', color: '#666', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' },
  headerBtns: { display: 'flex', gap: '0.5rem' },
  btnPri: { padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer' },
  btnAcc: { padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', borderRadius: '6px', color: '#000', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' },
  btnSec: { padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#bbb', fontWeight: '500', fontSize: '0.75rem', cursor: 'pointer' },
  btnDanger: { padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#fca5a5', fontSize: '0.7rem', cursor: 'pointer' },
  nav: { display: 'flex', gap: '0.2rem', padding: '0.6rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', overflowX: 'auto' },
  navBtn: { padding: '0.4rem 1rem', background: 'transparent', border: 'none', color: '#666', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', whiteSpace: 'nowrap' },
  navActive: { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  main: { padding: '1.25rem 1.5rem', maxWidth: '1200px', margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  cardTitle: { fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.1em', margin: 0 },
  badge: { fontSize: '0.55rem', padding: '0.15rem 0.5rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '4px', color: '#fbbf24', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#555', padding: '2rem', fontSize: '0.8rem' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' },
  th: { padding: '0.5rem 0.3rem', textAlign: 'center', color: '#555', fontWeight: '600', fontSize: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  trGold: { background: 'rgba(251,191,36,0.06)' },
  trTop: { background: 'rgba(99,102,241,0.04)' },
  td: { padding: '0.5rem 0.3rem', textAlign: 'center', color: '#bbb' },
  tdPts: { padding: '0.5rem 0.3rem', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem', color: '#fff' },
  pos: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '700', background: 'rgba(255,255,255,0.08)', color: '#777' },
  posGold: { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#000' },
  posTop: { background: 'rgba(99,102,241,0.3)', color: '#a5b4fc' },
  playerCell: { display: 'flex', flexDirection: 'column', gap: '0.05rem' },
  playerName: { fontWeight: '600', color: '#fff' },
  teamTag: { fontSize: '0.55rem', color: '#fbbf24' },
  formRow: { display: 'flex', gap: '2px', justifyContent: 'center' },
  formDot: { width: '14px', height: '14px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: '700', color: '#000' },
  eloList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  eloCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' },
  eloGold: { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' },
  eloInfo: { flex: 1 },
  eloName: { fontWeight: '600', color: '#fff', fontSize: '0.85rem' },
  eloScore: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  eloNum: { fontSize: '1.1rem', fontWeight: '800', color: '#fff' },
  eloDiff: { fontSize: '0.65rem', fontWeight: '600' },
  h2hGrid: { display: 'grid', gap: '2px', fontSize: '0.65rem' },
  h2hHead: { padding: '0.35rem', textAlign: 'center', fontWeight: '700', color: '#666', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' },
  h2hRowHead: { padding: '0.35rem', fontWeight: '600', color: '#bbb', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' },
  h2hSelf: { background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.01), rgba(255,255,255,0.01) 3px, transparent 3px, transparent 6px)', borderRadius: '4px' },
  h2hCell: { padding: '0.35rem', textAlign: 'center', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '40px' },
  h2hScore: { fontWeight: '700', color: '#fff', fontSize: '0.7rem' },
  h2hGoals: { fontSize: '0.55rem', color: '#777' },
  matchList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  matchCard: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' },
  matchDate: { fontSize: '0.6rem', color: '#555', minWidth: '40px' },
  matchContent: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' },
  matchPlayer: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', fontSize: '0.75rem', color: '#999' },
  matchPlayerR: { alignItems: 'center' },
  matchWinner: { color: '#fff', fontWeight: '600' },
  matchTeam: { fontSize: '0.55rem', color: '#666' },
  matchScoreBox: { display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1rem', fontWeight: '800' },
  scoreSep: { color: '#333' },
  scoreWin: { color: '#4ade80' },
  sectionTitle: { fontSize: '0.75rem', fontWeight: '700', color: '#888', letterSpacing: '0.1em', marginBottom: '1rem' },
  groupsContainer: { marginTop: '0.5rem' },
  groupsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' },
  groupCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' },
  groupTitle: { fontSize: '0.75rem', fontWeight: '700', color: '#a5b4fc', marginBottom: '0.75rem' },
  groupTable: { width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', marginBottom: '0.75rem' },
  gth: { padding: '0.3rem', textAlign: 'center', color: '#555', fontWeight: '600', fontSize: '0.55rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  gtd: { padding: '0.3rem', textAlign: 'center', color: '#bbb' },
  gtdPts: { padding: '0.3rem', textAlign: 'center', fontWeight: '700', color: '#fff' },
  qualifyRow: { background: 'rgba(74,222,128,0.08)' },
  fixturesTitle: { fontSize: '0.6rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' },
  fixtures: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  fixture: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '0.65rem' },
  fixPlayer: { color: '#ccc', flex: 1 },
  fixVs: { color: '#555', padding: '0 0.5rem' },
  fixScore: { color: '#4ade80', fontWeight: '700', padding: '0 0.5rem' },
  bracketContainer: { marginTop: '0.5rem' },
  bracketScroll: { display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.5rem 0' },
  bracketRound: { minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  roundTitle: { fontSize: '0.65rem', fontWeight: '700', color: '#666', textAlign: 'center', marginBottom: '0.5rem' },
  bracketMatch: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem', cursor: 'pointer' },
  bracketPlayer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', fontSize: '0.7rem', color: '#ccc', marginBottom: '0.25rem' },
  bracketWinner: { background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: '600' },
  bracketTBD: { color: '#555', fontStyle: 'italic' },
  bracketTeam: { fontSize: '0.55rem', color: '#888' },
  bracketVs: { textAlign: 'center', fontSize: '0.55rem', color: '#555', padding: '0.2rem 0' },
  bracketResult: { textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#fff', padding: '0.2rem 0' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: 'linear-gradient(145deg, #18182a, #12121a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', maxWidth: '400px', width: '100%', maxHeight: '90vh', overflowY: 'auto' },
  modalWide: { maxWidth: '550px' },
  modalTitle: { fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1rem', textAlign: 'center' },
  modalDesc: { color: '#777', fontSize: '0.75rem', marginBottom: '0.75rem', textAlign: 'center' },
  modalBtns: { display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' },
  input: { width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', marginBottom: '0.5rem', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', marginBottom: '0.5rem', boxSizing: 'border-box' },
  selectSmall: { padding: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' },
  scoreRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', margin: '0.6rem 0' },
  scoreInput: { width: '55px', padding: '0.7rem', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(251,191,36,0.25)', borderRadius: '6px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', textAlign: 'center' },
  vs: { fontWeight: '800', color: '#444' },
  knockoutMatchup: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' },
  knockoutPlayer: { fontSize: '1rem', fontWeight: '700', color: '#fff' },
  knockoutVs: { color: '#555', fontWeight: '600' },
  typeOptions: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' },
  typeBtn: { padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' },
  typeSel: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)' },
  typeTitle: { display: 'block', fontWeight: '700', color: '#fff', marginBottom: '0.15rem' },
  typeDesc: { display: 'block', fontSize: '0.7rem', color: '#777' },
  groupCountRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#ccc' },
  teamSelectList: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' },
  teamSelectRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  teamSelectName: { minWidth: '80px', fontWeight: '600', color: '#ccc', fontSize: '0.8rem' },
  teamSelect: { flex: 1, position: 'relative' },
  teamSelectTrigger: { padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' },
  teamSelectValue: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' },
  teamSelectPlaceholder: { color: '#666' },
  teamInitials: { width: '24px', height: '24px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: '700', color: '#fff' },
  teamDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', marginTop: '4px', zIndex: 100, maxHeight: '250px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  teamSearchInput: { padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', outline: 'none' },
  teamList: { overflowY: 'auto', flex: 1 },
  teamOption: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  teamOptionInfo: { display: 'flex', flexDirection: 'column' },
  teamOptionName: { fontSize: '0.75rem', color: '#fff' },
  teamOptionLeague: { fontSize: '0.55rem', color: '#666' },
  drawStatus: { textAlign: 'center', color: '#a5b4fc', marginBottom: '0.75rem', fontSize: '0.85rem' },
  drawnGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' },
  drawnCard: { padding: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', animation: 'fadeIn 0.4s ease-out' },
  drawnPot: { display: 'block', fontSize: '0.55rem', color: '#a5b4fc', fontWeight: '600', marginBottom: '0.2rem' },
  drawnName: { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#fff' },
  drawnTeam: { display: 'block', fontSize: '0.6rem', color: '#fbbf24', marginTop: '0.15rem' },
  drawComplete: { textAlign: 'center', color: '#4ade80', marginTop: '1rem', fontWeight: '500' },
  ocrTabs: { display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' },
  ocrTab: { flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' },
  ocrTabTitle: { fontSize: '0.75rem', fontWeight: '700', color: '#fff', margin: '0 0 0.5rem 0' },
  ocrOr: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontWeight: '600', fontSize: '0.7rem' },
  twitchRow: { display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(145,70,255,0.3)' },
  twitchPre: { padding: '0.5rem', color: '#9146FF', fontSize: '0.7rem', fontWeight: '600' },
  twitchInput: { flex: 1, padding: '0.5rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.75rem', outline: 'none' },
  uploadBtn: { width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '6px', color: '#888', fontSize: '0.75rem', cursor: 'pointer' },
  ocrLoading: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', color: '#888' },
  spinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  ocrResult: { padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' },
  ocrDetected: { textAlign: 'center', padding: '0.75rem', background: 'rgba(74,222,128,0.08)', borderRadius: '6px', marginBottom: '0.75rem' },
  ocrScoreDisplay: { fontSize: '1rem', fontWeight: '700', color: '#4ade80' },
  ocrError: { textAlign: 'center', padding: '1rem', background: 'rgba(239,68,68,0.08)', borderRadius: '6px', color: '#fca5a5' },
};
