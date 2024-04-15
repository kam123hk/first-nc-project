const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("/api/topics", () => {
    test("GET 200: responds with an array of topic objects with the slug and description properties", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const {topics} = body;
            expect(topics.length).toBe(3);
            topics.forEach(topic => {
                expect(typeof topic.description).toBe('string');
                expect(typeof topic.slug).toBe('string');
            })
        })
    });
    // test("GET 404: ", () => {

    // })
})