const mongoose = require("mongoose");
// schema for the rating of each location
const RatingsSchema = new mongoose.Schema({
  location: {
    type: Object,
  },

  cleanliness: {
    type: Array,
  },

  reusableMaterial: {
    type: Array,
  },

  traffic: {
    type: Array,
  },

  recycle: {
    type: Array,
  },

  plants: {
    type: Array,
  },
});

module.exports = mongoose.model("Ratings", RatingsSchema);
