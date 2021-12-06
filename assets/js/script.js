

// API key and base url
const api = {
    key: 'ca1b3a53179479f039643e324297790d',
    base: 'https://api.openweathermap.org/data/2.5/',
    base2:'https://api.openweathermap.org/data/2.5/onecall?'
}
// Enter keycode value
const ENTER_KEY_CODE = 13;

var recentSearchHistory
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

//grabs the keycody value previously set
function setQuery(event) {
    if (event.keyCode == ENTER_KEY_CODE) {
        getResults(searchbox.value);
        saveRecentSearches(searchbox.value)
    }
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&APPID=${api.key}&units=imperial`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

function displayResults(weather) {
    console.log(weather);
    let lat = weather.coord.lat
    let lon = weather.coord.lon
    getFiveDay(lat, lon)
    var city = document.querySelector('#city');
    var temp = document.querySelector('#temp')
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
}

const fiveDayContainer = document.getElementById("five-day-container")
function getFiveDay(lat, lon) {
    fetch(`${api.base2}lat=${lat}&lon=${lon}&APPID=${api.key}&units=imperial`)
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        document.getElementById('UV-I').textContent = data.current.uvi
        for (let i = 0; i < 5; i++) {
            let card = document.createElement('div')
            card.setAttribute('class', 'card')
            fiveDayContainer.append(card)

            let fiveDayDate = document.createElement('h3')
            fiveDayDate.textContent = moment().add(i + 1, 'days').format('dddd')
            card.append(fiveDayDate)

            let fiveDayTemp = document.createElement('p')
            fiveDayTemp.textContent = 'Temp: ' + data.daily[i].temp.day + '°F'
            card.append(fiveDayTemp)
        }
    })
}

var date = document.querySelector('#date');
date.textContent = moment().format('dddd MMMM, YYYY');

//save searches to local storage
function saveRecentSearches(city) {
    recentSearchHistory = localStorage.getItem("recentSearches") ?
        JSON.parse(localStorage.getItem("recentSearches")) :
        [];
    recentSearchHistory.push(city)
    localStorage.setItem("recentSearches", JSON.stringify(recentSearchHistory))
    console.log(recentSearchHistory)
    getSearches()
}
getSearches()

function getSearches() {
    recentSearchHistory = JSON.parse(localStorage.getItem("recentSearches"))
    if( recentSearchHistory === null) {
        // add text conent to search-history saying no history
    } else {
        // clear that searc history
        // loop through recentSearchHistory then create a button in the loop and for each button add recentSearchHistory[i]
    }
}


//clear history function
function clearSearches() {
    if (confirm("Are you sure you want to clear all searches?")) {
        window.localStorage.clear();
    } else { }

    location.reload();
}
