import mainController from "../controllers/MainController.js";
import { Router } from "express";

const mainRouter = new Router();

mainRouter.route("/").get(mainController.getFormPage);

export default mainRouter;
