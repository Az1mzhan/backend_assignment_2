import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

class ClientController {
  static weatherApiUrl = "/weather-api";
  static openWeatherApiKey = "d69411d685bb2c6adaf9c6fa51eed7e2";

  constructor() {
    this.fullName = "";
    this.map = null;
    this.currentWeather = null;
    this.news = null;
  }

  capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  createCoordinatesBlock = () => {
    const latValue = document.querySelector("#latitude > b");
    const lonValue = document.querySelector("#longitude > b");

    if (!this.currentWeather.coord.lat && !this.currentWeather.coord.lon)
      return;

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

  createWeatherConditionsBlock = () => {
    this.currentWeather.weather.forEach((weatherCondition) => {
      const weatherConditionsContainer = document.querySelector(
        "#weather-conditions > div"
      );
      const weatherConditionContainer = document.createElement("div");
      const weatherConditionDescription = document.createElement("p");
      const weatherConditionIcon = document.createElement("img");

      weatherConditionDescription.textContent = this.capitalizeString(
        weatherCondition.description
      );
      weatherConditionDescription.className = "weatherConditionDescription";

      weatherConditionIcon.src = `https://openweathermap.org/img/wn/${weatherCondition.icon}.png`;
      weatherConditionIcon.className = "weatherConditionIcon";

      weatherConditionContainer.className = "d-flex align-items-center";
      weatherConditionContainer.appendChild(weatherConditionIcon);
      weatherConditionContainer.appendChild(weatherConditionDescription);

      weatherConditionsContainer.appendChild(weatherConditionContainer);
    });
  };

  createOtherParametersBlock = () => {
    const otherParameters = {
      pressure: `${this.currentWeather.main.pressure} hPa`,
      visibility: `${this.currentWeather.visibility / 1000} km`,
      humidity: `${this.currentWeather.main.humidity}%`,
      cloudiness: `${this.currentWeather.clouds.all}%`,
    };

    const otherParametersValues = document.querySelectorAll(
      "#other-parameters b"
    );

    for (const [i, [key, value]] of Object.entries(
      Object.entries(otherParameters)
    ))
      otherParametersValues[i].textContent = value;
  };

  createWeatherMap = () => {
    const map = document.getElementById("map");

    map.src = `https://www.google.com/maps/embed/v1/view?key=AIzaSyAtoAYIoyHjDrwxRHXqV0vDnKr_DIAC3V0&center=${this.currentWeather.coord.lat},${this.currentWeather.coord.lon}&zoom=10`;
    map.style.display = "block";
  };

  createNewsBlock = async () => {
    const news = (
      await axios.post("/news-api/top-head-lines", {
        countryCode: this.currentWeather.sys.country,
      })
    ).data.articles;

    const newsContainer = document.getElementById("news-container");

    news.forEach((elem) => {
      if (
        elem.title === "[Removed]" ||
        elem.description === "[Removed]" ||
        (!elem.title && !elem.description)
      )
        return;

      const card = document.createElement("div");
      const cardBody = document.createElement("div");
      card.className = "card";
      cardBody.className = "card-body";

      const image = document.createElement("img");
      image.className = "card-img-top";
      if (elem.urlToImage) {
        image.src = elem.urlToImage;
      } else {
        image.src = "../no_image_available.png";
      }
      card.appendChild(image);

      if (elem.title) {
        const title = document.createElement("h6");
        title.className = "card-title";
        title.textContent = elem.title;
        cardBody.appendChild(title);
      }

      if (elem.description) {
        const description = document.createElement("p");
        description.className = "card-text";
        cardBody.appendChild(description);
      }

      const sourceButton = document.createElement("a");
      sourceButton.className = "btn source-button";
      sourceButton.textContent = "Source";
      sourceButton.href = elem.url;
      cardBody.appendChild(sourceButton);

      card.appendChild(cardBody);

      newsContainer.appendChild(card);
    });

    const newsBlock = document.getElementById("news-block");
    newsBlock.appendChild(newsContainer);
    newsBlock.style.display = "flex";
  };

  createForecastBlock = () => {
    const forecastBlock = document.getElementById("forecast-block");
    const forecastTitle = document.getElementById("forecast-title");

    forecastTitle.textContent = this.fullName;

    this.createCoordinatesBlock();
    this.createTemperatureBlock();
    this.createWindBlock();
    this.createWeatherConditionsBlock();
    this.createOtherParametersBlock();
    this.createWeatherMap();

    forecastBlock.style.display = "block";
  };

  createContentBlock = async () => {
    this.createForecastBlock();
    await this.createNewsBlock();
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

        this.fullName = e.target.textContent;

        cityWeatherInput.value = this.fullName;
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

    const cityOptions = (
      await axios.post(
        `${this.constructor.weatherApiUrl}/coordinates-by-location-name`,
        {
          cityName: city,
        }
      )
    ).data;

    this.createCityOptions(cityOptions);
  };
}

export default new ClientController();
