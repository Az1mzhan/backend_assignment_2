import clientController from "./ClientController.js";

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("city-weather-input")
    .addEventListener("change", clientController.showCitySuggestions);

  document
    .getElementById("get-weather-forecast-btn")
    .addEventListener("click", clientController.createContentBlock);
});
