const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
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
  getArticleComments,
  postArticleComments,
  updateVotes,
  getUsers,
} = require("../appController");

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleID);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postArticleComments);

app.patch("/api/articles/:article_id", updateVotes);

//ERROR HANDLING
app.all("*", handle404nonExistentPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
