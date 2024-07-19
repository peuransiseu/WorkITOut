import './indexStyle.css'
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";


const darkModeButton = document.querySelector('#dark-mode-btn');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-prompt');


function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

darkModeButton.addEventListener('click', darkMode); 

const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
// const prompt = "Give me a short joke to motivate me today, referencing plants, animals, or flowers by adding emoji. Don't show the prompt, only the joke. Do not add anything like Here is a joke... just return the joke alone";
//const prompt = "Give me a short quote to motivate me today, referencing struggles, about not giving up, or encouraging words to keep going. Don't show the prompt, only the quote. Do not add anything like Here is a quote... just return the quote alone";

//const prompt = "Give me a joke about trees. Don't show the prompt, only the joke. Add emojis as well."
// const prompt = "Give me a mot "
const conversation = [
  {
    role: "user",
    content: [{ text: prompt }],
  },
];


function fetchExercise(){

  disableButton(true);
  showLoadingAnimation();

  const targetInputContainer = document.querySelector(`#body-container`);
  const HTMLString = `<fieldset id="prompt-field">
                        <legend>Your Exercise Plan</legend>
                        <section class="exercise-prompt">
                          <h3 id="affirmation">Loading...</h3>
                        </section>
                      </fieldset>`;

  try{
    targetInputContainer.insertAdjacentHTML('afterend',HTMLString)
  } catch(err) {
    console.error(err);
    document.querySelector("#affirmation").innerHTML = err;
  }
  disableButton(false);
}

addEntryButton.addEventListener('click', fetchExercise);

async function fetchNewAffirmation() {
  disableButton(true);
  showLoadingAnimation();

  try {
    const response = await client.send(new ConverseCommand({ modelId, messages: conversation }));
    const affirmation = response.output.message.content[0].text;
    // set the affirmation in HTML
    document.querySelector("#affirmation").innerHTML = affirmation;
  } catch (err) {
    console.error(err);
    document.querySelector("#affirmation").innerHTML = err;
  }

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

init();

// Called on page load (or refresh), fetches a new affirmation
async function init() {
  try {
    // get the user's credentials from environment variables
    const creds = await fetchCredentials();
    // instantiate the BedrockRuntimeClient  
    client = await createBedrockClient(creds);
    // Once everything is setup, let's get the first affirmation
    await fetchNewAffirmation();

  } catch(err) {
    console.error(err);
    document.querySelector("#affirmation").innerHTML = err;
  }
  
  const affirmationButton = document.querySelector("#getNewAffirmation");
  //affirmationButton.addEventListener("click", fetchNewAffirmation);
}

let client = null;
async function createBedrockClient(creds) {  
  client = await new BedrockRuntimeClient({
    credentials: creds.credentials,
    region: creds.region
  });
  return client;
}

async function fetchCredentials() {
  // This is necessary as we are using Vite which resticts access to environment variables unless they are prefixed with VITE_
  // You can set these in your shell or in a .env.local file
  return {
    region: "ap-southeast-2",  // this must match the region you enabled the model on. In my case it's us-west-2. It may not be in your case.
    credentials: {
      //accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      //secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      //sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,

  //  hardcoded, not a right approach
      accessKeyId: "AKIA2UC3CCVICJ2KDOWS",
      secretAccessKey: "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",

    },
  };
}