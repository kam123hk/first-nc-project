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
            expect(article.article_id).toBe(5);
            expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy");
            expect(article.topic).toBe("cats");
            expect(article.author).toBe("rogersop");
            expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
            expect(article.created_at).toBe("2020-08-03T13:14:00.000Z");
            expect(article.votes).toBe(17);
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    });
    test("GET 200: responds with an article object with the correct properties when the article_id is not present in the comments table", () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article.article_id).toBe(2);
            expect(article.title).toBe("Sony Vaio; or, The Laptop");
            expect(article.topic).toBe("mitch");
            expect(article.author).toBe("icellusedkars");
            expect(article.body).toBe("Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.");
            expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
            expect(article.votes).toBe(0);
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    });
    test("GET 400: responds with message saying bad request if article id is invalid", () => {
        return request(app)
        .get("/api/articles/just_not_a_valid_id")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    })
    test("GET 404: responds with a message to say not found if article id does not exist", () => {
        return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('article not found')
        })
    });
    // "/api/articles/" endpoint returns 'path not found' but should this go under 'bad request'?
})

describe("/api/articles", () => {
    test("GET 200: responds with an array of all articles without the body property", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles.length).toBe(13);
            articles.forEach(article => {                
                expect(typeof article.author).toBe('string');
                expect(typeof article.title).toBe('string');
                expect(typeof article.article_id).toBe('number');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.created_at).toBe('string');
                expect(typeof article.votes).toBe('number');
                expect(typeof article.article_img_url).toBe('string');
                expect(typeof article.comment_count).toBe('number');
                expect(article.body).toBe(undefined);
            })
        })
    });
    test("GET 200: responds with articles sorted by date in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {            
            const {articles} = body;
            expect(articles).toBeSortedBy("created_at", {descending: true});
        })
    })
})