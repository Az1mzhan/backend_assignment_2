import "dotenv/config";
import express from "express";
import path from "path";
import weatherRouter from "./routers/weatherRouter.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/weather-api", weatherRouter);

const start = () => {
  try {
    app.listen(port, () => {
      console.info(
        `The server has been successfully started on the port: ${port}`
      );
    });
  } catch (err) {
    console.error(err);
  }
};

start();
