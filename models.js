const db = require("./db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topicsData) => {
    //console.log(topicsData, "TOPICS DATA!");
    return topicsData.rows;
  });
};

module.exports = { fetchTopics };
