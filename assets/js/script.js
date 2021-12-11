// API key and base url
const api = {
    key: 'ca1b3a53179479f039643e324297790d',
    base: 'https://api.openweathermap.org/data/2.5/',
    base2: 'https://api.openweathermap.org/data/2.5/onecall?'
}
// Enter keycode value
const ENTER_KEY_CODE = 13;

// eliminates duplicate cities in the search history
// not working 
// function find(c) {
//     for (var i = 0; i < recentSearches.length; i++) {
//         if (c === recentSearches[i]) {
//             return -1;
//         }
//     }
//     return 1;
// }

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
    // condition icon goes here >
    var wind = document.querySelector('#wind');
    var humidity = document.querySelector('#humidity');
    var uvi = document.querySelector('#UV-I');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    wind.innerHTML = `${(weather.main.wind)}<span>MPH</span>`;
    // wind showing as undefined nan 
    humidity.innerHTML = `${(weather.main.humidity)}<span>%</span>`;
    uvi.innerHTML = `${(weather.main.uvi)}`;
    // uvi showing as undefined nan 
}

//5 day forecast
const fiveDayContainer = document.getElementById("five-day-container")
function getFiveDay(lat, lon) {
    fiveDayContainer.innerHTML = ""
    fetch(`${api.base2}lat=${lat}&lon=${lon}&APPID=${api.key}&units=imperial`)
        .then(res => res.json())
        .then((data) => {
            // document.getElementById('UV-I').textContent = data.current.uvi
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

                // let fiveDayWind = document.createElement('p')
                // fiveDayWind.textContent = 'Wind: ' + data.daily[i].wind.day + 'MPH'
                // card.append(fiveDayWind)
                // showing as undefined nan / cannot read 'day'

                let fiveDayHumid = document.createElement('p')
                fiveDayHumid.innerHTML = 'Humidity: ' + data.daily[i].humidity.day + '%'
                card.append(fiveDayHumid)
                // nan 
            }
        })
}

//using moment to get the date
var date = document.querySelector('#date');
date.textContent = moment().format('dddd Do, MMMM YYYY');

//save searches to local storage
function saveRecentSearches(city) {
    recentSearchHistory = localStorage.getItem("recentSearches") ?
        JSON.parse(localStorage.getItem("recentSearches")) :
        [];
    recentSearchHistory.push(city)
    localStorage.setItem("recentSearches", JSON.stringify(recentSearchHistory))
    getSearches()
}
getSearches()


//display prior searches in the recent-searches div
//want to dispay 5
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
            btn.attributes = ""
        }
        getResults(data[data.length - 1]);
    }
}

// click past search button. not working needs work 
function PastSearch(e) {
    var btn = e.target;
    if (e.target.matches("button")) {
        query = btn.textContent.trim();
        getResults(query);
    }
}


//clear history function
function clearSearches() {
    if (confirm("Are you sure you want to clear all searches?")) {
        window.localStorage.clear();
    } else { }
    location.reload();
}

// onload () {
//     load last city searched if any
// }

// example of error function
// function error() {
//     $('#current-location').text('Cannot get your current location.');
//   }