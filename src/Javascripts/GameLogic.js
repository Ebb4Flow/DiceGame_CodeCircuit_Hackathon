let ThisRound = 1;
let ThisRoll = 0;
const MaxRounds = 13;
const MaxRolls = 3;
const rollButton = document.getElementById("Btn-Roll");
const rollCountElem = document.querySelector(".Roll_Count");
const usedCategories = new Set();

// Don't allow more than 3 rolls Per Round
rollButton.addEventListener("click", () => {
  if (ThisRoll >= MaxRolls) {
    alert("You have used all 3 rolls. Please select a scoring category.");
    return;
  }

  ThisRoll++;
  animateAndRollDice();
  updateRollCountUI();
});

// End of a Round
function endRound() {
    if (ThisRound >= MaxRounds) {
        alert("Game over!");
        return;
    }
  
    ThisRound++;
    ThisRoll = 0;
  
    //Restore frozen status
    window.frozen.fill(false);
    document.querySelectorAll(".Dice").forEach(d => d.classList.remove("frozen"));
    
    //New round set all to 0 except chosen values
    document.querySelectorAll(".Dice").forEach((die) => {
        die.classList.remove("DiceOne", "DiceTwo", "DiceThree", "DiceFour", "DiceFive", "DiceSix");
        die.classList.remove("show");
    });
    window.diceValues = [0, 0, 0, 0, 0]
    
    document.querySelectorAll(".Results").forEach(cell => {
        const id = cell.id;
        const isTotal = ["R_TotalUpper", "R_TotalLower", "R_Bonus"].includes(id);
        if (!isTotal && !cell.classList.contains("locked")) {
            cell.textContent = "0";
        }
    });
    
    updateScoreTable();
    updateRollCountUI();

    alert(`Starting round ${ThisRound}`);
}

// Update count
function updateRollCountUI() {
    if (rollCountElem) {
        const Score = getScore();
        rollCountElem.textContent = `Round N°${ThisRound} - Roll N°${ThisRoll} - Total Score:${Score}`;
    }
}
/* Show score on the board*/
function updateScoreTable() {
    /* Don't keep unselected value */
    if (!window.diceValues || window.diceValues.every(val => val === 0)) return;

    const counts = Array(7).fill(0);
    for (const val of window.diceValues) {
        counts[val]++;
    }
    
    const upperIds = ["R_Aces", "R_Twos", "R_Threes", "R_Fours", "R_Fives", "R_Sixes"];
    for (let i = 1; i <= 6; i++) {
        const points = counts[i] * i;
        const cell = document.getElementById(upperIds[i - 1]);
        if (!usedCategories.has(upperIds[i - 1])) cell.textContent = points;
    }
    
    const unique = [...new Set(window.diceValues)].sort();
    const sumDice = window.diceValues.reduce((a, b) => a + b, 0);
    
    const threeKind = counts.some(c => c >= 3) ? sumDice : 0;
    if (!usedCategories.has("R_ThreeKind")) document.getElementById("R_ThreeKind").textContent = threeKind;
    
    const fourKind = counts.some(c => c >= 4) ? sumDice : 0;
    if (!usedCategories.has("R_FourKind")) document.getElementById("R_FourKind").textContent = fourKind;
    
    const hasFullHouse = counts.includes(3) && counts.includes(2);
    if (!usedCategories.has("R_FullHouse")) document.getElementById("R_FullHouse").textContent = hasFullHouse ? 25 : 0;
    
    const smallStraights = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
    const hasSmallStraight = smallStraights.some(seq => seq.every(n => unique.includes(n)));
    if (!usedCategories.has("R_SmallStraight")) document.getElementById("R_SmallStraight").textContent = hasSmallStraight ? 30 : 0;
    
    const largeStraights = [[1,2,3,4,5],[2,3,4,5,6]];
    const hasLargeStraight = largeStraights.some(seq => seq.every(n => unique.includes(n)));
    if (!usedCategories.has("R_LargeStraight")) document.getElementById("R_LargeStraight").textContent = hasLargeStraight ? 40 : 0;
    
    const yahtzee = counts.some(c => c === 5) ? 50 : 0;
    if (!usedCategories.has("R_Yahtzee")) document.getElementById("R_Yahtzee").textContent = yahtzee;
    if (!usedCategories.has("R_Chance")) document.getElementById("R_Chance").textContent = sumDice;
    
    updateTotalScores();
}

function scoreUpper(n) {
    return window.diceValues.filter(v => v === n).reduce((a, b) => a + b, 0);
}

function scoreThreeOfKind() {
    const counts = getCounts();
    return counts.some(c => c >= 3) ? sumDice() : 0;
}

function scoreFourOfKind() {
    const counts = getCounts();
    return counts.some(c => c >= 4) ? sumDice() : 0;
}

function scoreFullHouse() {
    const counts = getCounts();
    return counts.includes(3) && counts.includes(2) ? 25 : 0;
}

function scoreSmallStraight() {
    const unique = [...new Set(window.diceValues)].sort();
    const straights = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
    return straights.some(seq => seq.every(n => unique.includes(n))) ? 30 : 0;
}

function scoreLargeStraight() {
    const unique = [...new Set(window.diceValues)].sort();
    const straights = [[1,2,3,4,5],[2,3,4,5,6]];
    return straights.some(seq => seq.every(n => unique.includes(n))) ? 40 : 0;
}

function scoreYahtzee() {
    const counts = getCounts();
    return counts.some(c => c === 5) ? 50 : 0;
}

function scoreChance() {
    return sumDice();
}

function getCounts() {
    const counts = Array(7).fill(0);
    for (const val of window.diceValues) counts[val]++;
    return counts;
}

function sumDice() {
    return window.diceValues.reduce((a, b) => a + b, 0);
}

const scoreFunctions = {
    R_Aces: () => scoreUpper(1),
    R_Twos: () => scoreUpper(2),
    R_Threes: () => scoreUpper(3),
    R_Fours: () => scoreUpper(4),
    R_Fives: () => scoreUpper(5),
    R_Sixes: () => scoreUpper(6),
    R_ThreeKind: scoreThreeOfKind,
    R_FourKind: scoreFourOfKind,
    R_FullHouse: scoreFullHouse,
    R_SmallStraight: scoreSmallStraight,
    R_LargeStraight: scoreLargeStraight,
    R_Yahtzee: scoreYahtzee,
    R_Chance: scoreChance
};

/* Store Points*/
document.querySelectorAll(".Results").forEach(cell => {
    cell.addEventListener("click", () => {
        const id = cell.id;
        
        if (usedCategories.has(id)) return;
        const func = scoreFunctions[id];
        if (!func) return;
        
        const points = func();
        cell.textContent = points;
        usedCategories.add(id);
        cell.classList.add("locked");
        
        endRound();
        updateTotalScores();
    });
});

function updateTotalScores() {
    const upperIds = ["R_Aces", "R_Twos", "R_Threes", "R_Fours", "R_Fives", "R_Sixes"];
    const lowerIds = ["R_ThreeKind", "R_FourKind", "R_FullHouse", "R_SmallStraight", "R_LargeStraight", "R_Yahtzee", "R_Chance"];
    
    let upperTotal = 0;
    let lowerTotal = 0;
    
    upperIds.forEach(id => {
        const val = parseInt(document.getElementById(id).textContent);
        if (!isNaN(val)) upperTotal += val;
    });
    
    lowerIds.forEach(id => {
        const val = parseInt(document.getElementById(id).textContent);
        if (!isNaN(val)) lowerTotal += val;
    });
    
    document.getElementById("R_TotalUpper").textContent = upperTotal;
    document.getElementById("R_TotalLower").textContent = lowerTotal;
    document.getElementById("R_Bonus").textContent = upperTotal >= 63 ? 35 : 0;
}

function getScore() {
    let total = 0;

    document.querySelectorAll(".Results.locked").forEach(cell => {
        const val = parseInt(cell.textContent);
        if (!isNaN(val)) total += val;
    });

    return total;
}