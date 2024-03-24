require('dotenv').config();
const mongoose = require('mongoose');

async function conn() {
    mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("🎉 Successfully connected to MongoDB.");
    })
    .catch((err) => {
      console.error(" Failed to connect to MongoDB\n", err);
      process.exit();
    });
}

module.exports = conn; 