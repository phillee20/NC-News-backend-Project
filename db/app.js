const express = require("express");
const app = express();
app.use(express.json());

const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
  handle404nonExistentPaths,
} = require("../errorController");

const {
  getAPI,
  getTopics,
  getAllArticles,
  getArticleID,
} = require("../appController");

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleID);

//ERROR HANDLING
app.get("/api/*", (request, response) => {
  response.status(404).send({ msg: "Error(404) - Invalid Path!" });
});

app.use(handle404nonExistentPaths);
app.use(handleServerErrors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
