import "dotenv/config";
import axios from "axios";

class WeatherController {
  getCoordinatesByLocationName = async (req, res) => {
    try {
      const { cityName } = req.body;

      const data = (
        await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${process.env.OPEN_WEATHER_API_KEY}`
        )
      ).data;

      res.status(200).send(data);
    } catch (err) {
      console.error(err);

      res.status(400).send({
        errorMessage: "The server couldn't retrieve coordinates of location",
      });
    }
  };

  getCurrentWeatherForecast = async (req, res) => {
    try {
      const { lat, lon } = req.body;

      const data = (
        await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`
        )
      ).data;

      res.status(200).send(data);
    } catch (err) {
      console.error(err);

      res.status(400).send({
        errorMessage:
          "The server couldn't retrieve the current weather forecast of location",
      });
    }
  };

  getFiveDayWeatherForecast = async (req, res) => {
    try {
      const { lat, lon } = req.body;

      const data = (
        await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
        )
      ).data;

      res.status(200).send(data);
    } catch (err) {
      console.error(err);

      res.status(400).send({
        errorMessage:
          "The server couldn't retrieve the five day weather forecast of location",
      });
    }
  };

  getWeatherMap = async (req, res) => {
    try {
      const { layer } = req.body;

      const data = (
        await axios.get(
          `https://tile.openweathermap.org/map/${layer}/8/255/255.png?appid=${process.env.OPEN_WEATHER_API_KEY}`
        )
      ).data;

      res.status(200).send(data);
    } catch (err) {
      console.error(err);

      res.status(400).send({
        errorMessage:
          "The server couldn't retrieve the weather map of location",
      });
    }
  };
}

export default new WeatherController();
