const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
//order matter cors and express.json should be above 
app.use(cors());
app.use(express.json());
const mainRouter = require("./routes/index");
app.use("/api/v1",mainRouter)
app.get("/",(req,res)=>{
    res.send("hello friend")
})
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    message: "internal server error",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 \n http://localhost:3000");
});

