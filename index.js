require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const axios = require("axios");

const apiUrl = "https://lereacteur-marvel-api.herokuapp.com";
apiKey = process.env.MARVEL_API_KEY;

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Marvel.");
});

app.get("/characters", async (req, res) => {
  // let offset = Number(req.query.offset);

  if (req.query.name) {
    try {
      const response = await axios.get(
        `${apiUrl}/characters?apiKey=${apiKey}&limit=100&offset=${req.query.offset}&name=${req.query.name}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const response = await axios.get(
        `${apiUrl}/characters?apiKey=${apiKey}&limit=100&offset=${offset}`
      );

      res.json(response.data);
    } catch (error) {
      res.status(400).json({ nessage: error.message });
    }
  }
});

app.get("/comics", async (req, res) => {
  let offset = req.query.offset;
  if (req.query.title) {
    //let title = new RegExp(req.fields.title, "g");
    try {
      const response = await axios.get(
        `${apiUrl}/comics?apiKey=${apiKey}&offset=${offset}&title=${req.query.title}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const response = await axios.get(
        `${apiUrl}/comics?apiKey=${apiKey}&offset=${offset}`
      );
      res.json(response.data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

app.get("/comics/:characterId", async (req, res) => {
  const id = req.params.characterId;
  try {
    const response = await axios.get(`${apiUrl}/comics/${id}?apiKey=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Marvel server up.");
});
