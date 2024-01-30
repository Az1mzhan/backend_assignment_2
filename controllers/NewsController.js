import "dotenv/config";
import axios from "axios";

class NewsController {
  getTopHeadlines = async (req, res) => {
    try {
      const { countryCode } = req.body;

      const formattedCountryCode = countryCode.toLowerCase();

      const data = (
        await axios.get(
          `https://newsapi.org/v2/top-headlines?country=${formattedCountryCode}&apiKey=${process.env.NEWS_API_KEY}`
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
}

export default new NewsController();
