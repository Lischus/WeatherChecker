var searchedCities = []

var searchButton = document.querySelector(".searchBtn")


function getCoordinates(city) {
    var coordinateURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=61c4e10047acc72ea5e22c4f2a7d9dac`
    fetch(coordinateURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            getApi(city, data.coord.lat, data.coord.lon)
        })
}

var todaysForecast = document.querySelector(".today")

var fiveDayLocation = document.querySelector(".five-day")
var fiveDayImageLocation = document.querySelector(".img")
var fiveDayTempLocation = document.querySelector(".temp")
var fiveDayHumidLocation = document.querySelector(".humid")
var fiveDayWindLocation = document.querySelector(".wind")
var futureDates = document.querySelector(".futureDates")

function getApi(city, lat, lon) {
    var requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=61c4e10047acc72ea5e22c4f2a7d9dac`

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            todaysForecast.innerHTML = ''
            fiveDayImageLocation.innerHTML = ''
            fiveDayTempLocation.innerHTML = ''
            fiveDayHumidLocation.innerHTML = ''
            fiveDayWindLocation.innerHTML = ''
            futureDates.innerHTML = ''
            var iconURL = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`

            var cityName = document.createElement("p")
            cityName.setAttribute("class", "cityCurrently")
            cityName.textContent = city
            todaysForecast.append(cityName)

            var currentTempForecast = document.createElement("p")
            currentTempForecast.setAttribute("class", "tempCurrently")
            var temperatureF = ((data.current.temp - 273.15) * 9 / 5 + 32)
            currentTempForecast.textContent = temperatureF.toFixed(2);
            todaysForecast.append(currentTempForecast);

            var currentHumidForecast = document.createElement("p")
            currentHumidForecast.setAttribute("class", "humidCurrently")
            currentHumidForecast.textContent = data.current.humidity;
            todaysForecast.append(currentHumidForecast);

            var currentWindSpeed = document.createElement("p")
            currentWindSpeed.setAttribute("class", "windCurrently")
            var windMPH = (data.current.wind_speed * 2.237);
            currentWindSpeed.textContent = windMPH.toFixed(2);
            todaysForecast.append(currentWindSpeed);

            var currentUV = document.createElement("span")
            currentUV.setAttribute("class", "uvIndex")
            currentUV.textContent = data.current.uvi;
            todaysForecast.append(currentUV);

            var currentUVColor = ""

            if (data.current.uvi <= 2.99) {
                currentUVColor = "green"
            } else if (data.current.uvi >= 3 && data.current.uvi <= 5.99) {
                currentUVColor = "yellow"
            } else {
                currentUVColor = "red"
            }

            var currentUVIndexColor = document.createElement("p")
            currentUVIndexColor.setAttribute("class", `uvIndex ${currentUVColor}`)
            todaysForecast.append(currentUVIndexColor)

            var currentIcon = document.createElement("img")
            currentIcon.setAttribute("class", "currentDayIcon")
            currentIcon.setAttribute("src", iconURL)
            todaysForecast.append(currentIcon)

            var whatIsToday = $("#currentDay").text(moment().format("MMM Do, YYYY"));

            $(".tomorrow").text(moment().add(1, 'days').format("MMM Do, YYYY"));
            $(".twoDays").text(moment().add(2, 'days').format("MMM Do, YYYY"));
            $(".threeDays").text(moment().add(3, 'days').format("MMM Do, YYYY"));
            $(".fourDays").text(moment().add(4, 'days').format("MMM Do, YYYY"));
            $(".fiveDays").text(moment().add(5, 'days').format("MMM Do, YYYY"));

            for (var i = 0; i < 5; i++) {
                var fiveIconURL = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`
                var fiveDayIcon = document.createElement("img")
                fiveDayIcon.setAttribute("class", "fiveDayWeatherIcon")
                fiveDayIcon.setAttribute("src", fiveIconURL)
                fiveDayImageLocation.append(fiveDayIcon);
            }
            for (var i = 0; i < 5; i++) {
                var tempForecast = document.createElement("span")
                tempForecast.setAttribute("class", "fiveDayTemp")
                var fiveTemperatureF = ((data.daily[i].temp.max - 273.15) * 9 / 5 + 32)
                tempForecast.textContent = fiveTemperatureF.toFixed(2);
                fiveDayTempLocation.append(tempForecast);

                var humidForecast = document.createElement("span")
                humidForecast.setAttribute("class", "fiveDayHumid")
                humidForecast.textContent = data.daily[i].humidity;
                fiveDayHumidLocation.append(humidForecast);

                var windForecast = document.createElement("span")
                windForecast.setAttribute("class", "fiveDayWind")
                var fiveWindMPH = (data.daily[i].wind_speed * 2.237);
                windForecast.textContent = fiveWindMPH.toFixed(2);
                fiveDayWindLocation.append(windForecast);
            }
        })
}

var searchBar = document.querySelector(".searchBar")

var searchRow = document.querySelector(".searchRow")

var pastCities = document.querySelector(".pastCities")

pastCities.textContent = '';

function beginSearch() {
    var currentCity = $(searchRow).children(".searchBar").val()
    searchedCities.push(currentCity)
    localStorage.setItem("City History", searchedCities);
    cityButtons(searchedCities)
    getCoordinates(currentCity)
}

function cityButtons(cities) {
    pastCities.innerHTML = ""
    for (var i = 0; i < cities.length; i++) {
        var cityButton = document.createElement("button")
        cityButton.setAttribute("class", "buttonHistory");
        cityButton.setAttribute("data-search", cities[i]);
        cityButton.textContent = cities[i]
        pastCities.append(cityButton)
    }
}

function handleSearchHistory(event) {
    var historyButton = event.target
    var clickedCity = historyButton.getAttribute("data-search");
    getCoordinates(clickedCity)
}

searchButton.addEventListener("click", beginSearch)

pastCities.addEventListener("click", handleSearchHistory)