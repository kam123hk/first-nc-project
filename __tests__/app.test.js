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
            expect(article.votes).toBe(0);
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

    test("PATCH 200: responds with the patched article object", () => {
        const patchedVote = {inc_votes: 2}
        return request(app)
        .patch("/api/articles/5")
        .send(patchedVote)
        .expect(200)        
        .then(({body}) => {
            const {article} = body;
            expect(article.article_id).toBe(5);
            expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy");
            expect(article.topic).toBe("cats");
            expect(article.author).toBe("rogersop");
            expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
            expect(article.created_at).toBe("2020-08-03T13:14:00.000Z");
            expect(article.votes).toBe(2);
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    });
    test("PATCH 404: responds with error message not found when article_id is a number but does not exist", () => {
        const patchedVote = {inc_votes: 2};
        return request(app)
        .patch("/api/articles/109")
        .send(patchedVote)
        .expect(404)        
        .then(({body}) => {
            expect(body.message).toBe('article not found');
        })
    });
    test("PATCH 400: responds with error message bad request when article_id is invalid", () => {
        const patchedVote = {inc_votes: 2};
        return request(app)
        .patch("/api/articles/not_an_article")
        .send(patchedVote)
        .expect(400)
        .then(({body}) => {    
            expect(body.message).toBe('bad request');
        })
    });
    test("PATCH 400: responds with error message bad request for invalid inc_votes property", () => {
        const patchedVote = {inc_votes: 'string'}
        return request(app)
        .patch("/api/articles/5")
        .send(patchedVote)
        .expect(400)        
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
    test("PATCH 400: responds with an error message bad request when the comment object has incorrect or missing keys", () => {
        const patchedVote = {wrongKey: 2, anotherKey: -5};
        return request(app)
        .patch("/api/articles/5")
        .send(patchedVote)
        .expect(400)        
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });

    test("GET 200: FEATURE responds with article object that has correct comment_count property", () => {
        return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article.comment_count).toBe(2);
        })
    })

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
    });

    test("GET 200: FEATURE responds with array of articles with the topic value specified in the query", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .expect(({body}) => {
            const {articles} = body;
            expect(articles.length).toBe(12);
            articles.forEach(article => {
                expect(article.topic).toBe('mitch');
            })
        })
    });
    test("GET 404: FEATURE responds with error message not found when topic value in query does not exist", () => {
        return request(app)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .expect(({body}) => {
            expect(body.message).toBe('topic not found')
        })
    });
    test("GET 200: FEATURE responds with empty array when topic value in query exists but not present in any article", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .expect(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(0)
        })
    })

    test("GET 200: FEATURE: responds with an array of articles sorted by title in descending order", () => {
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("title", {descending: true});
        })
    });
    test("GET 200: FEATURE: responds with an array of articles sorted by any valid column in descending order", () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("comment_count", {descending: true});
        })
    });
    test("GET 200: FEATURE responds with an array of articles sorted by date in ascending order", () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("created_at");
        })
    });
    test("GET 200: FEATURE responds with an array of articles sorted any valid column in ascending order", () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSortedBy("votes");
        })
    });
    test("GET 400: FEATURE responds with error message bad request when sorted by an invalid column", () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_column')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request");
        })
    });
    test("GET 400: FEATURE responds with error message bad request when sorted by an invalid order query", () => {
        return request(app)
        .get('/api/articles?sort_by=article_img_url&order=invalid_order')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request");
        })
    });

    test("POST 201: responds with the posted article object with the correct properties", () => {
        const postArticle = {
            title: "Cats musical to feature rapping cat",            
            topic: "cats",
            author: 'lurker',
            body: "Composer Andrew Lloyd Webber said the character of Rum Tum Tugger would become 'a street cat' in the show",
            created_at: 1404740880000,
            article_img_url: "https://ichef.bbci.co.uk/news/976/mcs/media/images/75881000/jpg/_75881969_cats_getty.jpg"
        }
        return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(201)
        .then(({body}) => {
            const {article} = body;
            expect(article.author).toBe('lurker');
            expect(article.title).toBe("Cats musical to feature rapping cat");
            expect(article.article_id).toBe(14);
            expect(article.topic).toBe('cats');
            expect(article.body).toBe("Composer Andrew Lloyd Webber said the character of Rum Tum Tugger would become 'a street cat' in the show");
            expect(article.created_at).toBe('2014-07-07T13:48:00.000Z');
            expect(article.votes).toBe(0);
            expect(article.article_img_url).toBe("https://ichef.bbci.co.uk/news/976/mcs/media/images/75881000/jpg/_75881969_cats_getty.jpg");
            expect(article.comment_count).toBe(0);
        })
    });
    test("POST 201: responds with an article object with default article_img_url when no such property is given in the request", () => {
        const postArticle = {
            title: "Cats musical to feature rapping cat",            
            topic: "cats",
            author: 'lurker',
            body: "Composer Andrew Lloyd Webber said the character of Rum Tum Tugger would become 'a street cat' in the show",
            created_at: 1404740880000,
            article_img_url: null
        }
        return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(201)
        .then(({body}) => {
            const {article} = body;
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700");
        })
    })

})

describe("/api/articles/:article_id/comments", () => {
    test("GET 200: responds with an array of comments for the article_id where each comment has the correct properties", () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments.length).toBe(2);            
            comments.forEach(comment => {
                expect(typeof comment.comment_id).toBe('number');
                expect(typeof comment.votes).toBe('number');
                expect(typeof comment.created_at).toBe('string');
                expect(typeof comment.author).toBe('string');
                expect(typeof comment.body).toBe('string');
                expect(typeof comment.article_id).toBe('number');
            })
        })
    });
    test("GET 200: responds with an array of comments in date descending order", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {   
            const {comments} = body;
            expect(comments).toBeSortedBy("created_at", {descending: true});
        })
    });
    test("GET 200: responds with empty array when article_id exists but is not in comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {   
            const {comments} = body;   
            expect(comments.length).toBe(0);
        })
    });
    test("GET 404: responds with error message not found when article_id is a number but does not exist", () => {
        return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({body}) => { 
            expect(body.message).toBe('article not found');
        })
    });
    test("GET 400: responds with error message bad request when article_id is invalid", () => {
        return request(app)
        .get("/api/articles/not_an_article/comments")
        .expect(400)
        .then(({body}) => {    
            expect(body.message).toBe('bad request');
        })
    });
    test("POST 201: responds with the posted comment", () => {
        const postedComment = {
        username: 'lurker',
        body: 'Love to lurk, just love it.'
       };
       return request(app)
       .post("/api/articles/9/comments")
       .send(postedComment)
       .expect(201)
       .then(({body}) => {
            const {comment} = body;
            const timeInMS = Date.now();
            expect(comment.comment_id).toBe(19);
            expect(comment.body).toBe('Love to lurk, just love it.');
            expect(comment.article_id).toBe(9);
            expect(comment.author).toBe('lurker');
            expect(comment.votes).toBe(0)
            expect(typeof comment.created_at).toBe('string');
            expect(Date.parse(comment.created_at)).toBeLessThanOrEqual(timeInMS);
            expect(Date.parse(comment.created_at)).toBeGreaterThan(timeInMS - 5000);
       })
    });
    test("POST 400: responds with an error message bad request when article_id is not an integer", () => {
        const postedComment = {
            username: 'lurker',
            body: 'Love to lurk, just love it.'
           };
        return request(app)
        .post("/api/articles/not_a_valid_article_id/comments")
        .send(postedComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
    test("POST 404: responds with an error message not found when article_id is an integer but does not exist in database", () => {
        const postedComment = {
            username: 'lurker',
            body: 'Love to lurk, just love it.'
           };
        return request(app)
        .post("/api/articles/20/comments")
        .send(postedComment)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('article not found');
        })
    });
    test("POST 404: responds with an error message not found when username does not exist in database", () => {
        const postedComment = {
            username: 123,
            body: 123
           };
        return request(app)
        .post("/api/articles/9/comments")
        .send(postedComment)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('user not found');
        })
    });
    test("POST 400: responds with an error message bad request when the comment object has incorrect or missing keys", () => {
        const postedComment = {
            username:'butter_bridge',
            wrongKey: 'yolo',
            superfluousKey: 23
           };
        return request(app)
        .post("/api/articles/9/comments")
        .send(postedComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
    test("POST 400: responds with an error message bad request when no username or body provided", () => {
        const postedComment = {
            username: null,
            body: 0
           };
        return request(app)
        .post("/api/articles/9/comments")
        .send(postedComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
})


describe("/api/comments/:comment_id", () => {
    test("DELETE 204: responds with no content", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    test("DELETE 404: responds with error message not found when comment id is valid but does not exist in database", () => {
        return request(app)
        .delete("/api/comments/0")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('comment not found')
        })
    });
    test("DELETE 400: responds with error message bad request when comment id is invalid", () => {
        return request(app)
        .delete("/api/comments/invalid")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request')
        })
    });

    test("PATCH 201: responds with comment object with updated votes", () => {
        const patchedVote = {inc_votes: 12};
        return request(app)
        .patch("/api/comments/1")
        .send(patchedVote)
        .expect(201)
        .then(({body}) => {
            const {comment} = body;
            expect(comment.comment_id).toBe(1)
            expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!");
            expect(comment.author).toBe('butter_bridge')
            expect(comment.article_id).toBe(9);
            expect(comment.created_at).toBe('2020-04-06T12:17:00.000Z');
            expect(comment.votes).toBe(28);
        })
    });
    test("PATCH 404: responds with error message not found when comment id is valid but not in database", () => {
        const patchedVote = {inc_votes: 12};
        return request(app)
        .patch("/api/comments/0")
        .send(patchedVote)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('comment not found');
        })
    });
    test("PATCH 400: responds with error message bad request when comment id is invalid", () => {
        const patchedVote = {inc_votes: 12};
        return request(app)
        .patch("/api/comments/invalid_comment_id")
        .send(patchedVote)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
    test("PATCH 400: responds with error message bad request when patched vote object has invalid property", () => {
        const patchedVote = {inc_votes: 'invalid_property'};
        return request(app)
        .patch("/api/comments/1")
        .send(patchedVote)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });
    test("PATCH 400: responds with error message bad request when patched vote object has invalid key", () => {
        const patchedVote = {invalid_key: 12};
        return request(app)
        .patch("/api/comments/1")
        .send(patchedVote)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('bad request');
        })
    });

});


describe("GET /api/users", () => {
    test("GET 200: responds with an array of all users", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const {users} = body;
            expect(users.length).toBe(4);
            users.forEach(user => {
                expect(typeof user.username).toBe('string');
                expect(typeof user.name).toBe('string');
                expect(typeof user.avatar_url).toBe('string');
            })
        })
    })
})

describe("/api/users/:username", () => {
    test("GET 200: responds with a user object with the correct properties", () => {
        return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({body}) => {
            const {user} = body;
            expect(user.username).toBe('butter_bridge');
            expect(user.name).toBe('jonny');
            expect(user.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
        })
    });
    test("GET 404: responds with error message not found when given username does not exist in database", () => {
        return request(app)
        .get("/api/users/!")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('username not found');
        })
    })
})