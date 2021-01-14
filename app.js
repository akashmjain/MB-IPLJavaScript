const fs = require('fs');
const path = require('path');

const Match = require('./Match');
const Delivery = require('./Delivery');

const MATCH_ID = 0;
const MATCH_SEASON = 1;
const MATCH_CITY = 2;
const MATCH_DATE = 3;
const MATCH_TEAM1 = 4;
const MATCH_TEAM2 = 5;
const MATCH_TOSS_WINNER = 6;
const MATCH_TOSS_DECISION= 7;
const MATCH_RESULT = 8;
const MATCH_DL_APPLIED = 9;
const MATCH_WINNER = 10;
const MATCH_WIN_BY_RUNS = 11;
const MATCH_WIN_BY_WICKETS = 12;
const MATCH_PLAYER_OF_MATCH = 13;
const MATCH_VENUE = 14;
const MATCH_UMPIRE1 = 15;
const MATCH_UMPIRE2 = 16;
const MATCH_UMPIRE3 = 17;

const DELIVERY_MATCH_ID = 0;
const DELIVERY_INNING = 1;
const DELIVERY_BATTING_TEAM = 2;
const DELIVERY_BOWLING_TEAM = 3;
const DELIVERY_OVER = 4;
const DELIVERY_BALL = 5;
const DELIVERY_BATSMAN = 6;
const DELIVERY_NON_STRIKER = 7;
const DELIVERY_BOWLER = 8;
const DELIVERY_IS_SUPER_OVER = 9;
const DELIVERY_WIDE_RUNS = 10;
const DELIVERY_BYE_RUNS = 11;
const DELIVERY_LEGBYE_RUNS = 12;
const DELIVERY_NOBALL_RUNS = 13;
const DELIVERY_PENALTY_RUNS = 14;
const DELIVERY_BATSMAN_RUNS= 15;
const DELIVERY_EXTRA_RUNS = 16;
const DELIVERY_TOTAL_RUNS = 17;
const DELIVERY_PLAYER_DISMISSED = 18;
const DELIVERY_DISMISSAL_KIND = 19;
const DELIVERY_FIELDER = 20;

const solutions = {};
solutions.findNumberOfMatchesWonPerTeamsOverAllYears = (matches) => {
    let noOfMatchesWonPerTeam = new Map();
    for(let i = 0; i < matches.length; i++) {
        const key = matches[i].getWinner();
        if(key == 'winner' || key == '' || key == undefined) continue;
        const value = noOfMatchesWonPerTeam.get(key) === undefined ? 0 : noOfMatchesWonPerTeam.get(key);
        
        noOfMatchesWonPerTeam.set(key, value + 1);
    }
    console.log(noOfMatchesWonPerTeam);
};

solutions.findNumberOfMatchesPlayedPerYearForAllYears = (matches) => {
    let noOfMatchesPerYear = new Map();
    for(let i = 0; i < matches.length; i++) {
        const key = matches[i].getSeason();
        const value = noOfMatchesPerYear.get(key) === undefined ? 0 : noOfMatchesPerYear.get(key);
        noOfMatchesPerYear.set(key, value + 1);
    }
    noOfMatchesPerYear.forEach((value, key) => {
        if(key === undefined); 
        else if(key === 'season');
        else console.log(key+" : "+value)
    })
    
};

solutions.findYearWiseExtraRunConcededPerTeam = (deliveries, matches, year) => {
    let teamToRunHashMap = new Map();
    for(let i = 0; i < matches.length; i++) {
        if(matches[i].getSeason() != year) continue;
        for(let j = 0; j < deliveries.length; j++) {
            if(matches[i].getId() !=  deliveries[j].getMatchId()) continue;
            let run = parseInt(deliveries[j].getExtraRuns());
            let key = deliveries[j].getBattingTeam();
            let value = teamToRunHashMap.get(key) === undefined ? run : teamToRunHashMap.get(key) + run;
            teamToRunHashMap.set(key, value);
        }    
    }
    console.log(teamToRunHashMap)
};

solutions.findYearWiseTopEconomicalBowlers = (deliveries, matches, year, top) => {
    let bowlerHashMap = new Map();
    for(let i = 0; i < matches.length; i++) {
        if(matches[i].getSeason() != year ) continue;
        for(let j = 0; j < deliveries.length; j++) {
            if(matches[i].getId() != deliveries[j].getMatchId()) continue;
            let key = deliveries[j].getBowler();
            let run = parseInt(deliveries[j].getTotalRuns());
            bowlerHashMap.set(key, 
                bowlerHashMap.get(key) === undefined ? 
                { run: run, balls: 1 } : 
                { run: bowlerHashMap.get(key).run + run, balls: bowlerHashMap.get(key).balls + 1 }
            );
        }
    }
    let topBowlers = new Map();
    bowlerHashMap.forEach((value, key) => {
        topBowlers.set(key, value.run / (value.balls / 6));
    });
    topBowlers[Symbol.iterator] = function* (){
        yield* [...this.entries()].sort((a,b) => a[1] - b[1]);
    }
    topBowlers = [...topBowlers];
    for(let i = 0; i < top; i++) {
        console.log(topBowlers[i]);
    }
};

solutions.findTopMostCatchesInHistoryPlayers = (deliveries, top) => {

};

const getData = {}
getData.matches = (callback) => {  
    const matches = new Array(); 
    const filePath = path.join(__dirname, '/data/matches.csv');
    let csvBlob = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const lines = csvBlob.split('\n');
    for(let i = 0; i < lines.length; i++) {
        const list = lines[i].split(',');
        const match = new Match();
        match.setId(list[MATCH_ID]);
        match.setWinner(list[MATCH_WINNER]);
        match.setSeason(list[MATCH_SEASON]);
        matches.push(match);
    }
    return matches;
}
getData.deliveries = () => {
    const deliveries = new Array(); 
    const filePath = path.join(__dirname, '/data/deliveries.csv');
    let csvBlob = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const lines = csvBlob.split('\n');
    for(let i = 0; i < lines.length; i++) {
        const list = lines[i].split(',');
        const delivery = new Delivery();
        delivery.setMatchId(list[DELIVERY_MATCH_ID]);
        delivery.setBattingTeam(list[DELIVERY_BATTING_TEAM]);
        delivery.setExtraRuns(list[DELIVERY_EXTRA_RUNS]);
        delivery.setBowler(list[DELIVERY_BOWLER]);
        delivery.setOver(list[DELIVERY_OVER]);
        delivery.setTotalRuns(list[DELIVERY_TOTAL_RUNS]);
        delivery.setIsSuperOver(list[DELIVERY_IS_SUPER_OVER]);
        delivery.setDismissalKind(list[DELIVERY_DISMISSAL_KIND]);
        delivery.setFielder(list[DELIVERY_FIELDER]);
        deliveries.push(delivery);
    }
    return deliveries;
}
const deliveries = getData.deliveries();
const matches = getData.matches();

// solutions.findNumberOfMatchesWonPerTeamsOverAllYears(matches);
// solutions.findNumberOfMatchesPlayedPerYearForAllYears(matches);
// solutions.findYearWiseExtraRunConcededPerTeam(deliveries, matches, '2016');
// solutions.findYearWiseTopEconomicalBowlers(deliveries, matches, '2015', 5);
solutions.findTopMostCatchesInHistoryPlayers(deliveries, 5);
