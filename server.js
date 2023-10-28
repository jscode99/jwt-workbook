require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    name: "Jishnu Satheesh",
    age: "25",
    job: "Commander - Special agent RAW",
  },
  {
    name: "Dilli Das",
    age: "35",
    job: "Sniper RAW",
  },
  {
    name: "Kareena kapoor",
    age: "25",
    job: "Special agent RAW",
  },
  {
    name: "Emma watson",
    age: "24",
    job: "Special agent RAW",
  },
  {
    name: "Blake Lively",
    age: "30",
    job: "Special agent RAW",
  },
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log("Hit the authentication...");
    next();
  });
}

app.get("/posts", authenticateToken, (req, res) => {
  const filteredPosts = posts.filter((post) => post.name === req.user.name);
  if (filteredPosts.length === 0)
    return res.send({ status: 404, message: "No officer found" });
  res.send(filteredPosts);
});

app.listen(3001);
