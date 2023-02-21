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
app.all("/api/*", handle404nonExistentPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
