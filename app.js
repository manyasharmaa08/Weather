const apiKey = "39cebb6b0d49c81d7cb1b6b5f4cdfed1";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";  

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");
const errorBox = document.querySelector(".error");
const weatherBox = document.querySelector(".weather");


const tempEl = document.querySelector(".temp");
const uniBtn = document.querySelector(".unit-btn");
let currentTempC = null;
let isCelcius = true;

const card = document.querySelector(".card");


const themes = {
    Clear: "clear",
    Clouds: "clouds",
    Rain: "rain",
    Drizzle: "rain",
    Thunderstorm: "storm",
    Mist: "mist",
    Haze: "mist",
    Fog: "mist",
    Smoke: "mist",
    Snow: "snow"
};


function showTemp(){
    if(currentTempC === null) return;

    if(isCelcius){
        tempEl.innerHTML = Math.round(currentTempC) + "°C";
        uniBtn.innerHTML = "Switch to °F";
    }else{
        tempEl.innerHTML = Math.round(currentTempC * 9 / 5 + 32) + "°F";
        uniBtn.innerHTML = "Switch to °C";
    }
}

function showError(message){
    errorBox.querySelector("p").innerHTML = message;
    errorBox.style.display = "block";
    weatherBox.style.display = "none";
}


async function getWeather(query){
    const response = await fetch(apiUrl + query + `&appid=${apiKey}`);

    if(response.status == 404){
        showError("Invalid city name");
        return;
    }
    if(!response.ok){
        showError("Something went wrong. Please try again.");
        return;
    }

    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;

    currentTempC = data.main.temp;
    showTemp();

    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";

    if(data.weather[0].main == "Clouds"){
        weatherIcon.src = "clouds.png";
    }else if(data.weather[0].main == "Clear"){
        weatherIcon.src = "clear.png";
    }else if(data.weather[0].main == "Rain"){
        weatherIcon.src = "rain.png";
    }else if(data.weather[0].main == "Mist"){
        weatherIcon.src = "mist.png";
    }else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src = "drizzle.png";
    }

    const condition = data.weather[0].main;
     const theme = themes[condition] || "";
    card.className = "card " + theme;
    weatherBox.style.display = "block";
    errorBox.style.display = "none";

    localStorage.setItem("lastCity", data.name);
}

function searchByCity(city){
    city = city.trim();
    if(!city) return;
    getWeather(`&q=${encodeURIComponent(city)}`);
}

function searchByLocation(){
    if(!navigator.geolocation){
        showError("Your browser doesn't support location.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(`&lat=${lat}&lon=${lon}`);
        },
        () => {
            showError("Location access denied.");
        }
    );
}

searchBtn.addEventListener("click", () => {
    searchByCity(searchBox.value);
});

locationBtn.addEventListener("click", searchByLocation);

uniBtn.addEventListener("click", () => {
    isCelcius = !isCelcius;
    showTemp();
});

const savedCity = localStorage.getItem("lastCity");
if(savedCity){
    searchBox.value = savedCity;
    searchByCity(savedCity);
}