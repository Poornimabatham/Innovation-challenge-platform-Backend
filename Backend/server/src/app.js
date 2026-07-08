const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Innovation Challenge Platform API Running" });
});


app.use("/api/auth", require("./routes/authRoutes"));


module.exports = app;
