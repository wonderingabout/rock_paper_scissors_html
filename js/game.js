"use strict";

function getPromptedPlayerName(names) {
    const playerName = prompt("Enter your name:", names.player);
    return playerName.slice(0, 15);
}

function playGame() {
    const moves =  [ { id: 1, name: "Rock"    , emojiHtml: "&#x1F44A;", rule: 3 },
                     { id: 2, name: "Paper"   , emojiHtml: "&#x1F4DC" , rule: 1 },
                     { id: 3, name: "Scissors", emojiHtml: "&#x2702;" , rule: 2 }
                   ];
    const timers = { total: 3,
                     round: 0
                   };
    const scores = { player:   0,
                     computer: 0
                   };
    const names  = { player:   "Player",
                     computer: "HTML"
                   };

    names.player = getPromptedPlayerName(names);

    document.body.innerHTML += `<div class="container" id="democontainer"><div class="row" id="demorow"</div></div>`;

    start(moves, timers, scores, names);
}

function start(moves, timers, scores, names) {
    const player   = getValidPlayer(moves);
    const computer = getValidRandomComputer(moves);

    timers.i = 0;
    processEndGame(player, computer, moves, timers, scores, names);
}

function getPromptedPlayerNum(moves) {
    const movesDescr = moves.map( (e) => `${e.name}: ${e.id}\n`)
                            .join("");
    const greeting   = `${movesDescr}\nLet's Play!`;

    const result = prompt(greeting);
    return parseInt(result);
}

function checkPlayerIsValid(result, moves) {
    const ids = moves.map( (e) => e.id );
    return (ids.includes(result));
}

function testValidPlayer(moves) {
    const result = getPromptedPlayerNum(moves);
    if (!checkPlayerIsValid(result, moves)) {
        const validMoves = moves.map( (e) => e.id)
                                .join(', ');
        alert(`｡゜(｀Д´)゜｡\n\nPlease enter one of these valid moves:\n${validMoves}.\n\n(╬ Ò ‸ Ó)`);
        return;
    }
    return result;
}

function getValidPlayer(moves) {
    const player = testValidPlayer(moves);
    if (player) return player;
    return getValidPlayer(moves);
}

function getValidRandomComputer(moves) {
    const biggestId = moves[moves.length - 1].id;
    return Math.floor((Math.random() * biggestId) + 1);
}

function displayOneCountdownInHtml(timers) {
    const currColFlexId = `demoflex${timers.round}`;
    document.getElementById(currColFlexId).innerHTML += `${timers.i + 1}.....<br/>`;
}

function processOneCountdownInHtml(timers) {
    displayOneCountdownInHtml(timers);
    timers.i++;
}

function checkFullCountdownIsFinished(timers) {
    return ((timers.i + 1) > timers.total);
}

function getRoundWinnerObj(player, computer, moves) {
    if (player === computer)                 return { winnerHtml: "Tie &#x1F937;", colorHtml: "skyblue" };
    if (moves[player - 1].rule === computer) return { winnerHtml: "You Win! &#x1F4AA;", colorHtml: "lightgreen" };
    return { winnerHtml: "You lose! &#x1F61C;", colorHtml: "tomato" };
}

function displayRoundWinnerInHtml(player, computer, moves, timers) {
    const playerMove   = moves[player - 1];
    const computerMove = moves[computer - 1];

    const currColFlexId = `demoflex${timers.round}`;
    document.getElementById(currColFlexId).innerHTML = ""; // flush countdown
    document.getElementById(currColFlexId).innerHTML += `${playerMove.name} VS ${computerMove.name}<br/>`;
    document.getElementById(currColFlexId).innerHTML += `${playerMove.emojiHtml} VS ${computerMove.emojiHtml}<br/>`;

    const roundWinnerObj = getRoundWinnerObj(player, computer, moves);
    const msg = `<div style="background-color: ${roundWinnerObj.colorHtml};">${roundWinnerObj.winnerHtml}</div><br/>`;
    document.getElementById(currColFlexId).innerHTML += msg;
}

function updateScores(player, computer, moves, scores) {
    if (player === computer) return;
    if (moves[player - 1].rule === computer) {
        scores.player++;
        return;
    } else {
        scores.computer++;
        return;
    }
}

function checkIsNextRound() {
    return confirm("Again ?");
}

function processNextRound(moves, timers, scores, names) {
    setTimeout(function() {
        if (checkIsNextRound()) {
            timers.round++;
            start(moves, timers, scores, names);
        } else {
            displayFinalScoresInHtml(scores, names, timers);
        }
    }, 2000);
}

function getFinalScoresCommentaryHtml(scores) {
    if (scores.player === scores.computer) return `&#x1F970;&#x1F91D;&#x1F917;&#x1F380;&#x1F917;&#x1F91D;&#x1F970;<br/>`;
    if (scores.player > scores.computer)   return `&#x1F3C6;&#x1F3C5;&#x1F60E;&#x1F624;&#x1F60E;&#x1F3C5;&#x1F3C6;<br/>`;
    return `&#x2614;&#x1F62D;&#x1F37C;&#x1F927;&#x1F37C;&#x1F62D;&#x2614;<br/>`;
}

function displayFinalScoresInHtml(scores, names) {
    document.body.innerHTML += `<div id="result"></div>`;

    document.getElementById("result").innerHTML += `<br/>Game Result:<br/>`;
    document.getElementById("result").innerHTML += `${names.player}: ${scores.player}<br/>`;
    document.getElementById("result").innerHTML += `${names.computer}: ${scores.computer}<br/>`;
    document.getElementById("result").innerHTML += getFinalScoresCommentaryHtml(scores);
}

function processEndGame(player, computer, moves, timers, scores, names) {

    const currColFlexId = `demoflex${timers.round}`;
    document.getElementById("demorow").innerHTML += `<div class="col-sm-2" id="${currColFlexId}"></div>`;

    const fullCountdownTimer = setInterval(processOneCountdownInHtml, 1000, timers);

    const stopFullCountdownTimer = setInterval(function() {
        if (checkFullCountdownIsFinished(timers)) {
            clearInterval(fullCountdownTimer);
            clearInterval(stopFullCountdownTimer);

            displayRoundWinnerInHtml(player, computer, moves, timers);

            updateScores(player, computer, moves, scores);

            processNextRound(moves, timers, scores, names);
        }
    }, 100);
}