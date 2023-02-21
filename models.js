const db = require("./db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topicsData) => {
    //console.log(topicsData, "TOPICS DATA!");
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

module.exports = { fetchTopics, fetchAllArticles, fetchArticleByID };
