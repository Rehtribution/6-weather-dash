//using moment to get the date
var date = document.querySelector('#date');
date.textContent = moment().format('dddd Do, MMMM YYYY');

// API key and base url
const api = {
    key: 'ca1b3a53179479f039643e324297790d',
    base: 'https://api.openweathermap.org/data/2.5/',
    base2: 'https://api.openweathermap.org/data/2.5/onecall?'
}
// Enter keycode value
const ENTER_KEY_CODE = 13;


//creating the search history from the search input
//want to clear the searchbox contents after keypress
var recentSearchHistory
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);


//grabs the keycody value previously set, runs getresults then saves values to local storage and clears the input
function setQuery(event) {
    if (event.keyCode == ENTER_KEY_CODE) {
        getResults(searchbox.value);
        saveRecentSearches(searchbox.value);
        searchbox.value = '';
        clearCards();
    }
}

//gets the current weather info from the api 
function getResults(query) {
    fetch(`${api.base}weather?q=${query}&APPID=${api.key}&units=imperial`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

//dispays the weather info after grabbing from the api
function displayResults(weather) {
    let lat = weather.coord.lat
    let lon = weather.coord.lon
    getFiveDay(lat, lon)
    var city = document.querySelector('#city');
    var temp = document.querySelector('#temp');
    var weatherIcon = document.querySelector('#weatherIcon');
    var windS = document.querySelector('#wind');
    var humidity = document.querySelector('#humidity');
    var uvi = document.querySelector('#UV-I');
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
    // weatherIcon

    windS.innerHTML = `${Math.round(weather.wind.speed)}<span>mph</span>`;
    humidity.innerHTML = `${(weather.main.humidity)}<span>%</span>`;
    uvi.innerHTML = `${(weather.main.uvi)}<span>#</span>`;
    // uvi showing as undefined nan 
}

//5 day forecast grabs from base2 and displays dynamically creating cards in a card-deck
const fiveDayContainer = document.getElementById("five-day-container")
function getFiveDay(lat, lon) {
    fetch(`${api.base2}lat=${lat}&lon=${lon}&APPID=${api.key}&units=imperial`)
        .then(res => res.json())
        .then((data) => {
            for (let i = 0; i < 5; i++) {
                let card = document.createElement('div')
                card.setAttribute('class', 'card')
                fiveDayContainer.append(card)

                let fiveDayDate = document.createElement('h3')
                fiveDayDate.textContent = moment().add(i + 1, 'days').format('dddd')
                card.append(fiveDayDate)

                let fiveDayTemp = document.createElement('p')
                fiveDayTemp.textContent = 'Temp: ' + data.daily[i].temp.day + '°F'
                // add Math.round to round temps
                card.append(fiveDayTemp)

                // condition icon goes here >
                var weatherIcon = document.createElement('img');
                card.append(weatherIcon);

                // let fiveDayWindS = document.createElement('p')
                // fiveDayWindS.textContent = 'Wind: ' + weather.daily[i].wind.speed + 'mph'
                // card.append(fiveDayWindS);
                // showing as undefined nan / cannot read 'day'
                // windS.innerHTML = `${Math.round(weather.wind.speed)}<span>mph</span>`;

                let fiveDayHumid = document.createElement('p')
                fiveDayHumid.innerHTML = 'Humidity: ' + data.daily[i].humidity.day + '%'
                card.append(fiveDayHumid)
                // nan 
            }
        })
}


//save searches to local storage
function saveRecentSearches(city) {
    recentSearchHistory = localStorage.getItem("recentSearches") ?
        JSON.parse(localStorage.getItem("recentSearches")) : [];
    recentSearchHistory.push(city)

    // keeps array at length of 5 
    if (recentSearchHistory.length > 5) {
        recentSearchHistory.shift();
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearchHistory))
    clearBtns()
    getSearches()
}

getSearches()


//display prior searches in the recent-searches div as buttons
function getSearches() {
    var data = JSON.parse(localStorage.getItem("recentSearches"));
    if (data === null) {
        document.getElementById("search-history").innerHTML = ("No Recent Searches");
    } else {
        data = JSON.parse(localStorage.getItem("recentSearches"));
        for (i = 0; i < data.length; i++) {
            var btn = document.createElement("button")
            btn.textContent = data[i]
            document.querySelector(".cities .btn-group").appendChild(btn)
            btn.className = "btn";
            btn.attributes = "";
        }
    }
}

// this will search for the prior cities when btn is clicked. when I get it working. 
// when clicked getting a key error or when multiple cities it is selecting whole btn-group not just individuals 
// const btn = document.querySelector('.btn-group');
// btn.addEventListener('click', pCity);

// function pCity(event) {
//     console.log("here")
//     var button = event.target;
//     if (event.target.matches("button")){
//         city = button.textContent.trim();
//         console.log(btn.textContent)
//         getResults()
//     }
//     }




//clear history button function
function clearSearches() {
    if (confirm("Are you sure you want to clear all searches?")) {
        window.localStorage.clear();
    } else { }
    location.reload();
}

// function is called in the saverecentsearches, clears button array to replace with new searches 
function clearBtns() {
    const recentBtns = document.querySelector("#search-history");
    recentBtns.innerHTML = ""
}

// called in setQuery function to clear past search card data 
function clearCards() {
    const previousCards = document.querySelector("#five-day-container");
    previousCards.innerHTML = ""
}

//need an error handler