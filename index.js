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
  const limit = 100;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  if (req.query.name) {
    try {
      const response = await axios.get(
        `${apiUrl}/characters?apiKey=${apiKey}&page=${page}&limit=${limit}&skip=${skip}&name=${req.query.name}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const response = await axios.get(
        `${apiUrl}/characters?apiKey=${apiKey}&page=${page}&limit=${limit}&skip=${skip}`
      );

      res.json(response.data);
    } catch (error) {
      res.status(400).json({ nessage: error.message });
    }
  }
});

app.post("/favourites", async (req, res) => {
  try {
    console.log(req.fields.favTab[0]);
    let fav = [];
    for (let i = 1; i < req.fields.favTab[0].length; i++) {
      // faire un requete pour récupérer les info d'un char
      const response = await axios.get(
        `${apiUrl}/characters?apiKey=${apiKey}&name=${favTab[0][i]}`
      );
      // tu push la réponse dans fav
      fav.push(response.data);
    }

    // on renvoie fav au client
    console.log(fav);
  } catch (error) {
    res.status(400).json({ message: "totototo" });
  }
});

app.get("/comics", async (req, res) => {
  const limit = 100;
  const page = req.query.page;
  const skip = (page - 1) * limit;
  if (req.query.title) {
    //let title = new RegExp(req.fields.title, "g");
    try {
      const response = await axios.get(
        `${apiUrl}/comics?apiKey=${apiKey}&page=${page}&limit=${limit}&skip=${skip}&title=${req.query.title}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const response = await axios.get(
        `${apiUrl}/comics?apiKey=${apiKey}&page=${page}&limit=${limit}&skip=${skip}`
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
