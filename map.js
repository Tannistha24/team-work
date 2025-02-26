const weatherForm=document.querySelector(".weatherForm");
const cityInput=document.querySelector(".cityInput");
const card=document.querySelector(".card");
const apiKey="72bbb6e6a585e73075962aaee00347d5"
weatherForm.addEventListener("submit", async event =>{
    event.preventDefault();
    const city=cityInput.value
    if(city){
        try{
            const weatherData=await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }
});
async function getWeatherData(city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response=await fetch(apiUrl);
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}
function displayWeatherInfo(data){
    const {name: city, main: { temp, humidity } ,weather:[{ description, id }] }= data;
    card.textContent="";
    card.style.display="flex";
    const cityDisplay=document.createElement("h1");
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("p");
    cityDisplay.textContent=city;
    tempDisplay.textContent=`${(temp-273.15).toFixed(1)}°C`;
    humidityDisplay.textContent=`Humididty:${humidity}%`;
    descDisplay.textContent= description;
    weatherEmoji.textContent=getWeatherEmoji(id);
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId>=200 && weatherId<300):
        return "⛈";
        case(weatherId>=300 && weatherId<400):
        return "🌧";
        case(weatherId>=500 && weatherId<600):
        return "🌧" ;
        case(weatherId>=600 && weatherId<700):
        return "❄" ;
        case(weatherId>=700 && weatherId<800):
        return "🌫" ;
        case (weatherId === 800): 
        return "☀"; 
        case (weatherId > 800 && weatherId < 810): 
        return "☁";
        default:
            return "❓";

    }
}   
function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent=message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent="";
    card.style.display="flex";
    card.appendChild(errorDisplay);

} 




/*for sign in*/

document.addEventListener("DOMContentLoaded", function() {
    let form = document.querySelector("#signinForm form");
    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent actual form submission

        let enteredUsername = usernameInput.value.trim();
        let enteredPassword = passwordInput.value.trim();

        if (enteredUsername === "" || enteredPassword === "") {
            alert("Please fill all the details! ");
        } else {
            alert("Sign In Successful! Redirecting to main website...");
            window.location.href = "index.html"; // Redirect to main page
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    let resetButton = document.getElementById("r1"); // Reset button
    let form = document.querySelector("#signinForm form"); // Form element

    resetButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent any unintended behavior
        form.reset(); // Clears all input fields
    });
})
  
/*MAPs*/
let map, autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat:20.5937, lng:78.96269  }, // Default location
        zoom: 13
    });

    const input = document.getElementById('pac-input');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Add a marker
        new google.maps.Marker({
            position: place.geometry.location,
            map: map
        });

        // Call your existing weather function to fetch weather data for the selected location
        fetchWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

/*Open Ai */

async function getAIResponse(userInput) {
    const apiKey = "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";  // Make sure this is correct!

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",  // Use "gpt-4" if your key supports it
                messages: [{ role: "user", content: userInput }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "AI service unavailable. Please check API key & network.";
    }
}


let lastRequestTime = 0;

async function askAI() {
    const userQuery = document.getElementById("weatherInput").value;
    const aiResponseElement = document.getElementById("aiResponse");

    if (!userQuery.trim()) {
        aiResponseElement.innerText = "Please enter a query.";
        return;
    }

    const now = Date.now();
    if (now - lastRequestTime < 5000) {  // 5 seconds delay between requests
        aiResponseElement.innerText = "You're sending requests too quickly. Please wait.";
        return;
    }

    lastRequestTime = now;

    try {
        aiResponseElement.innerText = "Processing...";
        const aiResponse = await getAIResponse(userQuery);
        aiResponseElement.innerText = aiResponse;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        aiResponseElement.innerText = "AI service unavailable. Try again later.";
    }
}

/*FOr Voice Assistance*/
const voiceButton = document.getElementById("voiceButton");
const transcriptElement = document.getElementById("transcript");

// Check if browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Your browser does not support voice recognition. Try using Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stops after user speaks
    recognition.lang = "en-US"; // Set language

    voiceButton.addEventListener("click", () => {
        transcriptElement.innerText = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const userQuery = event.results[0][0].transcript;
        transcriptElement.innerText = `You said: "${userQuery}"`;
        document.getElementById("weatherInput").value = userQuery; // Autofill input box
        askAI(); // Send query to AI
    };

    recognition.onerror = (event) => {
        transcriptElement.innerText = "Error recognizing speech. Try again.";
        console.error("Speech Recognition Error:", event.error);
    };
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set language
    synth.speak(utterance);
}

async function askAI() {
    const userQuery = document.getElementById("weatherInput").value;
    const aiResponseElement = document.getElementById("aiResponse");

    if (!userQuery.trim()) {
        aiResponseElement.innerText = "Please enter a query.";
        return;
    }

    try {
        aiResponseElement.innerText = "Processing...";
        const aiResponse = await getAIResponse(userQuery);
        aiResponseElement.innerText = aiResponse;
        speak(aiResponse); // Speak the response
    } catch (error) {
        console.error("Error fetching AI response:", error);
        aiResponseElement.innerText = "AI service unavailable.";
        speak("AI service unavailable.");
    }
}
