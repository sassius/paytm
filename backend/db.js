require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastname: String,
});
const User = mongoose.model("User", userSchema);

module.exports = {
    User
}
