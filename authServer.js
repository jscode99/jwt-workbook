require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "10s" });
}

app.post("/login", (req, res) => {
  const username = req.body.username;
  if (!username) return res.send(401);
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY);
  refreshTokens.push(refreshToken);
  res.send({
    accessToken,
    refreshToken,
  });
  console.log(`${username} is logged in successfully`);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log(...refreshTokens);
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(401).send({
      message: `Invalid refresh token!`,
    });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(401);
    const newToken = generateAccessToken({ name: user.name });
    res.status(200).send({newToken});
  });
});

app.listen(4000);
