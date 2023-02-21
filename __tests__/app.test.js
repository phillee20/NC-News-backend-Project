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
describe("API", () => {
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
  describe("GET/api/topics - Display Array of topics objects", () => {
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
  //404 Error Path
  describe("Error Invalid Path", () => {
    it("404: GET responds with error - Invalid Path!", () => {
      return request(app)
        .get("/api/invalidPath")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Error(404) - Invalid Path!");
        });
    });
  });

  //GET /API/ARTICLES
  describe("GET/api/articles - Display Array of article objects", () => {
    it("200: GET responds with an array of article objects, each of which to have appropriate properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
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
}); //End Describe bracket Root
