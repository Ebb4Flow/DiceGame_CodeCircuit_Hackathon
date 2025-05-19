window.diceValues = [0, 0, 0, 0, 0];
window.frozen = [false, false, false, false, false];

const cup = document.getElementById("Cup");
const dice = document.querySelectorAll(".Dice");

/* Freeze/unfreeze dice on click */
dice.forEach((die, index) => {
  die.addEventListener("click", () => {
    window.frozen[index] = !window.frozen[index];
    die.classList.toggle("frozen");
  });
});

/* Animate the cup across each die and reveal them one by one */
async function animateAndRollDice() {
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

  // Small pause then hide the cup
  await new Promise(resolve => setTimeout(resolve, 500));
  cup.style.display = "none";

  updateScoreTable();
}
