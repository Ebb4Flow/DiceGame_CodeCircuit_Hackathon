/* Initial dice values and frozen status */
window.diceValues = [0, 0, 0, 0, 0];
window.frozen = [false, false, false, false, false];

/* Get cup and dice elements */
const cup = document.getElementById("Cup");
const dice = document.querySelectorAll(".Dice");
const btnRoll = document.getElementById("Btn-Roll");

/* Game state */
let isRolling = false;
let rollsLeft = 3;

/* Freeze/unfreeze dice on click */
dice.forEach((die, index) => {
  die.addEventListener("click", () => {
    window.frozen[index] = !window.frozen[index];
    die.classList.toggle("frozen");
  });
});

/* Animate the cup across each die and reveal them one by one */
async function animateAndRollDice() {
  if (isRolling || rollsLeft <= 0) return;

  isRolling = true;
  btnRoll.disabled = true;

  const faceNames = ["One", "Two", "Three", "Four", "Five", "Six"];
  cup.style.display = "block";

  for (let i = 0; i < dice.length; i++) {
    if (window.frozen[i]) continue;

    const die = dice[i];
    const rect = die.getBoundingClientRect();
    const containerRect = document.getElementById("Animations").getBoundingClientRect();
    const offsetLeft = rect.left - containerRect.left;

    cup.style.left = `${offsetLeft}px`;

    await new Promise(resolve => setTimeout(resolve, 400));

    const random = Math.floor(Math.random() * 6) + 1;
    window.diceValues[i] = random;

    die.classList.remove("DiceOne", "DiceTwo", "DiceThree", "DiceFour", "DiceFive", "DiceSix", "show");

    void die.offsetWidth;
    die.src = `Public/Images/Dice_${faceNames[random - 1]}.png`;
    die.classList.add(`Dice${faceNames[random - 1]}`);
    die.classList.add("show");
  }

  /* Small pause then hide the cup */
  await new Promise(resolve => setTimeout(resolve, 500));
  cup.style.display = "none";

  updateScoreTable();

  rollsLeft--;
  isRolling = false;

  if (rollsLeft > 0) {
    btnRoll.disabled = false;
  } else {
    btnRoll.disabled = true;
    // Puedes mostrar un mensaje tipo: showMiniAlert("Choose a category to continue.");
  }
}

/* Roll button event */
btnRoll.addEventListener("click", animateAndRollDice);
