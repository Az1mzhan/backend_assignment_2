import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

class ClientController {
  static weatherApiUrl = "/weather-api";

  constructor() {
    this.currentWeather = null;
  }

  createCoordinatesBlock = () => {
    const latValue = document.querySelector("#latitude > b");
    const lonValue = document.querySelector("#longitude > b");

    latValue.textContent = this.currentWeather.coord.lat;
    lonValue.textContent = this.currentWeather.coord.lon;
  };

  createTemperatureBlock = () => {
    const temperatureParameters = [];

    for (const property in this.currentWeather.main) {
      if (property !== "humidity" && property !== "pressure") {
        temperatureParameters.push(
          Math.round(this.currentWeather.main[property])
        );
      }
    }

    const parametersSpans = Array.from(
      document.querySelectorAll("#temperature-block b")
    );

    for (let i = 0; i < temperatureParameters.length; ++i)
      parametersSpans[i].textContent = `${temperatureParameters[i]} °C`;
  };

  defineWindDirection = (property) => {
    let windDirection;

    if (
      (this.currentWeather.wind[property] >= 0 &&
        this.currentWeather.wind[property] < 22.5) ||
      (this.currentWeather.wind[property] >= 337.5 &&
        this.currentWeather.wind[property] <= 360)
    )
      windDirection = "East";
    if (
      this.currentWeather.wind[property] >= 22.5 &&
      this.currentWeather.wind[property] < 67.5
    )
      windDirection = "North-east";
    if (
      this.currentWeather.wind[property] >= 67.5 &&
      this.currentWeather.wind[property] < 112.5
    )
      windDirection = "North";
    if (
      this.currentWeather.wind[property] >= 122.5 &&
      this.currentWeather.wind[property] < 157.5
    )
      windDirection = "North-west";
    if (
      this.currentWeather.wind[property] >= 157.5 &&
      this.currentWeather.wind[property] < 202.5
    )
      windDirection = "West";
    if (
      this.currentWeather.wind[property] >= 202.5 &&
      this.currentWeather.wind[property] < 247.5
    )
      windDirection = "South-west";
    if (
      this.currentWeather.wind[property] >= 247.5 &&
      this.currentWeather.wind[property] < 292.5
    )
      windDirection = "South";
    if (
      this.currentWeather.wind[property] >= 292.5 &&
      this.currentWeather.wind[property] < 337.5
    )
      windDirection = "South-east";

    return windDirection;
  };

  createWindBlock = () => {
    let windDirection, speed;

    for (const property in this.currentWeather.wind) {
      if (property === "deg") {
        windDirection = this.defineWindDirection(property);
      } else speed = this.currentWeather.wind[property];
    }

    const parametersSpans = Array.from(
      document.querySelectorAll("#wind-block b")
    );

    for (let i = 0; i < parametersSpans.length; ++i) {
      if (i === 0) parametersSpans[i].textContent = `${speed} m/s`;
      else parametersSpans[i].textContent = windDirection;
    }
  };

  capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  createWeatherConditionsBlock = () => {
    this.currentWeather.weather.forEach((weatherCondition) => {
      const weatherConditionsContainer =
        document.getElementById("weather-conditions");
      const weatherConditionContainer = document.createElement("div");
      const weatherConditionDescription = document.createElement("p");
      const weatherConditionIcon = document.createElement("img");

      weatherConditionDescription.textContent = this.capitalizeString(
        weatherCondition.description
      );
      weatherConditionIcon.src = `https://openweathermap.org/img/wn/${weatherCondition.icon}.png`;

      weatherConditionContainer.className = "d-flex";
      weatherConditionContainer.appendChild(weatherConditionIcon);
      weatherConditionContainer.appendChild(weatherConditionDescription);

      weatherConditionsContainer.appendChild(weatherConditionContainer);
    });
  };

  createForecastBlock = () => {
    const forecastBlock = document.getElementById("forecast-block");

    console.log(this.currentWeather);

    this.createCoordinatesBlock();
    this.createTemperatureBlock();
    this.createWindBlock();
    this.createWeatherConditionsBlock();

    forecastBlock.style.visibility = "visible";
  };

  createCityOptions = (cityOptions) => {
    cityOptions.forEach((elem) => {
      let name;

      if (!elem.local_names || !elem.local_names.en) name = elem.name;
      else name = elem.local_names.en;

      const cityOptionButton = document.createElement("button");

      cityOptionButton.className = "city-option-btn";
      cityOptionButton.textContent = `${name}, ${elem.country}`;
      cityOptionButton.onclick = async (e) => {
        const cityWeatherInput = document.getElementById("city-weather-input");
        const cityOptions = document.getElementById("city-options");

        cityWeatherInput.value = e.target.textContent;
        cityOptions.innerHTML = "";

        this.currentWeather = (
          await axios.post(
            `${this.constructor.weatherApiUrl}/current-weather-forecast`,
            {
              lat: elem.lat,
              lon: elem.lon,
            }
          )
        ).data;
      };

      document.getElementById("city-options").appendChild(cityOptionButton);
    });
  };

  showCitySuggestions = async (e) => {
    const city = e.target.value;

    const cityOptionsRequest = await axios.post(
      `${this.constructor.weatherApiUrl}/coordinates-by-location-name`,
      {
        cityName: city,
      }
    );

    const cityOptions = cityOptionsRequest.data;

    this.createCityOptions(cityOptions);
  };
}

export default new ClientController();
