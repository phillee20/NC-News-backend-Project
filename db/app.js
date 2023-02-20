const express = require("express");
const app = express();
app.use(express.json());

const { getAPI, getTopics } = require("../appController");

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/*", (request, response) => {
  response.status(404).send({ msg: "Error(404) - Invalid Path!" });
});

module.exports = app;
