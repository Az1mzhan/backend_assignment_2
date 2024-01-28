import path from "path";
import { __dirname } from "../app.js";

class MainController {
  getFormPage(req, res) {
    try {
      res.status(200).sendFile(path.join(__dirname, "index.html"));
    } catch (err) {
      console.error(err);

      res.status(400).send();
    }
  }
}

export default new MainController();
