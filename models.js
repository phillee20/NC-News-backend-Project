const db = require("./db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topicsData) => {
    return topicsData.rows;
  });
};

const fetchAllArticles = () => {
  const strQuery = `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
`;

  return db.query(strQuery).then((arrayArticles) => {
    return arrayArticles.rows;
  });
};

const fetchArticleByID = (article_id) => {
  return db
    .query(
      `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found!" });
      }
      return result.rows[0];
    });
};

const checkUsernameExist = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid Post Request!" });
      }
    });
};

/*
const checkArticleExist = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Unable to find ID!" });
      }
    });
};
*/

const fetchArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
  WHERE article_id = $1 
  ORDER BY created_at DESC;
  `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

const postComment = (article_id, body, username) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid Post Request!" });
  }
  return db
    .query(
      `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *; 
    `,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const patchVotes = (article_id, newVote) => {
  return db
    .query(
      `
  UPDATE articles 
  SET votes = $1
  WHERE article_id = $2
  RETURNING *;`,
      [newVote, article_id]
    )
    .then((result) => {
      console.log(result);
      //return result.rows;
    });
};

module.exports = {
  fetchTopics,
  fetchAllArticles,
  fetchArticleByID,
  fetchArticleComments,
  postComment,
  checkUsernameExist,
  patchVotes,
};
