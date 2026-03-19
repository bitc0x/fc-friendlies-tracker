'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// ============ FIREBASE CONFIG ============
const firebaseConfig = {
  apiKey: "AIzaSyA4y7aGvFKQWxJUpHjJBTUzOwIWJd7YOTs",
  authDomain: "fc-friendlies-tracker.firebaseapp.com",
  databaseURL: "https://fc-friendlies-tracker-default-rtdb.firebaseio.com",
  projectId: "fc-friendlies-tracker",
  storageBucket: "fc-friendlies-tracker.firebasestorage.app",
  messagingSenderId: "480194965245",
  appId: "1:480194965245:web:830ac0ee13cc95422bd894"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

// ============ LOCAL STORAGE (for auth only) ============
const localStorage_ = {
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

// ============ FIREBASE HELPERS ============
const dbSet = (path, data) => set(ref(db, path), data);

// ============ MAIN COMPONENT ============
function FCTracker({ isAdmin }) {
  const [view, setView] = useState('standings');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [eloOverrides, setEloOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showTournamentSetup, setShowTournamentSetup] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [showDraw, setShowDraw] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [showKnockoutMatch, setShowKnockoutMatch] = useState(null);
  const [showEloEditor, setShowEloEditor] = useState(null);
  const [showPlayerStats, setShowPlayerStats] = useState(null);
  
  // Form states
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPSN, setNewPlayerPSN] = useState('');
  const [matchData, setMatchData] = useState({ player1: '', player2: '', score1: 0, score2: 0 });
  const [teamSelections, setTeamSelections] = useState({});
  const [tournamentType, setTournamentType] = useState('league');
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

  // Load data from Firebase with realtime sync
  useEffect(() => {
    // Set up realtime listeners
    const unsubPlayers = onValue(ref(db, 'players'), (snapshot) => {
      setPlayers(snapshot.val() || []);
    });
    
    const unsubMatches = onValue(ref(db, 'matches'), (snapshot) => {
      setMatches(snapshot.val() || []);
    });
    
    const unsubTournament = onValue(ref(db, 'tournament'), (snapshot) => {
      setTournament(snapshot.val() || null);
    });
    
    const unsubEloOverrides = onValue(ref(db, 'eloOverrides'), (snapshot) => {
      setEloOverrides(snapshot.val() || {});
    });
    
    // Local storage for non-shared data
    setTwitchChannel(localStorage_.get('fct-twitch') || '');
    setLoading(false);
    
    // Cleanup listeners on unmount
    return () => {
      unsubPlayers();
      unsubMatches();
      unsubTournament();
      unsubEloOverrides();
    };
  }, []);

  // Save to Firebase
  const saveToDb = (path, data, setter) => {
    setter(data);
    dbSet(path, data);
  };

  // ELO (memoized for performance, with admin overrides)
  const eloRatings = useMemo(() => {
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
    // Apply admin overrides
    Object.entries(eloOverrides).forEach(([playerId, override]) => {
      if (override !== null && override !== undefined) {
        ratings[playerId] = override;
      }
    });
    return ratings;
  }, [players, matches, eloOverrides]);

  // Player CRUD
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = { id: Date.now().toString(), name: newPlayerName.trim(), psn: newPlayerPSN.trim() || null, created: new Date().toISOString() };
    saveToDb('players', [...players, newPlayer], setPlayers);
    setNewPlayerName(''); setNewPlayerPSN(''); setShowAddPlayer(false);
  };

  // Match CRUD
  const addMatch = (p1, p2, s1, s2, knockoutRound = null, knockoutMatchIdx = null, knockoutLeg = null) => {
    if (!p1 || !p2 || p1 === p2) return;
    const newMatch = {
      id: Date.now().toString(), player1: p1, player2: p2,
      score1: parseInt(s1) || 0, score2: parseInt(s2) || 0,
      date: new Date().toISOString(),
      tournamentId: tournament?.id || null,
      team1: tournament?.teamSelections?.[p1] || null, team2: tournament?.teamSelections?.[p2] || null,
      knockoutRound, knockoutMatchIdx, knockoutLeg
    };
    const newMatches = [...matches, newMatch];
    saveToDb('matches', newMatches, setMatches);
    
    // Handle league final (two-leg)
    if (tournament && knockoutRound === 'final' && knockoutLeg !== null) {
      const updatedTournament = JSON.parse(JSON.stringify(tournament));
      if (!updatedTournament.finalResult) updatedTournament.finalResult = {};
      
      const finalists = tournament.finalists;
      const origP1 = finalists[0];
      const origP2 = finalists[1];
      
      if (knockoutLeg === 1) {
        updatedTournament.finalResult.leg1 = { p1Goals: newMatch.score1, p2Goals: newMatch.score2 };
      } else {
        updatedTournament.finalResult.leg2 = { p1Goals: newMatch.score1, p2Goals: newMatch.score2 };
      }
      
      // Check if both legs are complete
      if (updatedTournament.finalResult.leg1 && updatedTournament.finalResult.leg2) {
        const p1Agg = updatedTournament.finalResult.leg1.p1Goals + updatedTournament.finalResult.leg2.p1Goals;
        const p2Agg = updatedTournament.finalResult.leg1.p2Goals + updatedTournament.finalResult.leg2.p2Goals;
        
        let winner = null;
        if (p1Agg > p2Agg) {
          winner = origP1;
        } else if (p2Agg > p1Agg) {
          winner = origP2;
        } else {
          // Aggregate tied - use away goals
          const p1Away = updatedTournament.finalResult.leg2.p1Goals;
          const p2Away = updatedTournament.finalResult.leg1.p2Goals;
          if (p1Away > p2Away) {
            winner = origP1;
          } else if (p2Away > p1Away) {
            winner = origP2;
          } else {
            // Still tied - higher seed (p1) wins
            winner = origP1;
          }
        }
        
        updatedTournament.finalResult.winner = winner;
        updatedTournament.finalResult.aggregate = `${p1Agg}-${p2Agg}`;
      }
      
      saveToDb('tournament', updatedTournament, setTournament);
    }
    // Handle two-leg knockout system
    else if (tournament && knockoutRound !== null && knockoutRound !== 'final' && knockoutMatchIdx !== null && knockoutLeg !== null) {
      const updatedTournament = JSON.parse(JSON.stringify(tournament));
      if (!updatedTournament.knockoutResults) updatedTournament.knockoutResults = {};
      if (!updatedTournament.knockoutResults[knockoutRound]) updatedTournament.knockoutResults[knockoutRound] = {};
      if (!updatedTournament.knockoutResults[knockoutRound][knockoutMatchIdx]) {
        updatedTournament.knockoutResults[knockoutRound][knockoutMatchIdx] = {};
      }
      
      const matchResult = updatedTournament.knockoutResults[knockoutRound][knockoutMatchIdx];
      
      // Store this leg's result
      if (knockoutLeg === 1) {
        matchResult.leg1 = { p1Goals: newMatch.score1, p2Goals: newMatch.score2 };
      } else {
        matchResult.leg2 = { p1Goals: newMatch.score1, p2Goals: newMatch.score2 };
      }
      
      // Check if both legs are complete
      if (matchResult.leg1 && matchResult.leg2) {
        // Calculate aggregate (p1 is always the "home" player in leg 1)
        const p1Agg = matchResult.leg1.p1Goals + matchResult.leg2.p1Goals;
        const p2Agg = matchResult.leg1.p2Goals + matchResult.leg2.p2Goals;
        
        // Determine winner by aggregate
        let winner = null;
        if (p1Agg > p2Agg) {
          winner = p1;
        } else if (p2Agg > p1Agg) {
          winner = p2;
        } else {
          // Aggregate tied - use away goals (p1 scored in leg2, p2 scored in leg1)
          const p1Away = matchResult.leg2.p1Goals;
          const p2Away = matchResult.leg1.p2Goals;
          if (p1Away > p2Away) {
            winner = p1;
          } else if (p2Away > p1Away) {
            winner = p2;
          } else {
            // Still tied - higher seed (p1) advances
            winner = p1;
          }
        }
        
        matchResult.winner = winner;
        matchResult.aggregate = `${p1Agg}-${p2Agg}`;
        
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
      }
      
      saveToDb('tournament', updatedTournament, setTournament);
    }
    
    setMatchData({ player1: '', player2: '', score1: 0, score2: 0 });
    setShowAddMatch(false); setShowKnockoutMatch(null); setShowOCR(false); setOcrResult(null);
  };

  // Delete last match (undo)
  const deleteLastMatch = () => {
    if (matches.length === 0) return;
    
    const lastMatch = matches[matches.length - 1];
    const p1Name = players.find(p => p.id === lastMatch.player1)?.name || 'Unknown';
    const p2Name = players.find(p => p.id === lastMatch.player2)?.name || 'Unknown';
    const legInfo = lastMatch.knockoutLeg ? ` (Leg ${lastMatch.knockoutLeg})` : '';
    
    if (!confirm(`Delete: ${p1Name} ${lastMatch.score1}-${lastMatch.score2} ${p2Name}${legInfo}?`)) return;
    
    const newMatches = matches.slice(0, -1);
    saveToDb('matches', newMatches, setMatches);
    
    // If it was a league final match, update finalResult
    if (tournament && lastMatch.knockoutRound === 'final' && lastMatch.knockoutLeg !== null) {
      const updatedTournament = JSON.parse(JSON.stringify(tournament));
      
      if (lastMatch.knockoutLeg === 1) {
        delete updatedTournament.finalResult?.leg1;
      } else if (lastMatch.knockoutLeg === 2) {
        if (updatedTournament.finalResult) {
          delete updatedTournament.finalResult.leg2;
          delete updatedTournament.finalResult.winner;
          delete updatedTournament.finalResult.aggregate;
        }
      }
      
      // Clean up empty finalResult
      if (updatedTournament.finalResult && Object.keys(updatedTournament.finalResult).length === 0) {
        updatedTournament.finalResult = null;
      }
      
      saveToDb('tournament', updatedTournament, setTournament);
    }
    // If it was a knockout match, also update tournament results
    else if (tournament && lastMatch.knockoutRound !== null && lastMatch.knockoutRound !== 'final' && lastMatch.knockoutLeg !== null) {
      const updatedTournament = JSON.parse(JSON.stringify(tournament));
      const matchResult = updatedTournament.knockoutResults?.[lastMatch.knockoutRound]?.[lastMatch.knockoutMatchIdx];
      
      if (matchResult) {
        // Remove the leg result
        if (lastMatch.knockoutLeg === 1) {
          delete matchResult.leg1;
        } else if (lastMatch.knockoutLeg === 2) {
          delete matchResult.leg2;
          // Also remove winner and aggregate if they were set
          delete matchResult.winner;
          delete matchResult.aggregate;
          
          // Remove advancement from next round
          const nextRound = lastMatch.knockoutRound + 1;
          const nextMatchIdx = Math.floor(lastMatch.knockoutMatchIdx / 2);
          const isFirstOfPair = lastMatch.knockoutMatchIdx % 2 === 0;
          if (updatedTournament.knockoutBracket[nextRound]) {
            updatedTournament.knockoutBracket[nextRound][nextMatchIdx * 2 + (isFirstOfPair ? 0 : 1)] = null;
          }
        }
        
        // Clean up empty objects
        if (Object.keys(matchResult).length === 0) {
          delete updatedTournament.knockoutResults[lastMatch.knockoutRound][lastMatch.knockoutMatchIdx];
        }
        
        saveToDb('tournament', updatedTournament, setTournament);
      }
    }
  };

  // Delete player
  const deletePlayer = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!confirm(`Remove ${player?.name}? Their match history will remain.`)) return;
    const newPlayers = players.filter(p => p.id !== playerId);
    saveToDb('players', newPlayers, setPlayers);
  };

  // Standings calculation
  const calculateStandings = (filterTournament = false) => {
    const stats = {};
    players.forEach(p => {
      stats[p.id] = { id: p.id, name: p.name, psn: p.psn, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
    });
    
    let relevantMatches = matches;
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

  // Group stage fixtures generator (two legs: home & away)
  const generateGroupFixtures = (groupPlayers) => {
    const fixtures = [];
    // First leg (home)
    for (let i = 0; i < groupPlayers.length; i++) {
      for (let j = i + 1; j < groupPlayers.length; j++) {
        fixtures.push({ home: groupPlayers[i], away: groupPlayers[j], leg: 1 });
      }
    }
    // Second leg (reverse, away becomes home)
    for (let i = 0; i < groupPlayers.length; i++) {
      for (let j = i + 1; j < groupPlayers.length; j++) {
        fixtures.push({ home: groupPlayers[j], away: groupPlayers[i], leg: 2 });
      }
    }
    // Shuffle within each leg group for variety
    const leg1 = fixtures.filter(f => f.leg === 1);
    const leg2 = fixtures.filter(f => f.leg === 2);
    [leg1, leg2].forEach(arr => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    });
    return [...leg1, ...leg2];
  };

  // Tournament draw
  const performDraw = async () => {
    // Only include players who have a team selected
    const playerIds = players.filter(p => teamSelections[p.id]).map(p => p.id);
    
    if (playerIds.length < 2) {
      alert('Need at least 2 players with teams selected');
      return;
    }
    
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

    // Only store teamSelections for participating players
    const participantTeams = {};
    playerIds.forEach(id => { participantTeams[id] = teamSelections[id]; });

    let tournamentData = {
      id: Date.now().toString(),
      type: tournamentType,
      players: playerIds,
      teamSelections: participantTeams,
      created: new Date().toISOString()
    };

    if (tournamentType === 'league') {
      // League + Final: everyone plays everyone twice, top 2 go to final
      const leagueFixtures = generateGroupFixtures(playerIds);
      tournamentData.leagueFixtures = leagueFixtures;
      tournamentData.phase = 'league';
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
    saveToDb('tournament', tournamentData, setTournament);
    setShowDraw(false); setShowTournamentSetup(false); setShowTeamSelect(false);
    setDrawAnimation(null); setDrawnOrder([]); setTeamSelections({});
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

  const getPlayerStats = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return null;
    
    const playerMatches = matches.filter(m => m.player1 === playerId || m.player2 === playerId);
    let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
    let biggestWin = null, biggestLoss = null;
    const opponents = {};
    
    playerMatches.forEach(m => {
      const isP1 = m.player1 === playerId;
      const myScore = isP1 ? m.score1 : m.score2;
      const theirScore = isP1 ? m.score2 : m.score1;
      const oppId = isP1 ? m.player2 : m.player1;
      
      goalsFor += myScore;
      goalsAgainst += theirScore;
      
      if (myScore > theirScore) {
        wins++;
        const diff = myScore - theirScore;
        if (!biggestWin || diff > biggestWin.diff) {
          biggestWin = { score: `${myScore}-${theirScore}`, opponent: oppId, diff };
        }
      } else if (myScore < theirScore) {
        losses++;
        const diff = theirScore - myScore;
        if (!biggestLoss || diff > biggestLoss.diff) {
          biggestLoss = { score: `${myScore}-${theirScore}`, opponent: oppId, diff };
        }
      } else {
        draws++;
      }
      
      if (!opponents[oppId]) opponents[oppId] = { w: 0, d: 0, l: 0 };
      if (myScore > theirScore) opponents[oppId].w++;
      else if (myScore < theirScore) opponents[oppId].l++;
      else opponents[oppId].d++;
    });
    
    const totalMatches = wins + draws + losses;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
    const avgGoalsFor = totalMatches > 0 ? (goalsFor / totalMatches).toFixed(1) : '0.0';
    const avgGoalsAgainst = totalMatches > 0 ? (goalsAgainst / totalMatches).toFixed(1) : '0.0';
    
    // Find best and worst matchups
    let bestMatchup = null, worstMatchup = null;
    Object.entries(opponents).forEach(([oppId, record]) => {
      const total = record.w + record.d + record.l;
      if (total >= 2) {
        const wr = record.w / total;
        if (!bestMatchup || wr > bestMatchup.wr) {
          bestMatchup = { oppId, ...record, wr };
        }
        if (!worstMatchup || wr < worstMatchup.wr) {
          worstMatchup = { oppId, ...record, wr };
        }
      }
    });
    
    return {
      player,
      totalMatches,
      wins, draws, losses,
      winRate,
      goalsFor, goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      avgGoalsFor, avgGoalsAgainst,
      biggestWin, biggestLoss,
      bestMatchup, worstMatchup,
      elo: eloRatings[playerId] || ELO_START,
      form: getPlayerForm(playerId)
    };
  };

  // OCR
  const processOCR = async (base64, mediaType) => {
    setOcrProcessing(true);
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType })
      });
      const result = await response.json();
      setOcrResult(result.error ? { error: result.error } : result);
    } catch (e) { setOcrResult({ error: 'Failed to process image' }); }
    setOcrProcessing(false);
  };

  const captureTwitch = async () => {
    if (!twitchChannel.trim()) return;
    setOcrProcessing(true);
    localStorage_.set('fct-twitch', twitchChannel.trim());
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
            <h1 style={s.title}>FRIENDLIES TRACKER {isAdmin && <span style={s.adminBadge}>ADMIN</span>}</h1>
            <p style={s.subtitle}>
              {players.length} Players | {matches.length} Matches
              {tournament && <span style={s.tournamentTag}>{tournament.type === 'league' ? 'LEAGUE' : 'GROUPS+KO'}</span>}
            </p>
          </div>
        </div>
        <div style={s.headerBtns}>
          <button onClick={() => setShowAddPlayer(true)} style={s.btnSec}>+ Player</button>
          <button onClick={() => setShowOCR(true)} style={s.btnPri}>Scan</button>
          <button onClick={() => setShowAddMatch(true)} style={s.btnAcc}>+ Match</button>
          <button onClick={() => { if(confirm('Logout?')) { localStorage_.set('fct-auth', false); localStorage_.set('fct-admin', false); window.location.reload(); }}} style={s.btnLogout} title="Logout">X</button>
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
                            <div style={s.playerCell} onClick={() => setShowPlayerStats(st.id)}>
                              <span style={s.playerNameClick}>{st.name}</span>
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
            {players.length === 0 ? <p style={s.empty}>Add players to start</p> : (
              <div style={s.eloList}>
                {eloRanking.map((p, i) => {
                  const elo = eloRatings[p.id] || ELO_START;
                  const diff = elo - ELO_START;
                  const hasOverride = eloOverrides[p.id] !== undefined;
                  return (
                    <div key={p.id} style={{...s.eloCard, ...(i === 0 ? s.eloGold : {})}}>
                      <span style={{...s.pos, ...(i === 0 ? s.posGold : i < 3 ? s.posTop : {})}}>{i + 1}</span>
                      <div style={s.eloInfo} onClick={() => setShowPlayerStats(p.id)}>
                        <span style={s.eloNameClick}>{p.name}</span>
                        {hasOverride && <span style={s.eloOverride}>MANUAL</span>}
                      </div>
                      <div style={s.eloScore}>
                        <span style={s.eloNum}>{elo}</span>
                        <span style={{...s.eloDiff, color: diff > 0 ? '#4ade80' : diff < 0 ? '#f87171' : '#888'}}>{diff > 0 ? '+' : ''}{diff}</span>
                      </div>
                      {isAdmin && (
                        <>
                          <button onClick={() => setShowEloEditor({ playerId: p.id, name: p.name, currentElo: elo })} style={s.btnEdit} title="Edit ELO">E</button>
                          <button onClick={() => deletePlayer(p.id)} style={s.btnDelete} title="Remove player">x</button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
            <div style={s.cardHead}>
              <h2 style={s.cardTitle}>MATCH HISTORY</h2>
              {isAdmin && matches.length > 0 && <button onClick={deleteLastMatch} style={s.btnDanger}>Undo Last</button>}
            </div>
            {matches.length === 0 ? <p style={s.empty}>No matches yet. Log your first match!</p> : (
              <div style={s.matchList}>
                {[...matches].reverse().slice(0, 30).map((m, i) => (
                  <div key={m.id} style={{...s.matchCard, ...(i === 0 ? s.matchCardLatest : {})}}>
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
            )}
          </div>
        )}

        {/* Tournament */}
        {view === 'tournament' && (
          <div style={s.card}>
            <div style={s.cardHead}>
              <h2 style={s.cardTitle}>TOURNAMENT</h2>
              {!tournament ? (
                <button onClick={() => setShowTournamentSetup(true)} style={s.btnPri}>Create</button>
              ) : isAdmin ? (
                <button onClick={() => { if(confirm('End this tournament? This cannot be undone.')) saveToDb('tournament', null, setTournament); }} style={s.btnDanger}>End</button>
              ) : null}
            </div>

            {/* League Phase */}
            {tournament?.phase === 'league' && tournament.leagueFixtures && (
              <div style={s.leagueContainer}>
                <h3 style={s.sectionTitle}>LEAGUE STAGE</h3>
                <div style={s.leagueCard}>
                  <table style={s.groupTable}>
                    <thead><tr><th style={s.gth}>#</th><th style={{...s.gth, textAlign: 'left'}}>Player</th><th style={s.gth}>P</th><th style={s.gth}>W</th><th style={s.gth}>D</th><th style={s.gth}>L</th><th style={s.gth}>GD</th><th style={s.gth}>Pts</th></tr></thead>
                    <tbody>
                      {calculateStandings(true).filter(st => tournament.players.includes(st.id)).map((st, i) => (
                        <tr key={st.id} style={i < 2 ? s.qualifyRow : {}}>
                          <td style={s.gtd}>{i + 1}</td>
                          <td style={{...s.gtd, textAlign: 'left'}}>{st.name} {i < 2 && <span style={s.qualifyBadge}>FINAL</span>}</td>
                          <td style={s.gtd}>{st.played}</td><td style={s.gtd}>{st.won}</td>
                          <td style={s.gtd}>{st.drawn}</td><td style={s.gtd}>{st.lost}</td>
                          <td style={s.gtd}>{st.gd}</td><td style={s.gtdPts}>{st.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={s.fixturesTitle}>Fixtures (Home & Away)</div>
                  <div style={s.fixtures}>
                    {(() => {
                      const fixtures = tournament.leagueFixtures || [];
                      const firstUnplayedIdx = fixtures.findIndex(fix => 
                        !matches.find(m => m.tournamentId === tournament.id && m.player1 === fix.home && m.player2 === fix.away)
                      );
                      return fixtures.map((fix, fi) => {
                        const played = matches.find(m => m.tournamentId === tournament.id && 
                          m.player1 === fix.home && m.player2 === fix.away);
                        const isNext = fi === firstUnplayedIdx;
                        return (
                          <div key={fi} style={{...s.fixture, ...(isNext ? s.fixtureNext : {}), ...(played ? s.fixturePlayed : {})}}>
                            <span style={{...s.fixLeg, ...(isNext ? s.fixLegNext : {})}}>{isNext ? 'NEXT' : `L${fix.leg || 1}`}</span>
                            <span style={s.fixPlayer}><span style={s.hostBadge}>H</span>{getPlayerName(fix.home)}</span>
                            {played ? (
                              <span style={s.fixScore}>{played.score1} - {played.score2}</span>
                            ) : (
                              <span style={s.fixVs}>vs</span>
                            )}
                            <span style={s.fixPlayer}>{getPlayerName(fix.away)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                {/* Advance to Final button */}
                {(() => {
                  const fixtures = tournament.leagueFixtures || [];
                  const playedCount = fixtures.filter(fix => 
                    matches.find(m => m.tournamentId === tournament.id && m.player1 === fix.home && m.player2 === fix.away)
                  ).length;
                  const allPlayed = playedCount === fixtures.length && fixtures.length > 0;
                  
                  return (
                    <div style={s.advanceSection}>
                      <p style={s.advanceInfo}>{playedCount}/{fixtures.length} league fixtures played</p>
                      {isAdmin && (
                        <button 
                          onClick={() => {
                            if (!confirm('Advance top 2 to the final?')) return;
                            const leagueStandings = calculateStandings(true).filter(st => tournament.players.includes(st.id));
                            const finalists = leagueStandings.slice(0, 2).map(st => st.id);
                            
                            const updatedTournament = {
                              ...tournament,
                              phase: 'final',
                              finalists: finalists,
                              finalResult: null
                            };
                            saveToDb('tournament', updatedTournament, setTournament);
                          }}
                          style={{...s.btnPri, ...(allPlayed ? {} : { opacity: 0.5 })}}
                          disabled={!allPlayed}
                        >
                          Advance to Final
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Final Phase (from League) */}
            {tournament?.phase === 'final' && tournament.finalists && (
              <div style={s.finalContainer}>
                <h3 style={s.sectionTitle}>THE FINAL</h3>
                <div style={s.finalMatch}>
                  <div style={{...s.finalPlayer, ...(tournament.finalResult?.winner === tournament.finalists[0] ? s.finalWinner : {})}}>
                    <span style={s.finalName}>{getPlayerName(tournament.finalists[0])}</span>
                    {tournament.teamSelections?.[tournament.finalists[0]] && <span style={s.finalTeam}>{tournament.teamSelections[tournament.finalists[0]]}</span>}
                  </div>
                  <div style={s.finalVsBox}>
                    {tournament.finalResult?.leg1 && tournament.finalResult?.leg2 ? (
                      <div style={s.finalResultBox}>
                        <div style={s.finalLegScores}>
                          <span style={s.finalLegScore}>Leg 1: {tournament.finalResult.leg1.p1Goals}-{tournament.finalResult.leg1.p2Goals}</span>
                          <span style={s.finalLegScore}>Leg 2: {tournament.finalResult.leg2.p1Goals}-{tournament.finalResult.leg2.p2Goals}</span>
                        </div>
                        <div style={s.finalAgg}>AGG: {tournament.finalResult.aggregate}</div>
                      </div>
                    ) : (
                      <div style={s.finalLegButtons}>
                        <button 
                          onClick={() => setShowKnockoutMatch({ 
                            round: 'final', matchIdx: 0, 
                            p1: tournament.finalists[0], p2: tournament.finalists[1], 
                            leg: 1, isFinal: true 
                          })} 
                          style={{...s.legBtn, ...(tournament.finalResult?.leg1 ? s.legBtnDone : {})}}
                          disabled={!!tournament.finalResult?.leg1}
                        >
                          {tournament.finalResult?.leg1 ? `L1: ${tournament.finalResult.leg1.p1Goals}-${tournament.finalResult.leg1.p2Goals}` : 'Leg 1'}
                        </button>
                        <button 
                          onClick={() => setShowKnockoutMatch({ 
                            round: 'final', matchIdx: 0, 
                            p1: tournament.finalists[1], p2: tournament.finalists[0], 
                            leg: 2, originalP1: tournament.finalists[0], originalP2: tournament.finalists[1], 
                            isFinal: true 
                          })} 
                          style={{...s.legBtn, ...(tournament.finalResult?.leg2 ? s.legBtnDone : {}), ...(!tournament.finalResult?.leg1 ? s.legBtnDisabled : {})}}
                          disabled={!tournament.finalResult?.leg1 || !!tournament.finalResult?.leg2}
                        >
                          {tournament.finalResult?.leg2 ? `L2: ${tournament.finalResult.leg2.p1Goals}-${tournament.finalResult.leg2.p2Goals}` : 'Leg 2'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{...s.finalPlayer, ...(tournament.finalResult?.winner === tournament.finalists[1] ? s.finalWinner : {})}}>
                    <span style={s.finalName}>{getPlayerName(tournament.finalists[1])}</span>
                    {tournament.teamSelections?.[tournament.finalists[1]] && <span style={s.finalTeam}>{tournament.teamSelections[tournament.finalists[1]]}</span>}
                  </div>
                </div>
                {tournament.finalResult?.winner && (
                  <div style={s.championBox}>
                    <div style={s.championLabel}>CHAMPION</div>
                    <div style={s.championName}>{getPlayerName(tournament.finalResult.winner)}</div>
                    {tournament.teamSelections?.[tournament.finalResult.winner] && (
                      <div style={s.championTeam}>{tournament.teamSelections[tournament.finalResult.winner]}</div>
                    )}
                  </div>
                )}
              </div>
            )}

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
                        <div style={s.fixturesTitle}>Fixtures (Home & Away)</div>
                        <div style={s.fixtures}>
                          {(() => {
                            const fixtures = tournament.groupFixtures?.[gi] || [];
                            const firstUnplayedIdx = fixtures.findIndex(fix => 
                              !matches.find(m => m.tournamentId === tournament.id && m.player1 === fix.home && m.player2 === fix.away)
                            );
                            return fixtures.map((fix, fi) => {
                              const played = matches.find(m => m.tournamentId === tournament.id && 
                                m.player1 === fix.home && m.player2 === fix.away);
                              const isNext = fi === firstUnplayedIdx;
                              return (
                                <div key={fi} style={{...s.fixture, ...(isNext ? s.fixtureNext : {}), ...(played ? s.fixturePlayed : {})}}>
                                  <span style={{...s.fixLeg, ...(isNext ? s.fixLegNext : {})}}>{isNext ? 'NEXT' : `L${fix.leg || 1}`}</span>
                                  <span style={s.fixPlayer}><span style={s.hostBadge}>H</span>{getPlayerName(fix.home)}</span>
                                  {played ? (
                                    <span style={s.fixScore}>{played.score1} - {played.score2}</span>
                                  ) : (
                                    <span style={s.fixVs}>vs</span>
                                  )}
                                  <span style={s.fixPlayer}>{getPlayerName(fix.away)}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Advance to Knockout button */}
                {(() => {
                  // Check if all group fixtures are played
                  const allFixtures = tournament.groupFixtures?.flat() || [];
                  const playedCount = allFixtures.filter(fix => 
                    matches.find(m => m.tournamentId === tournament.id && m.player1 === fix.home && m.player2 === fix.away)
                  ).length;
                  const allPlayed = playedCount === allFixtures.length && allFixtures.length > 0;
                  
                  return (
                    <div style={s.advanceSection}>
                      <p style={s.advanceInfo}>{playedCount}/{allFixtures.length} group fixtures played</p>
                      {isAdmin && (
                        <button 
                          onClick={() => {
                            if (!confirm('Advance top 2 from each group to knockout stage?')) return;
                            const qualifiers = [];
                            tournament.groups.forEach(group => {
                              const groupStandings = calculateStandings(true).filter(st => group.includes(st.id));
                              qualifiers.push(...groupStandings.slice(0, 2).map(st => st.id));
                            });
                            
                            // Create knockout bracket
                            const bracketSize = Math.pow(2, Math.ceil(Math.log2(qualifiers.length)));
                            const bracket = new Array(bracketSize).fill(null);
                            qualifiers.forEach((pid, idx) => { bracket[idx] = pid; });
                            
                            const updatedTournament = {
                              ...tournament,
                              phase: 'knockout',
                              knockoutBracket: { 0: bracket },
                              knockoutResults: {}
                            };
                            saveToDb('tournament', updatedTournament, setTournament);
                          }}
                          style={{...s.btnPri, ...(allPlayed ? {} : { opacity: 0.5 })}}
                          disabled={!allPlayed}
                        >
                          Advance to Knockout
                        </button>
                      )}
                    </div>
                  );
                })()}
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
                          const leg1Done = !!result?.leg1;
                          const leg2Done = !!result?.leg2;
                          const bothDone = leg1Done && leg2Done;
                          return (
                            <div key={mi} style={s.bracketMatch}>
                              <div style={{...s.bracketPlayer, ...(result?.winner === m.p1 ? s.bracketWinner : {}), ...(!m.p1 ? s.bracketTBD : {})}}>
                                <span>{m.p1 ? getPlayerName(m.p1) : 'TBD'}</span>
                                {tournament.teamSelections?.[m.p1] && <span style={s.bracketTeam}>{tournament.teamSelections[m.p1]}</span>}
                              </div>
                              {bothDone ? (
                                <div style={s.bracketResultTwoLeg}>
                                  <div style={s.legScores}>
                                    <span style={s.legScore}>L1: {result.leg1.p1Goals}-{result.leg1.p2Goals}</span>
                                    <span style={s.legScore}>L2: {result.leg2.p1Goals}-{result.leg2.p2Goals}</span>
                                  </div>
                                  <div style={s.aggScore}>AGG: {result.aggregate}</div>
                                </div>
                              ) : m.p1 && m.p2 ? (
                                <div style={s.legButtons}>
                                  <button 
                                    onClick={() => setShowKnockoutMatch({ round, matchIdx: m.matchIdx, p1: m.p1, p2: m.p2, leg: 1 })} 
                                    style={{...s.legBtn, ...(leg1Done ? s.legBtnDone : {})}}
                                    disabled={leg1Done}
                                  >
                                    {leg1Done ? `L1: ${result.leg1.p1Goals}-${result.leg1.p2Goals}` : 'Leg 1'}
                                  </button>
                                  <button 
                                    onClick={() => setShowKnockoutMatch({ round, matchIdx: m.matchIdx, p1: m.p2, p2: m.p1, leg: 2, originalP1: m.p1, originalP2: m.p2 })} 
                                    style={{...s.legBtn, ...(leg2Done ? s.legBtnDone : {}), ...(!leg1Done ? s.legBtnDisabled : {})}}
                                    disabled={!leg1Done || leg2Done}
                                  >
                                    {leg2Done ? `L2: ${result.leg2.p1Goals}-${result.leg2.p2Goals}` : 'Leg 2'}
                                  </button>
                                </div>
                              ) : (
                                <div style={s.bracketVs}>vs</div>
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
                {/* Champion display */}
                {(() => {
                  const finalRound = Object.entries(tournament.knockoutBracket).find(([_, players]) => players.length === 2);
                  if (!finalRound) return null;
                  const [roundStr] = finalRound;
                  const finalResult = tournament.knockoutResults?.[roundStr]?.[0];
                  if (!finalResult?.winner) return null;
                  return (
                    <div style={s.championBox}>
                      <div style={s.championLabel}>CHAMPION</div>
                      <div style={s.championName}>{getPlayerName(finalResult.winner)}</div>
                      {tournament.teamSelections?.[finalResult.winner] && (
                        <div style={s.championTeam}>{tournament.teamSelections[finalResult.winner]}</div>
                      )}
                    </div>
                  );
                })()}
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

      {showKnockoutMatch && <Modal onClose={() => setShowKnockoutMatch(null)} title={`${showKnockoutMatch.isFinal ? 'FINAL' : 'KNOCKOUT'} - LEG ${showKnockoutMatch.leg}`}>
        <p style={s.legInfo}>{showKnockoutMatch.leg === 1 ? `${getPlayerName(showKnockoutMatch.p1)} hosts` : `${getPlayerName(showKnockoutMatch.p1)} hosts (return leg)`}</p>
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
          <button onClick={() => {
            const leg = showKnockoutMatch.leg;
            const origP1 = showKnockoutMatch.originalP1 || showKnockoutMatch.p1;
            const origP2 = showKnockoutMatch.originalP2 || showKnockoutMatch.p2;
            // For leg 2, scores are entered as host (orig p2) vs visitor (orig p1), so swap for storage
            const s1 = leg === 2 ? matchData.score2 : matchData.score1;
            const s2 = leg === 2 ? matchData.score1 : matchData.score2;
            addMatch(origP1, origP2, s1, s2, showKnockoutMatch.round, showKnockoutMatch.matchIdx, leg);
          }} style={s.btnAcc}>Submit Result</button>
        </div>
      </Modal>}

      {showTournamentSetup && !showTeamSelect && !showDraw && <Modal onClose={() => setShowTournamentSetup(false)} title="CREATE TOURNAMENT">
        {players.length < 2 ? (
          <p style={s.empty}>Need at least 2 players to create a tournament</p>
        ) : (
          <>
            <div style={s.typeOptions}>
              <button onClick={() => setTournamentType('league')} style={{...s.typeBtn, ...(tournamentType === 'league' ? s.typeSel : {})}}>
                <span style={s.typeTitle}>League + Final</span><span style={s.typeDesc}>Everyone vs everyone, top 2 to final</span>
              </button>
              <button onClick={() => setTournamentType('groups')} style={{...s.typeBtn, ...(tournamentType === 'groups' ? s.typeSel : {})}}>
                <span style={s.typeTitle}>Groups + KO</span><span style={s.typeDesc}>Group stage, then knockout bracket</span>
              </button>
            </div>
            {tournamentType === 'groups' && (
              <div style={s.groupCountRow}>
                <span>Number of groups:</span>
                <select value={groupCount} onChange={e => setGroupCount(parseInt(e.target.value))} style={s.selectSmall}>
                  {[2, 3, 4].filter(n => players.length >= n * 2).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div style={s.modalBtns}><button onClick={() => setShowTournamentSetup(false)} style={s.btnSec}>Cancel</button><button onClick={() => setShowTeamSelect(true)} style={s.btnPri}>Select Teams</button></div>
          </>
        )}
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

      {showEloEditor && <Modal onClose={() => setShowEloEditor(null)} title="EDIT ELO">
        <p style={s.modalDesc}>Set manual ELO for {showEloEditor.name}</p>
        <p style={s.eloEditorCurrent}>Current: {showEloEditor.currentElo}</p>
        <input 
          type="number" 
          placeholder="New ELO rating" 
          defaultValue={showEloEditor.currentElo}
          id="eloInput"
          style={s.input} 
          autoFocus 
        />
        <div style={s.modalBtns}>
          {eloOverrides[showEloEditor.playerId] !== undefined && (
            <button onClick={() => {
              const newOverrides = {...eloOverrides};
              delete newOverrides[showEloEditor.playerId];
              saveToDb('eloOverrides', newOverrides, setEloOverrides);
              setShowEloEditor(null);
            }} style={s.btnDanger}>Reset to Calculated</button>
          )}
          <button onClick={() => setShowEloEditor(null)} style={s.btnSec}>Cancel</button>
          <button onClick={() => {
            const val = parseInt(document.getElementById('eloInput').value);
            if (!isNaN(val) && val > 0) {
              saveToDb('eloOverrides', {...eloOverrides, [showEloEditor.playerId]: val}, setEloOverrides);
              setShowEloEditor(null);
            }
          }} style={s.btnPri}>Save</button>
        </div>
      </Modal>}

      {showPlayerStats && (() => {
        const stats = getPlayerStats(showPlayerStats);
        if (!stats) return null;
        return (
          <Modal onClose={() => setShowPlayerStats(null)} title="PLAYER STATS" wide>
            <div style={s.statsHeader}>
              <div style={s.statsName}>{stats.player.name}</div>
              {stats.player.psn && <div style={s.statsPsn}>{stats.player.psn}</div>}
              <div style={s.statsElo}>ELO: <span style={s.statsEloNum}>{stats.elo}</span></div>
            </div>
            
            <div style={s.statsGrid}>
              <div style={s.statBox}>
                <div style={s.statValue}>{stats.totalMatches}</div>
                <div style={s.statLabel}>Matches</div>
              </div>
              <div style={s.statBox}>
                <div style={{...s.statValue, color: '#4ade80'}}>{stats.winRate}%</div>
                <div style={s.statLabel}>Win Rate</div>
              </div>
              <div style={s.statBox}>
                <div style={s.statValue}>{stats.goalsFor}</div>
                <div style={s.statLabel}>Goals For</div>
              </div>
              <div style={s.statBox}>
                <div style={s.statValue}>{stats.goalsAgainst}</div>
                <div style={s.statLabel}>Goals Against</div>
              </div>
            </div>
            
            <div style={s.statsRecord}>
              <span style={{color: '#4ade80'}}>{stats.wins}W</span>
              <span style={{color: '#888'}}>{stats.draws}D</span>
              <span style={{color: '#f87171'}}>{stats.losses}L</span>
            </div>
            
            <div style={s.statsAvg}>
              <div>Avg Goals Scored: <strong>{stats.avgGoalsFor}</strong></div>
              <div>Avg Goals Conceded: <strong>{stats.avgGoalsAgainst}</strong></div>
              <div>Goal Difference: <strong style={{color: stats.goalDiff > 0 ? '#4ade80' : stats.goalDiff < 0 ? '#f87171' : '#888'}}>{stats.goalDiff > 0 ? '+' : ''}{stats.goalDiff}</strong></div>
            </div>
            
            {(stats.biggestWin || stats.biggestLoss) && (
              <div style={s.statsExtreme}>
                {stats.biggestWin && (
                  <div style={s.statsExtremeItem}>
                    <span style={s.statsExtremeLabel}>Biggest Win</span>
                    <span style={{color: '#4ade80'}}>{stats.biggestWin.score}</span>
                    <span style={s.statsExtremeOpp}>vs {getPlayerName(stats.biggestWin.opponent)}</span>
                  </div>
                )}
                {stats.biggestLoss && (
                  <div style={s.statsExtremeItem}>
                    <span style={s.statsExtremeLabel}>Worst Loss</span>
                    <span style={{color: '#f87171'}}>{stats.biggestLoss.score}</span>
                    <span style={s.statsExtremeOpp}>vs {getPlayerName(stats.biggestLoss.opponent)}</span>
                  </div>
                )}
              </div>
            )}
            
            {(stats.bestMatchup || stats.worstMatchup) && (
              <div style={s.statsMatchups}>
                {stats.bestMatchup && stats.bestMatchup.oppId !== stats.worstMatchup?.oppId && (
                  <div style={s.statsMatchupItem}>
                    <span style={s.statsMatchupLabel}>Best vs</span>
                    <span style={s.statsMatchupName}>{getPlayerName(stats.bestMatchup.oppId)}</span>
                    <span style={{color: '#4ade80'}}>{stats.bestMatchup.w}-{stats.bestMatchup.d}-{stats.bestMatchup.l}</span>
                  </div>
                )}
                {stats.worstMatchup && stats.worstMatchup.oppId !== stats.bestMatchup?.oppId && (
                  <div style={s.statsMatchupItem}>
                    <span style={s.statsMatchupLabel}>Worst vs</span>
                    <span style={s.statsMatchupName}>{getPlayerName(stats.worstMatchup.oppId)}</span>
                    <span style={{color: '#f87171'}}>{stats.worstMatchup.w}-{stats.worstMatchup.d}-{stats.worstMatchup.l}</span>
                  </div>
                )}
              </div>
            )}
            
            {stats.form.length > 0 && (
              <div style={s.statsForm}>
                <span style={s.statsFormLabel}>Recent Form:</span>
                <div style={s.formRow}>
                  {stats.form.map((f, i) => (
                    <span key={i} style={{...s.formDot, background: f === 'W' ? '#4ade80' : f === 'L' ? '#f87171' : '#888'}}>{f}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div style={s.modalBtns}>
              <button onClick={() => setShowPlayerStats(null)} style={s.btnPri}>Close</button>
            </div>
          </Modal>
        );
      })()}

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
  container: { minHeight: '100vh', background: 'linear-gradient(145deg, #080810, #0f0f1a, #0a0a12)', color: '#e5e5e5', fontFamily: "'Archivo', sans-serif", WebkitTapHighlightColor: 'transparent' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', flexWrap: 'wrap', gap: '1rem' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', color: '#000' },
  title: { fontSize: '1.2rem', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '0.65rem', color: '#666', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' },
  headerBtns: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  btnPri: { padding: '0.6rem 1.1rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', touchAction: 'manipulation', minHeight: '44px' },
  btnAcc: { padding: '0.6rem 1.1rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', touchAction: 'manipulation', minHeight: '44px' },
  btnSec: { padding: '0.6rem 1.1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#bbb', fontWeight: '500', fontSize: '0.8rem', cursor: 'pointer', touchAction: 'manipulation', minHeight: '44px' },
  btnDanger: { padding: '0.5rem 0.9rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#fca5a5', fontSize: '0.75rem', cursor: 'pointer', touchAction: 'manipulation', minHeight: '40px' },
  btnLogout: { padding: '0.5rem 0.7rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#666', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '0.25rem', touchAction: 'manipulation', minHeight: '40px' },
  btnDelete: { padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', color: '#555', fontSize: '0.9rem', cursor: 'pointer', opacity: 0.5, marginLeft: '0.5rem', touchAction: 'manipulation', minHeight: '36px' },
  btnEdit: { padding: '0.3rem 0.6rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', color: '#a5b4fc', fontSize: '0.7rem', cursor: 'pointer', marginLeft: '0.5rem', touchAction: 'manipulation', minHeight: '36px', fontWeight: '700' },
  eloOverride: { fontSize: '0.5rem', color: '#fbbf24', background: 'rgba(251,191,36,0.15)', padding: '0.1rem 0.3rem', borderRadius: '3px', marginLeft: '0.4rem', fontWeight: '700' },
  eloEditorCurrent: { textAlign: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' },
  adminBadge: { fontSize: '0.5rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: '800', verticalAlign: 'middle' },
  tournamentTag: { fontSize: '0.6rem', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: '700' },
  matchCardLatest: { border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.03)' },
  drawWarning: { textAlign: 'center', color: '#fbbf24', fontSize: '0.7rem', marginBottom: '0.5rem', padding: '0.4rem', background: 'rgba(251,191,36,0.08)', borderRadius: '4px' },
  nav: { display: 'flex', gap: '0.2rem', padding: '0.6rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', overflowX: 'auto' },
  navBtn: { padding: '0.6rem 1rem', background: 'transparent', border: 'none', color: '#666', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', whiteSpace: 'nowrap', touchAction: 'manipulation', minHeight: '40px' },
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
  playerNameClick: { fontWeight: '600', color: '#fff', cursor: 'pointer', borderBottom: '1px dashed rgba(255,255,255,0.3)' },
  teamTag: { fontSize: '0.55rem', color: '#fbbf24' },
  formRow: { display: 'flex', gap: '2px', justifyContent: 'center' },
  formDot: { width: '14px', height: '14px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: '700', color: '#000' },
  eloList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  eloCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' },
  eloGold: { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' },
  eloInfo: { flex: 1 },
  eloName: { fontWeight: '600', color: '#fff', fontSize: '0.85rem' },
  eloNameClick: { fontWeight: '600', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px dashed rgba(255,255,255,0.3)' },
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
  leagueContainer: { marginTop: '0.5rem' },
  leagueCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' },
  qualifyBadge: { fontSize: '0.45rem', background: 'rgba(74,222,128,0.2)', color: '#4ade80', padding: '0.15rem 0.35rem', borderRadius: '3px', marginLeft: '0.5rem', fontWeight: '700' },
  finalContainer: { marginTop: '0.5rem' },
  finalMatch: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', flexWrap: 'wrap' },
  finalPlayer: { flex: '1', minWidth: '120px', maxWidth: '200px', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' },
  finalWinner: { background: 'linear-gradient(145deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))', border: '1px solid rgba(74,222,128,0.3)' },
  finalName: { fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'block', marginBottom: '0.25rem' },
  finalTeam: { fontSize: '0.7rem', color: '#888' },
  finalVsBox: { padding: '1rem', minWidth: '140px' },
  finalResultBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  finalLegScores: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  finalLegScore: { fontSize: '0.7rem', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px' },
  finalAgg: { fontSize: '1rem', fontWeight: '700', color: '#4ade80' },
  finalLegButtons: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
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
  fixture: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '0.65rem' },
  fixtureNext: { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' },
  fixturePlayed: { opacity: 0.6 },
  fixPlayer: { color: '#ccc', flex: 1 },
  hostBadge: { fontSize: '0.45rem', background: 'rgba(251,191,36,0.2)', color: '#fbbf24', padding: '0.1rem 0.25rem', borderRadius: '3px', marginRight: '0.35rem', fontWeight: '700' },
  fixLeg: { color: '#6366f1', fontSize: '0.5rem', fontWeight: '700', minWidth: '28px' },
  fixLegNext: { color: '#fbbf24', fontSize: '0.45rem' },
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
  bracketResultTwoLeg: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.3rem 0' },
  legScores: { display: 'flex', gap: '0.5rem', fontSize: '0.6rem', color: '#888' },
  legScore: { background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '3px' },
  aggScore: { fontSize: '0.75rem', fontWeight: '700', color: '#4ade80' },
  legButtons: { display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.3rem 0' },
  legBtn: { padding: '0.5rem 0.8rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', color: '#a5b4fc', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600', touchAction: 'manipulation', minHeight: '40px' },
  legBtnDone: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', cursor: 'default' },
  legBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
  legInfo: { textAlign: 'center', fontSize: '0.7rem', color: '#fbbf24', marginBottom: '0.5rem', fontWeight: '600' },
  championBox: { marginTop: '1.5rem', padding: '1.5rem', background: 'linear-gradient(145deg, rgba(251,191,36,0.1), rgba(251,191,36,0.02))', border: '2px solid rgba(251,191,36,0.3)', borderRadius: '12px', textAlign: 'center' },
  championLabel: { fontSize: '0.7rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.2em', marginBottom: '0.5rem' },
  championName: { fontSize: '1.5rem', fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  championTeam: { fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' },
  advanceSection: { marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', textAlign: 'center' },
  advanceInfo: { fontSize: '0.7rem', color: '#888', marginBottom: '0.75rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: 'linear-gradient(145deg, #18182a, #12121a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.5rem', maxWidth: '400px', width: '100%', maxHeight: '90vh', overflowY: 'auto' },
  modalWide: { maxWidth: '550px' },
  modalTitle: { fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1rem', textAlign: 'center' },
  modalDesc: { color: '#777', fontSize: '0.75rem', marginBottom: '0.75rem', textAlign: 'center' },
  modalBtns: { display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' },
  input: { width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '16px', marginBottom: '0.6rem', boxSizing: 'border-box', minHeight: '48px' },
  select: { width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '16px', marginBottom: '0.6rem', boxSizing: 'border-box', minHeight: '48px' },
  selectSmall: { padding: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' },
  scoreRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', margin: '0.6rem 0' },
  scoreInput: { width: '60px', padding: '0.8rem', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(251,191,36,0.25)', borderRadius: '8px', color: '#fff', fontSize: '1.3rem', fontWeight: '800', textAlign: 'center', minHeight: '50px' },
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
  // Password gate styles
  pwContainer: { minHeight: '100vh', background: 'linear-gradient(145deg, #080810, #0f0f1a, #0a0a12)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  pwBox: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2.5rem', maxWidth: '360px', width: '100%', textAlign: 'center' },
  pwLogo: { width: '64px', height: '64px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', color: '#000', margin: '0 auto 1.5rem' },
  pwTitle: { fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  pwSubtitle: { fontSize: '0.75rem', color: '#666', marginBottom: '1.5rem' },
  pwInput: { width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '1rem', textAlign: 'center', letterSpacing: '0.15em', marginBottom: '1rem', boxSizing: 'border-box' },
  pwInputError: { borderColor: 'rgba(239,68,68,0.5)' },
  pwBtn: { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '0.75rem' },
  pwError: { color: '#f87171', fontSize: '0.75rem', marginTop: '0.5rem' },
  // Player stats modal styles
  statsHeader: { textAlign: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  statsName: { fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.25rem' },
  statsPsn: { fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem' },
  statsElo: { fontSize: '0.8rem', color: '#a5b4fc' },
  statsEloNum: { fontWeight: '700', fontSize: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' },
  statBox: { background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.75rem 0.5rem', textAlign: 'center' },
  statValue: { fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '0.2rem' },
  statLabel: { fontSize: '0.55rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statsRecord: { display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' },
  statsAvg: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: '#aaa', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' },
  statsExtreme: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  statsExtremeItem: { flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' },
  statsExtremeLabel: { display: 'block', fontSize: '0.55rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem' },
  statsExtremeOpp: { display: 'block', fontSize: '0.65rem', color: '#888', marginTop: '0.2rem' },
  statsMatchups: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  statsMatchupItem: { flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem' },
  statsMatchupLabel: { display: 'block', fontSize: '0.5rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.2rem' },
  statsMatchupName: { display: 'block', color: '#fff', fontWeight: '600', marginBottom: '0.15rem' },
  statsForm: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' },
  statsFormLabel: { fontSize: '0.7rem', color: '#888' },
};

// ============ PASSWORD GATE ============
const PASSWORD = 'piturca';
const ADMIN_PASSWORD = 'paquinake';

function PasswordGate({ onSuccess }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.toLowerCase();
    if (val === PASSWORD || val === ADMIN_PASSWORD) {
      localStorage_.set('fct-auth', true);
      if (val === ADMIN_PASSWORD) {
        localStorage_.set('fct-admin', true);
      }
      onSuccess(val === ADMIN_PASSWORD);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput('');
    }
  };

  return (
    <div style={s.pwContainer}>
      <form onSubmit={handleSubmit} style={{...s.pwBox, animation: shake ? 'shake 0.5s ease-in-out' : 'none'}}>
        <div style={s.pwLogo}>FC</div>
        <h1 style={s.pwTitle}>FRIENDLIES TRACKER</h1>
        <p style={s.pwSubtitle}>Acceso restringido</p>
        <input
          type="password"
          placeholder="Contrasena"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          style={{...s.pwInput, ...(error ? s.pwInputError : {})}}
          autoFocus
        />
        <button type="submit" style={s.pwBtn}>Entrar</button>
        {error && <p style={s.pwError}>Contrasena incorrecta</p>}
      </form>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

// ============ APP WRAPPER WITH AUTH ============
function AppWrapper() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = localStorage_.get('fct-auth');
    const admin = localStorage_.get('fct-admin');
    if (auth === true) {
      setAuthenticated(true);
      setIsAdmin(admin === true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return <div style={s.pwContainer}><div style={s.pwLogo}>FC</div></div>;
  }

  if (!authenticated) {
    return <PasswordGate onSuccess={(admin) => { setAuthenticated(true); setIsAdmin(admin); }} />;
  }

  return <FCTracker isAdmin={isAdmin} />;
}

export default AppWrapper;
