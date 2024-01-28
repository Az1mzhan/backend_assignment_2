import weatherController from "../controllers/WeatherController.js";
import { Router } from "express";

const weatherRouter = new Router();

weatherRouter
  .route("/coordinates-by-location-name")
  .post(weatherController.getCoordinatesByLocationName);

weatherRouter
  .route("/current-weather-forecast")
  .post(weatherController.getCurrentWeatherForecast);

weatherRouter
  .route("/five-day-weather-forecast")
  .get(weatherController.getFiveDayWeatherForecast);

weatherRouter.route("/weather-map").get(weatherController.getWeatherMap);

export default weatherRouter;
