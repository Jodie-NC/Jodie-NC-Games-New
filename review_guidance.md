Jump to: [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

# General Notes

#### General

- look out for stray `console.log()`s which should be removed.
- any commented out code should be removed.
- any unused `require` variables should be removed.
- any code that does not relate to the ticket should not be included in the pull request. This may include:
  - code within a file that represents corrections from the previous ticket.
  - code which should not yet be included as it will not be used until we get to a later ticket.
  - files that have been modified but should not have been added eg when prettier formats one of the data files.
- function names should be semantic and a naming should be consistent eg `getArticles`, `patchArticleById`, `selectArticles`, `updateArticleById`.

#### Testing

- presence of `.only` requires rejection of the pull request. Do not review the code and ask for another pull request to be submitted.
- look out for assertions which explicitly check something that is implicitly checked in a subsequent assertion. eg checking if something is an `Array` and then using `.forEach` in the next assertion. The first check is unnecessary.
- test descriptions should be clear and match any assertions made.

#### Controllers

- should include a catch block.
- where present, destructuring should be applied consistently.
- controllers should not query the database directly (although the can invoke more than one model).
- data should always be returned inside an object and on an appropriate key.

#### Models

- should return un-nested data to the controller ie there should be no further destructuring necessary in the controller.
- look out for multiple database requests where it would be possible to achieve the same goal with a single request.

#### Error handling

- errors should always provide a response body with a meaningful message, not just a status code.

#### /api

- should be updated for every endpoint students complete
- the ticket for this endpoint should include a test - for subsequent endpoints, the `endpoints.json` should have been amended appropriately

Jump to: [Games](#nc-games-review-guide)

# NC News Review Guide

[`CORE: GET /api/topics`](#3-get-apitopics)

[`CORE: GET /api`](#3-5-get-api)

[`CORE: GET /api/articles/:article_id`](#4-get-apiarticlesarticle_id)

[`CORE: GET /api/articles`](#5-get-apiarticles)

[`CORE: GET /api/articles/:article_id/comments`](#6-get-apiarticlesarticle_idcomments)

[`CORE: POST /api/articles/:article_id/comments`](#7-post-apiarticlesarticle_idcomments)

[`CORE: PATCH /api/articles/:article_id`](#8-patch-apiarticlesarticle_id)

[`CORE: DELETE /api/comments/:comment_id`](#9-delete-apicommentscomment_id)

[`CORE: GET /api/users`](#10-get-apiusers)

[`CORE: GET /api/articles (topic query)`](#11-get-apiarticles-queries)

[`CORE: GET /api/articles/:article_id (comment count)`](#12-get-apiarticlesarticle_id-comment-count)

## 3. `GET /api/topics`

> Responds with:
>
> - an array of topic objects, each of which should have the following properties:
>   - slug
>   - description
> - As this is the first endpoint you will need to set up your testing suite.
>   Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making _any_ type of request to your api. The errors that you identify should be fully tested for.
>
> Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.

#### Testing

- General
  - should include seeding before each test.
- Status 200, array of topic objects
  - should check length of array if asserting inside a forEach.
- Status 404 Invalid path
  - this should only be included if the student has used a custom 404 handler in their app.
  - if included it should not be in the describe block for this endpoint but can be included elsewhere.
  - it is acceptable to rely on the default express 404 error handling but this should _not_ be tested for.
- 500 error handling
  - it is acceptable (but not compulsory) for the student to include a 500 error handler in their middleware. They do not need to test for this.

#### App

- should not include `app.use(express.json())`.
- should not include `app.listen()` in `app.js` - this should be extracted to `listen.js` as `supertest` will attach it's own listener.

#### Controller

- should include a `catch` block
- should return the data on an appropriate key eg `topics`

#### Error handling middleware

- a path to catch the 404 should be included.
- it would be appropriate to include a 500 error handler at this stage.
- there should be no other error handling middleware ie we should avoid adding boilerplate code that is not required by the testing.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 3-5. `GET /api`

> Responds with:
>
> - JSON describing all the available endpoints on your API, see the `endpoints.json` for an (incomplete) example that you could build on, or create your own from scratch!

#### Testing

- Status 200, JSON describing all the available endpoints
- The test can simply require in the same JSON file and assert it is sent as a response

#### App

- The information in the `endpoints.json` file should be served up by an endpoint. Occasionally student may create the file but neglect to create the endpoint.

#### Controller

- The controller may use fs to read the file but it is also acceptable to require in the `endpoints.json` file.

#### Model

- It's fine to create a model that deals with reading the file but isn't necessary.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 4. `GET /api/articles/:article_id`

> Responds with:
>
> - an article object, which should have the following properties:
>
>   - `author` which is the `username` from the users table
>   - `title`
>   - `article_id`
>   - `body`
>   - `article_img_url`
>   - `topic`
>   - `created_at`
>   - `votes`

#### Testing

- Status 200, single article object
  - the specific article_id should be checked for rather than `expect.any(Number)`.
  - to allow for later extension of the endpoint, the test should use a flexible matcher eg `expect.objectContaining` or `.toMatchObject`.
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999

#### App

- should not include `app.use(express.json())`

#### Controller

- should include a `catch` block.
- should return the data on an appropriate key eg `article`
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- should make use of a parameterized query for `article_id` to protect against SQL injection.
- author is a column in the articles table so there is no requirement to `JOIN` tables.
- a psql error will be thrown if `article_id` is not a number.
- a custom error is required to handle the `404`.

#### Error handling middleware

- the error handlers should be split by functionality (eg `handleCustomErrors`, `handlePsqlErrors`)
- check the conditions in the error handlers allow the next error handler to be reached. For example, a condition of `if (err)` would catch all errors and the `else` block would never invoke `next`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 5. `GET /api/articles`

> Responds with:
>
> - an `articles` array of article objects, each of which should have the following properties:
>
>   - `author` which is the `username` from the users table
>   - `title`
>   - `article_id`
>   - `topic`
>   - `article_img_url`
>   - `created_at`
>   - `votes`
>   - `comment_count` which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
>
> - the articles should be sorted by date in descending order.

#### Testing

- Status 200, array of article objects (including `comment_count`, excluding `body`).
- Status 200, default sort & order: `created_at`, `desc`
  - should check the sort order in some way eg `jest-sorted` library.
  - should check length of array if asserting inside a forEach.

#### App

- should not include `app.use(express.json())`

#### Controller

- should return the data on an appropriate key eg `articles`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 6. `GET /api/articles/:article_id/comments`

> Responds with:
>
> - an array of comments for the given `article_id` of which each comment should have the following properties:
>   - `comment_id`
>   - `votes`
>   - `created_at`
>   - `author` which is the `username` from the users table
>   - `body`
>   - comments should be served with the most recent comments first

#### Testing

- Status 200, array of comment objects for the specified article
  - they should also check the order of the comments in some way
  - should check length of array if asserting inside a forEach.
- Status 200, valid ID, but has no comments responds with an empty array of comments
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999

#### App

- should not include `app.use(express.json())`

#### Controller

- should return the data on an appropriate key eg `comments`

#### Model

- they will need to check the reason for the query returning empty rows:
  - article exists but has no comments.
  - article does not exist.
- they will need to check whether the article exists iin order to determine this.

Note that there are different ways to approach checking the existence of an article. Some
students may use a utility function that checks the article exists then use its result to
reject the Promise or continue. Others may reuse their fetchArticleByID function in a
chain of promises or a Promise.all before returning the comments only. Both approaches are valid.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 7. `POST /api/articles/:article_id/comments`

> Request body accepts:
>
> - an object with the following properties:
>   - `username`
>   - `body`
>
> Responds with:
>
> - the posted comment

#### Testing

- Status 201, created comment object
- Status 201, ignores unnecessary properties
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999
- Status 400, missing required field(s), e.g. no username or body properties
- Status 404, username does not exist

#### Controller

- should return the data on an appropriate key eg `comment`
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- `author` in the `comments` table is a foreign key which relates to `username` in the `users` table. A psql error will be thrown if this is violated. It is not necessary to separately check if the user exists.
- `article_id` is also a foreign key so again, a separate check that the article exists should not be necessary as a psql error will be thrown.
- a psql error will also be thrown if article_id is not a number.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 8. `PATCH /api/articles/:article_id`

> Request body accepts:
>
> - an object in the form `{ inc_votes: newVote }`
>
>   - `newVote` will indicate how much the `votes` property in the database should be updated by
>     e.g.
>
>     `{ inc_votes : 1 }` would increment the current article's vote property by 1
>
>     `{ inc_votes : -100 }` would decrement the current article's vote property by 100
>
> Responds with:
>
> - the updated article

#### Testing

- Status 200, updated single article object.
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999
- Status 400, incorrect body, e.g. `inc_votes` property is not a number

- (Optional) Status 200, if `inc_votes` is missing, should not update article and return original single article object (this may be included as a 400 but that could make for a brittle test suite)

#### Controller

- should include a `catch` block.
- should return the data on an appropriate key eg `article`.
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- a psql error will be thrown if `article_id` is not a number.
- a custom error is required to handle the `404`.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 9. `DELETE /api/comments/:comment_id`

> Should:
>
> - delete the given comment by comment_id
>
> Responds with:
>
> - status 204 and no content

#### Testing

- Status 204, deletes comment from database
- Status 404, non existent ID, e.g 999
- Status 400, invalid ID, e.g "not-an-id"

#### Controller

- express will not send back a response body so one should not be included in the code. `res.sendStatus(204)` or `res.status(204).send()` would be acceptable.

#### Model

- a non-existent comment will need to be handled with a custom error handler. The student may choose to check if the comment exists but this can also be inferred from the db returning empty rows.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 10. `GET /api/users`

> Responds with:
>
> - an array of objects, each object should have the following properties:
>
>   - `username`
>   - `name`
>   - `avatar_url`

#### Testing

- Status 200, responds with array of user objects
  - should check length of array if asserting inside a forEach.

#### Controller

- should include a `catch` block.
- should return data on an appropriate key eg `users`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 11. `GET /api/articles (topic query)`

> The end point should also accept the following query:
>
> - `topic`, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.

#### Testing

- Status 200, accepts `topic` query, e.g. `?topic=coding`.
  - should check that all returned objects have the queried topic.
- Status 200, valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`.
- Status 404, non-existent `topic` query, e.g. `?topic=bananas`.

#### Controller

- There should be a way of checking if the topic exists. Multiple models or a single model handling this is fine.
- The existence of a topic must come from the db, not to be hard coded.

#### Model

- The filtering should be handled by the db and not done manually.
- A single re-useable select model that handles the addition of the WHERE is preferred over multiple models. (DRY)
- Check for SQL injection, parameters, pg-format or manual validation are all acceptable.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 12. `GET /api/articles/:article_id (comment count)`

> An article response object should also now include:
>
> - comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

#### Testing

- Status 200, single article object (including `comment_count`)
  - this should be a new test rather than a refactor of a previous test - this may not be possible if the previous test was too brittle.

#### Model

- this should be achieved with a single SQL query

- [General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

---

# NC Games Review Guide

[`3. GET /api/categories`](#3-get-apicategories)

[`3-5. GET /api`](#3-5-get-api-1)

[`4. GET /api/reviews/:review_id`](#4-get-apireviewsreview_id)

[`5. GET /api/reviews`](#5-get-apireviews)

[`6. GET /api/reviews/:review_id/comments`](#6-get-apireviewsreview_idcomments)

[`7. POST /api/reviews/:review_id/comments`](#7-post-apireviewsreview_idcomments)

[`8. PATCH /api/reviews/:review_id`](#8-patch-apireviewsreview_id)

[`9. DELETE /api/comments/:comment_id`](#9-delete-apicommentscomment_id-1)

[`10. GET /api/users`](#10-get-apiusers-1)

[`11. GET /api/reviews (queries)`](#11-get-apireviews-queries)

[`12. GET /api/reviews/:review_id (comment count)`](#12-get-apireviewsreview_id-comment-count)

## 3. `GET /api/categories`

> Responds with:
>
> - an array of category objects, each of which should have the following properties:
>   - slug
>   - description
> - As this is the first endpoint you will need to set up your testing suite.

#### Testing

- General
  - should include seeding before each test.
- Status 200, array of category objects
  - should check length of array if asserting inside a forEach.
- Status 404 Invalid path
  - this should only be included if the student has used a custom 404 handler in their app.
  - if included it should not be in the describe block for this endpoint but can be included elsewhere.
  - it is acceptable to rely on the default express 404 error handling but this should _not_ be tested for.
- 500 error handling
  - it is acceptable (but not compulsory) for the student to include a 500 error handler in their middleware. They do not need to test for this.

#### App

- should not include `app.use(express.json())`.
- should not include `app.listen()` in `app.js` - this should be extracted to `listen.js` as `supertest` will attach it's own listener.

#### Controller

- should include a `catch` block
- should return the data on an appropriate key eg `categories`

#### Error handling middleware

- a path to catch the 404 should be included.
- it would be appropriate to include a 500 error handler at this stage.
- there should be no other error handling middleware ie we should avoid adding boilerplate code that is not required by the testing.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 3-5. `GET /api`

> Responds with:
>
> - JSON describing all the available endpoints on your API, see the `endpoints.json` for an (incomplete) example that you could build on, or create your own from scratch!

#### Testing

- Status 200, JSON describing all the available endpoints
- The test can simply require in the same JSON file and assert it is sent as a response

#### App

- The information in the `endpoints.json` file should be served up by an endpoint. Occasionally student may create the file but neglect to create the endpoint.

#### Controller

- The controller may use fs to read the file but it is also acceptable to require in the `endpoints.json` file.

#### Model

- There should not be a model for this endpoint.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 4. `GET /api/reviews/:review_id`

> Responds with:
>
> - an `review` object, which should have the following properties:
>
>   - `review_id` which is the primary key
>   - `title`
>   - `review_body`
>   - `designer`
>   - `review_img_url`
>   - `votes`
>   - `category` field which references the slug in the categories table
>   - `owner` field that references a user's primary key (username)
>   - `created_at`

#### Testing

- Status 200, single review object
  - the specific review_id should be checked for rather than `expect.any(Number)`.
  - to allow for later extension of the endpoint, the test should use a flexible matcher eg `expect.objectContaining` or `.toMatchObject`.
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999

#### App

- should not include `app.use(express.json())`

#### Controller

- should include a `catch` block.
- should return the data on an appropriate key eg `review`
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- should make use of a parameterized query for `review_id` to protect against SQL injection.
- author is a column in the reviews table so there is no requirement to `JOIN` tables.
- a psql error will be thrown if `review_id` is not a number.
- a custom error is required to handle the `404`.

#### Error handling middleware

- the error handlers should be split by functionality (eg `handleCustomErrors`, `handlePsqlErrors`)
- check the conditions in the error handlers allow the next error handler to be reached. For example, a condition of `if (err)` would catch all errors and the `else` block would never invoke `next`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 5. `GET /api/reviews`

> Responds with:
>
> - an `reviews` array of review objects, each of which should have the following properties:
>
>   - `owner` which is the username from the users table
>   - `title`
>   - `review_id`
>   - `category`
>   - `review_img_url`
>   - `created_at`
>   - `votes`
>   - `designer`
>   - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this.
>
> - the reviews should be sorted by date in descending order.
>
> Queries
>
> The end point should also accept the following query:

#### Testing

- Status 200, array of article objects (including `comment_count`, excluding `body`).
- Status 200, default sort & order: `created_at`, `desc`
  - should check the sort order in some way eg `jest-sorted` library.
  - should check length of array if asserting inside a forEach.

#### App

- should not include `app.use(express.json())`

#### Controller

- - should return the data on an appropriate key eg `articles`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 6. `GET /api/reviews/:review_id/comments`

> Responds with:
>
> - an array of comments for the given `review_id` of which each comment should have the following properties:
>   - `comment_id`
>   - `votes`
>   - `created_at`
>   - `author` which is the `username` from the users table
>   - `body`
> - comments should be served with the most recent comments first

#### Testing

- Status 200, array of comment objects for the specified review
  - they should also check the order of the comments in some way
  - should check length of array if asserting inside a forEach.
- Status 200, valid ID, but has no comments responds with an empty array of comments
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999

#### App

- should not include `app.use(express.json())`

#### Controller

- should return the data on an appropriate key eg `comments`
- this should include a check that the review exists by using a Promise.all in the controller.

#### Model

- they will need to check the reason for the query returning empty rows:
  - review exists but has no comments.
  - review does not exist.
- they will need to check whether the review exists in order to determine this.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 7. `POST /api/reviews/:review_id/comments`

> Request body accepts:
>
> - an object with the following properties:
>   - `username`
>   - `body`
>
> Responds with:
>
> - the posted comment

#### Testing

- Status 201, created comment object
- Status 201, ignores unnecessary properties
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999
- Status 400, missing required field(s), e.g. no username or body properties
- Status 404, username does not exist

#### Controller

- should return the data on an appropriate key eg `comment`
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- `author` in the `comments` table is a foreign key which relates to `username` in the `users` table. A psql error will be thrown if this is violated. It is not necessary to separately check if the user exists.
- `review_id` is also a foreign key so again, a separate check that the review exists should not be necessary as a psql error will be thrown.
- a psql error will also be thrown if review_id is not a number.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 8. `PATCH /api/reviews/:review_id`

> Request body accepts:
>
> - an object in the form `{ inc_votes: newVote }`
>
>   - `newVote` will indicate how much the `votes` property in the database should be updated by
>     e.g.
>
>     `{ inc_votes : 1 }` would increment the current review's vote property by 1
>
>     `{ inc_votes : -100 }` would decrement the current review's vote property by 100
>
> Responds with:
>
> - the updated review

#### Testing

- Status 200, updated single review object.
- Status 400, invalid ID, e.g. string of "not-an-id"
- Status 404, non existent ID, e.g. 0 or 9999
- Status 400, incorrect body, e.g. `inc_votes` property is not a number

- (Optional) Status 200, if `inc_votes` is missing, should not update article and return original single article object (this may be included as a 400 but that could make for a brittle test suite) If you were to patch other properties in the future, then inc_votes might not be included in your object, so responding with a 400 makes your test brittle.

#### Controller

- should include a `catch` block.
- should return the data on an appropriate key eg `review`.
- the key should hold an object, not an array, as we are only sending back one thing.

#### Model

- a psql error will be thrown if `review_id` is not a number.
- a custom error is required to handle the `404`.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 9. `DELETE /api/comments/:comment_id`

> Should:
>
> - delete the given comment by `comment_id`
>
> Responds with:
>
> - status 204 and no content

#### Testing

- Status 204, deletes comment from database
- Status 404, non existent ID, e.g 999
- Status 400, invalid ID, e.g "not-an-id"

#### Controller

- express will not send back a response body so one should not be included in the code. `res.sendStatus(204)` or `res.status(204).send()` would be acceptable.

#### Model

- a non-existent comment will need to be handled with a custom error handler. The student may choose to check if the comment exists but this can also be inferred from the db returning empty rows.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 10. `GET /api/users`

> Responds with:
>
> - an array of objects, each object should have the following properties:
>
>   - `username`
>   - `name`
>   - `avatar_url`

#### Testing

- Status 200, responds with array of user objects
  - should check length of array if asserting inside a forEach.

#### Controller

- should include a `catch` block.
- should return data on an appropriate key eg `users`

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 11. `GET /api/reviews (queries)`

> The end point should also accept the following queries:
>
> - `category`, which selects the reviews by the category value specified in the query. If the query is omitted the endpoint should respond with all reviews.
> - `sort_by`, which sorts the reviews by any valid column (defaults to date)
> - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

#### Testing

- Status 200, accepts `category` query, e.g. `?category=dexterity`.
  - should check that all returned objects have the queried category.
- Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
- Status 200, accepts `order` query, e.g. `?order=desc`
- Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
- Status 400. invalid `order` query, e.g. `?order=bananas`
- Status 200, valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`.
  Status 404, non-existent `category` query, e.g. `?category=bananas`.

#### Model

- `sort_by` and `order` should have default values if undefined.
- there should be a way of checking that the `sort_by` query and `order` query are valid.
- if `sort_by` or `order` are invalid, a custom error should occur - the query should not be passed to the database as we risk SQL injection.
- to keep the code DRY, the query string should be built up dynamically according to the presence of the query. ie there shouldn't be multiple complete query strings within the code with one being conditionally selected according to the queries.

[General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)

## 12. `GET /api/reviews/:review_id (comment count)`

> An review response object should also now include:
>
> - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this.

#### Testing

- Status 200, single review object (including `comment_count`)
  - this should be a new test rather than a refactor of a previous test - this may not be possible if the previous test was too brittle.

#### Model

- this should be achieved with a single SQL query

- [General](#general-notes) | [News](#nc-news-review-guide) | [Games](#nc-games-review-guide)
