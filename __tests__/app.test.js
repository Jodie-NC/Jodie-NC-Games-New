const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { app } = require("../app");
const data = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
////TASK 13 GET API
describe("/api", () => {
  test("200: GET- responds with a JSON object containing all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        // console.log(response.body);
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointsJSON);
        expect(endpoints).toMatchObject(endpointsJSON);
      });
  });
});
////TASK 3
describe("/api/categories", () => {
  test("200: GET- responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        expect(body.categories).toHaveLength(4);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
////TASK 5
describe("/api/reviews/:review_id", () => {
  test("200: GET- should return a status code of 200", () => {
    return request(app).get("/api/reviews/3").expect(200);
  });
  test("200: GET- Should respond with a review object by a review_id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 3,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("200: GET- Should match expected test review", () => {
    const expectedArticle = {
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 1,
    };
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject(expectedArticle);
      });
  });

  test("200: GET- responds with status 400 if endpoint is an invalid review id", () => {
    return request(app)
      .get("/api/reviews/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Request");
      });
  });
  test("404: GET- responds with status 404 and error message if endpoint is a valid but non-existent review id", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});

////TASK 4
describe("/api/reviews", () => {
  test("200: GET- /api/reviews should return 200 status code", () => {
    return request(app).get("/api/reviews").expect(200);
  });
  test("200: GET- /api/reviews should return an an array sorted in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("200: GET- /api/reviews responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(10);
        response.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});
////TASK 6
describe("GET /api/reviews/:review_id/comments", () => {
  test("should respond with an array of comments for the given review ID with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("200: GET - responds with an empty array when given a valid review that has no comments ", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(body.comments).toEqual([]);
      });
  });
  test("should respond with status 400 if the review ID is invalid ", () => {
    return request(app)
      .get("/api/reviews/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Request");
      });
  });

  test("should respond with status 404 if the review ID is non existent ", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });

  test("Responds with array of all comment descending", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
////TASK 7
describe("POST /api/reviews/:review_id/comments", () => {
  test("201: POST - should respond with a 201 and an object with properties of username and body ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({ username: "bainesface", body: "I loved this game too!" })
      .then(({ body }) => {
        expect(body.review_id).toBe(1);
        expect(body.author).toBe("bainesface");
        expect(body.body).toBe("I loved this game too!");
      });
  });
  test("201: POST - should ignore other additional properties that are passed", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({
        username: "bainesface",
        body: "I loved this game too!",
        extraProp: "extra things",
      })
      .then(({ body }) => {
        expect(body.review_id).toBe(1);
        expect(body.author).toBe("bainesface");
        expect(body.body).toBe("I loved this game too!");
        expect(body).not.toHaveProperty("extraProp");
      });
  });
  test("400: POST - should respond with a status 400 when an invalid ID is passed", () => {
    return request(app)
      .post("/api/reviews/not-an-id/comments")
      .expect(400)
      .send({
        username: "bainesface",
        body: "I loved this game too!",
      })
      .then((response) => {
        expect(response.body.message).toBe("Invalid Request");
      });
  });
  test("404: POST - should respond with a status 404 when a non existent ID is passed", () => {
    return request(app)
      .post("/api/reviews/9999/comments")
      .expect(404)
      .send({
        username: "bainesface",
        body: "I loved this game too!",
      })
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
  test("400: POST - should respond with a status 400 when missing required fields, e.g. no username or body properties passed", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(400)
      .send({}) //can have one or none
      .then((response) => {
        expect(response.body.message).toBe("Invalid Request");
      });
  });
  test("404: POST - should respond with a status 404 when username does not exist", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(404)
      .send({
        username: "bananas",
        body: "Wooooooo bananas",
      })
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
});
////TASK 8
describe("PATCH /api/reviews/:review_id", () => {
  test("200: PATCH - should respond with a status 200 and an updated review with increased votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
      .send({ inc_votes: 100 })
      .then((result) => {
        expect(result.body.review_id).toBe(1);
        expect(result.body.title).toBe("Agricola");
        expect(result.body.designer).toBe("Uwe Rosenberg");
        expect(result.body.owner).toBe("mallionaire");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(result.body.review_body).toBe("Farmyard fun!");
        expect(result.body.category).toBe("euro game");
        expect(result.body.created_at).toBe("2021-01-18T10:00:20.514Z");
        expect(result.body.votes).toBe(101);
      });
  });
  test("200: PATCH should return status code 200 and update article votes to specified amount decremented", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
      .send({ inc_votes: -1 })
      .then((result) => {
        expect(result.body.review_id).toBe(1);
        expect(result.body.title).toBe("Agricola");
        expect(result.body.designer).toBe("Uwe Rosenberg");
        expect(result.body.owner).toBe("mallionaire");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(result.body.review_body).toBe("Farmyard fun!");
        expect(result.body.category).toBe("euro game");
        expect(result.body.created_at).toBe("2021-01-18T10:00:20.514Z");
        expect(result.body.votes).toBe(0);
      });
  });
  test("400: PATCH - should respond with a status 400 when an invalid ID is passed", () => {
    return request(app)
      .patch("/api/reviews/not-an-id")
      .expect(400)
      .send({ inc_votes: 100 })
      .then((result) => {
        expect(result.body.message).toBe("Invalid Request");
      });
  });
  test("404: PATCH - should respond with a status 404 when a non existent ID is passed", () => {
    return request(app)
      .patch("/api/reviews/9999")
      .expect(404)
      .send({ inc_votes: 100 })
      .then((result) => {
        expect(result.body.message).toBe("Not Found");
      });
  });
  test("400: PATCH - should respond with a status 400 when incorrect body id passed", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(400)
      .send({ inc_votes: "Wooooo bananas" })
      .then((result) => {
        expect(result.body.message).toBe("Invalid Request");
      });
  });
});
////TASK 9
describe("GET /api/users", () => {
  test("200: GET - should respond with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
////TASK 10
describe("GET /api/reviews QUERY", () => {
  test("200: GET -responds with an array of reviews with specified category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(1);
      });
  });
  test("200: GET- responds with an array of reviews in specified sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(10);
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200: GET- responds with an array of reviews in specified order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("200: GET- responds with an array of reviews with a default order_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200: GET- responds with an array of reviews with a default sort_by", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  //Status 400. invalid order query, e.g. ?order=bananas
  test("400: GET - should respond with a 400 when passed an invalid order_by is given", () => {
    return request(app)
      .get("/api/reviews?order_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Request");
      });
  });
  test("400: GET - should respond with a 400 when passed an invalid sort_by", () => {
    return request(app)
      .get("/api/reviews?sort_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Request");
      });
  });
  test("should respond with a 404 when passed a non-existent category", () => {
    return request(app)
      .get("/api/reviews?category=bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});
////TASK 11 COMMENT COUNT
describe("200: GET /api/reviews/:review_id", () => {
  test("responds with a review object with comment_count included", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: "3",
        });
      });
  });
  test("400: GET- responds with message for invalid review_id", () => {
    return request(app)
      .get("/api/reviews/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Request");
      });
  });
  test("404: GET - responds with a message for a valid but non existent id", () => {
    return request(app)
      .get("/api/reviews/9000000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});
////TASK 12
describe("DELETE /api/comments/:comment_id", () => {
  test("204: DELETE - should respond with a status 204 and no content", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("404: DELETE - should respond with a 404 if the comment ID does not exist", () => {
    return request(app).delete("/api/comments/9999").expect(404);
  });
  test("400: DELETE - should respond with a status 400 if the comment ID is invalid", () => {
    return request(app).delete("/api/comments/not-an-id").expect(400);
  });
});
/////TASK 17
describe("GET /api/users/:username", () => {
  test("200: GET - should respond with a user object for a specific user", () => {
    const username = "mallionaire";
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toBeInstanceOf(Object);
        expect(body.user).toMatchObject({
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});
////TASK 18
describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH - should respond with a status 200 and update the votes on a comment given the comments comment_id", () => {
    const voteObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .expect(200)
      .send(voteObj)
      .then(({ body }) => {
        expect(body.votes).toBe(17);
      });
  });
});
////TASK 19
describe("POST /api/reviews", () => {
  test("201: POST - should respond with a 201 and an object with properties of review added", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "mallionaire",
        title: "Terraforming Mars",
        review_body: "My favourite game!",
        designer: "Jacob Fryxelius",
        category: "euro game",
        review_img_url:
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.owner).toBe("mallionaire");
        expect(response.body.title).toBe("Terraforming Mars");
        expect(response.body.review_body).toBe("My favourite game!");
        expect(response.body.designer).toBe("Jacob Fryxelius");
        expect(response.body.category).toBe("euro game");
      });
  });
});
//TASK 20
describe("GET /api/reviews PAGINATION", () => {
  test("should respond with a status 200 and an array of reviews limited to the length of the limit on page 1", () => {
    return request(app)
      .get("/api/reviews?p=1&limit=10")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(10);
      });
  });
});
test("should respond with a status 200 and an array of reviews limited to the length of the limit on page 2", () => {
  return request(app)
    .get("/api/reviews?p=2&limit=10")
    .expect(200)
    .then(({ body }) => {
      expect(body.reviews).toHaveLength(3);
    });
});
// test("should return 400 when given an invalid page number", () => {
//   return request(app)
//     .get("/api/reviews?p=bananas")
//     .expect(400)
//     .then(({ body }) => {
//       expect(body.msg).toBe("Bad request");
//     });
// });
// test("should return page 1 with with articles when given a category", () => {
//   return request(app)
//     .get("/api/reviews?p=1&limit=1&category=dexterity")
//     .expect(200)
//     .then(({ body }) => {
//       expect(body.reviews).toHaveLength(1);
//     });
// });

// test("should respond with a status 200 and an array of articles limited to the length of the limit on page 2", () => {
//   return request(app)
//     .get("/api/reviews?p=2&limit=10")
//     .expect(200)
//     .then(({ body }) => {
//       expect(body.reviews).toHaveLength(3);
//     });
// });
// test("should return the total count", () => {
//   return request(app)
//     .get("/api/reviews?p=1")
//     .expect(200)
//     .then(({ body }) => {
//       body.reviews.forEach((review) => {
//         expect(review.total_count).toBe(1);
//       });
//     });
// });
