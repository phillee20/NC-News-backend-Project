const request = require("supertest");
const app = require("../db/app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

//GET API
describe("GET", () => {
  describe("GET/api", () => {
    it("200: Should get a response message saying successful", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("We have connected successfully");
        });
    });
  });

  //GET API/TOPICS
  describe("GET/api/topics - Display an Array of topics objects", () => {
    it("200: Should respond with an array of topics objects, each of which to have slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toBeInstanceOf(Array);
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });

  //404 ERROR PATH
  describe("Test for 404 Error - /api/Invalid Path", () => {
    it("404: GET responds with error - Invalid Path!", () => {
      return request(app)
        .get("/api/invalidPath")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Error(404) - Invalid Path!");
        });
    });
  });

  //GET /API/ALL ARTICLES
  describe("GET/api/articles - Display an Array of article objects", () => {
    it("200: GET responds with an array of article objects, each of which to have appropriate properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeInstanceOf(Array);
          expect(body.articles).toHaveLength(12);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
            coerce: false,
          });
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("body");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
  });

  //GET ARTICLE BY ID - Includes comment count
  describe("GET /api/articles/:article_id, includes comment count property", () => {
    it("200: should respond with the specified article object", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
              title: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
            })
          );
        });
    });
  });

  //ERROR 404 WHEN GIVEN NON EXISTENT ID
  describe("Tests for Sad Path Article ID", () => {
    it("404: should return a message saying ID not found when given an ID that does not exist in the data set", () => {
      return request(app)
        .get("/api/articles/103")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ID not found!");
        });
    });

    //ERROR 400 WHEN GIVEN INVALID ARTICLE_ID
    it("400: should return a message saying invalid Input when given an invalid ID", () => {
      return request(app)
        .get("/api/articles/doritos")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request - Not a Valid ID!");
        });
    });
  });

  //GET AN ARRAY OF COMMENTS FROM SPECIFIC ARTICLE ID
  describe("GET an array of comments for the given article ID", () => {
    it("200: should respond with an array of Comments objects relating to the specified article ID", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeInstanceOf(Array);
          expect(response.body.comments).toHaveLength(11);
          expect(response.body.comments).toBeSortedBy("created_at", {
            descending: true,
            coerce: false,
          });
          response.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });

    //GET AN EMPTY ARRAY WHEN GIVEN AN ARTICLE ID WITH NO COMMENTS
    it("200: should return an empty array when given an article ID that has no comments ", () => {
      return request(app)
        .get("/api/articles/4/comments") //Q - Why is 4 not showing as invalid, as 888?
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
  });

  //ERROR 404 WHEN GIVEN NON EXISTENT ARTICLE ID TO COMMENTS PATH
  describe("Tests for Sad path to the Comments path", () => {
    it("404: should respond with a 404 error when given a non existent article ID for comments", () => {
      return request(app)
        .get("/api/articles/888/comments")
        .expect(404)
        .then(({ body }) => {
          //console.log(body, "BODY!");
          expect(body.msg).toBe("ID not found!");
        });
    });

    //400 ERROR WHEN GIVEN INVALID PATH IN COMMENTS PATH
    it("400: should respond with a 400 error - Invalid ID when given a non valid path", () => {
      return request(app)
        .get("/api/articles/invalidWord/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request - Not a Valid ID!");
        });
    });
  });
}); //End Describe API/GET bracket

describe("POST METHOD", () => {
  describe("POST method for posting the comment made by the client", () => {
    it("201: should respond with the posted comment made by the client which means it is a successful post", () => {
      //arrange
      const newComment = {
        username: "lurker",
        body: "Testing new comment is posted!",
      };

      return request(app)
        .post("/api/articles/6/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          //console.log(response.body, "HERE");
          expect(response.body.postedComment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              body: "Testing new comment is posted!",
              article_id: 6,
              author: "lurker",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
  });

  //ERROR 400 - POST WITH USERNAME THAT DOES NOT EXIST
  describe("Sad Paths for POST Method", () => {
    it("400: Post with username that does not exist - should respond with Status 400 - ", () => {
      //arrange
      const newComment = {
        username: "Phil",
        body: "Testing new comment for sad path",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Post Request!");
        });
    });

    //ERROR 404 POST WITHOUT USERNAME AND BODY CONTENT
    it("400: Post with empty comment - should respond with Status 400 - ", () => {
      //arrange
      const newComment = {};

      return request(app)
        .post("/api/articles/8/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Post Request!");
        });
    });

    //ERROR 404 - POST WITH VALID BUT NON EXISTENT ARTICLE ID
    it("404: Post with a valid ID but it is not an existent ID", () => {
      //arrange
      const newComment = {
        username: "butter_bridge",
        body: "This is a valid but non existent Article ID",
      };

      return request(app)
        .post("/api/articles/520/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Unable to find ID!");
        });
    });

    //POST WITH INVALID ARTICLE ID GIVES ERROR 400 - BAD REQUEST
    it("400: Post with an invalid ID and returns 400 Bad Request", () => {
      //arrange
      const newComment = {
        username: "butter_bridge",
        body: "This is an invalid Article ID with the word banana",
      };

      return request(app)
        .post("/api/articles/bananas/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request - Not a Valid ID!");
        });
    });
  });
});
