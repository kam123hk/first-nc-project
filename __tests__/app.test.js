const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json")

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
});

describe("*", () => {
    test("404: responds with message path not found with an endpoint that does not exist", () => {
        return request(app)
        .get("/api/topics!")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('path not found');
        })
    })
})

describe("/api", () => {
    test("GET 200: responds with an object describing all the available endpoints on the API", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({res}) => {
            const endpointsObj = JSON.parse(res.text)
            expect(endpointsObj).toEqual(endpoints)
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET 200: responds with an article object with the correct properties", () => {
        return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy");
            expect(article.topic).toBe("cats");
            expect(article.author).toBe("rogersop");
            expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
            expect(article.created_at).toBe("2020-08-03T13:14:00.000Z");
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    })    
})