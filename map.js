function fetchWeather() {
  const api_key = "d31afd84f86566d07af685de4cd49f9b"; 
  const url = `https://serpapi.com/search.json?engine=google_maps&q=Coffee&ll=@40.7455096,-74.0083012,14z&api_key=${api_key}`;

  fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Handle your API response here
    })
    .catch(error => console.error("Error fetching weather data:", error));
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
});

