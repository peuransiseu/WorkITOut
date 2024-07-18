import './indexStyle.css'

// An array of affirmations
const affirmations = ["You've got this", "You are amazing", "You can achieve anything", "You are awesome", "Tite"];

async function fetchNewAffirmation() {
  disableButton(true);
  showLoadingAnimation();

  // choose a random affirmation from the array
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  // set the affirmation
  document.querySelector("#affirmation").innerHTML = affirmation;
  disableButton(false);
}

// Shows a loading animation while fetching a new affirmation
function showLoadingAnimation() {
  document.querySelector("#affirmation").innerHTML = '<div class="loading-spinner"></div>';
}

// Disables the button while fetching a new affirmation so we don't request several at once by clicking repeatedly
function disableButton(isDisabled) {
  const affirmationButton = document.querySelector("#getNewAffirmation");
  affirmationButton.disabled = isDisabled;
}

// Called on page load (or refresh), fetches a new affirmation
async function init() {
  await fetchNewAffirmation();
  
  const affirmationButton = document.querySelector("#getNewAffirmation");
  affirmationButton.addEventListener("click", fetchNewAffirmation);
}

init();