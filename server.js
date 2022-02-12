const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Rating = require("./models/Rating");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "build")));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../ecorate/build")));

//connect to db
const connectDB = require("./db");
// allows node to parse through json recieved from the front-end
dotenv.config({ path: "./config/.env" });

//connect to mongodb atlas
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/post", async (req, res) => {
  let data = req.body;
  let location = data.location;
  let cleanliness = data.cleanliness;
  let reusableMaterial = data.reusableMaterial;
  let traffic = data.traffic;
  let plants = data.plants;
  let recycle = data.recycle;
  console.log(data);

  try {
    // creats new rating model from retrieved data
    const newRating = {
      location: location,
      cleanliness: cleanliness,
      reusableMaterial: reusableMaterial,
      traffic: traffic,
      plants: plants,
      recycle: recycle,
    };

    //check if location already has rating
    let rating = await Rating.findOne({ location: location });
    console.log(rating);
    if (rating) {
      await Rating.updateOne(
        { location: location },
        {
          $push: {
            cleanliness: newRating.cleanliness,
            reusableMaterial: newRating.reusableMaterial,
            traffic: newRating.traffic,
            recycle: newRating.recycle,
            plants: newRating.plants,
          },
        }
      );

      res.redirect("/");
    } else {
      //places new location rating into database
      await Rating.create(newRating);
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/ratingsDB", (req, res) => {
  //allows the client side of the app to rcieve the ratings from the database
  Rating.find({})

    .then((items) => {
      res.send(items);
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../ecorate/build", "index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
