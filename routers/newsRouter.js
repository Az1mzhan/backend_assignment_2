import newsController from "../controllers/NewsController.js";
import { Router } from "express";

const newsRouter = new Router();

newsRouter.route("/top-head-lines").post(newsController.getTopHeadlines);

export default newsRouter;
