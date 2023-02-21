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
    //console.log(arrayArticles.rows);
    return arrayArticles.rows;
  });
};

module.exports = { fetchTopics, fetchAllArticles };
