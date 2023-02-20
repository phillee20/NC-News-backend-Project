const request = require("supertest");
const app = require("../db/app");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

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
  describe("GET/api/topics", () => {
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
  it.skip("404: GET responds with error - Invalid Path!", () => {
    return request(app)
      .get("./api/invalidPath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Error - Invalid Path!");
      });
  });
}); //End Describe bracket Root
