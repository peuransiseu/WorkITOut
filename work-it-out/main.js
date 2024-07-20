import './indexStyle.css'
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";


// const darkModeButton = document.querySelector('#dark-mode-btn');

const addEntryButton = document.getElementById('add-prompt');


// function darkMode() {
//   var element = document.body;
//   element.classList.toggle("dark-mode");
// }

// darkModeButton.addEventListener('click', darkMode); 

const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
const quotePrompt = "Give me a short quote to motivate me today, referencing struggles, about not giving up, or encouraging words to keep going. Don't show the prompt, only the quote. Do not add anything like Here is a quote... just return the quote alone";

// const exercisePrompt = `Give me a simple ${intensityDropdown.value} workout guide in a listed format that focuses on ${bodyDropdown.value} parts. I want to do it in ${timeDropdown.value} for ${frequencyDropdown.value} times in a week. Do not add anything like Here is a simple workout guide...just return the list alone.`;

const conversation = [
  {
    role: "user",
    content: [{ text: quotePrompt }],
  },
];



async function fetchExercise(){

  disableButtonExercise(true);
  showLoadingAnimationExercise();

  const intensityDropdown = document.getElementById('intensity-dropdown');
  const bodyDropdown = document.getElementById('body-dropdown');
  const timeDropdown = document.getElementById('time-dropdown'); 
  const frequencyDropdown = document.getElementById('frequency-dropdown');

  try{

    const exercisePrompt = `Give me a simple ${intensityDropdown.value} workout guide in a listed format that focuses on ${bodyDropdown.value} parts. I want to do it in ${timeDropdown.value} for ${frequencyDropdown.value} times in a week. 
    Do not add anything like Here is a simple workout guide...just return the list alone. Ensure each step starts on a new line. Don't include any number. Please ensure the instructions are clear and concise.`;

    //Ensure each step is numbered and starts on a new line
    const exercise = [
      {
        role: "user",
        content: [{ text: exercisePrompt }],
      },
    ];

    const response = await client.send(new ConverseCommand({ modelId, messages: exercise }));
    const workoutGuide = response.output.message.content[0].text;

    const responseArray = workoutGuide.split('\n');
    const workoutPlanContainer = document.getElementById('exercise-plan');

    const ul = document.createElement('ul');
    responseArray.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.trim();
      ul.appendChild(li); 
    });

    workoutPlanContainer.innerHTML = '';
    workoutPlanContainer.appendChild(ul);

    // set the affirmation in HTML
    
    // document.querySelector("#exercise-plan").innerHTML = workoutGuide;
  } catch(err) {
    console.error(err);
    document.querySelector("#exercise-plan").innerHTML = err;
  }
  disableButtonExercise(false);
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


// Shows a loading animation on exercise plan while fetching a new plan
function showLoadingAnimationExercise() {
  document.querySelector("#exercise-plan").innerHTML = '<div class="loading">Generating Exercise.....</div>';
}


// Disables the button while fetching a new plan so we don't request several at once by clicking repeatedly
function disableButtonExercise(isDisabled) {
  const affirmationButton = document.querySelector("#add-prompt");
  affirmationButton.disabled = isDisabled;
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
  affirmationButton.addEventListener("click", fetchNewAffirmation);
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