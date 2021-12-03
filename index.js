require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const axios = require("axios");
const User = require("./Models/User");

mongoose.connect(process.env.MONGODB_URI);

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const apiUrl = "https://lereacteur-marvel-api.herokuapp.com";
apiKey = process.env.MARVEL_API_KEY;

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Marvel.");
});

app.post("/sign_up", async (req, res) => {
  try {
    console.log(req.fields);
    res.status(200).json("Retrieved Data");
    if (req.fields.username && req.fields.email) {
      try {
        const registeredEmail = await User.findOne({ email: req.fields.email });
        if (!registeredEmail) {
          try {
            const salt = uid2(16);
            const hash = SHA256(req.fields.password + salt).toString(encBase64);
            const token = uid2(16);

            const newUser = new User({
              email: req.fields.email,
              account: {
                username: req.fields.username,
              },
              token: token,
              hash: hash,
              salt: salt,
            });
            await newUser.save();
            res.status(200).json({
              _id: newUser._id,
              token: newUser.token,
              account: newUser.account,
            });
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
        }
      } catch (error) {
        res.status(400).json({ message: "Email already in database" });
      }
    } else {
      res.status(400).json("Please provide a username and email");
    }
  } catch (error) {
    console.log("SOME ERROR");
    res.status(400).json({ message: error.message });
  }
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
    for (let i = 0; i < req.fields.favTab[0].length; i++) {
      const response = await axios.get(
        `${apiUrl}/character/${req.fields.favTab[0][i]}?apiKey=${apiKey}`
      );
      // tu push la réponse dans fav
      fav.push(response.data);
    }

    // on renvoie fav au client
    console.log(fav);
    res.status(200).json(fav);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/favouritescom", async (req, res) => {
  try {
    console.log(req.fields.favTab[1]);
    let favCom = [];
    for (let i = 0; i < req.fields.favTab[1].length; i++) {
      const response = await axios.get(
        `${apiUrl}/comic/${req.fields.favTab[1][i]}?apiKey=${apiKey}`
      );
      favCom.push(response.data);
    }
    res.status(200).json(favCom);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
