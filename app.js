const cors = require("cors");
const express = require("express");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle400Errors,
  handle404Errors,
} = require("./controllers/error-controller");

const app = express();

app.use(cors());

const {
  getCategories,
  getApi,
  getReviewById,
  getCommentsByReviewId,
  getReviews,
  getReviewComments,
  postNewComment,
  updateVotesById,
  deleteComment,
  getUsers,
} = require("./controllers/controller");

app.use(express.json());
///TASK 3
app.get("/api", getApi);
///TASK 3.5
app.get("/api/categories", getCategories);
///TASK 4 ////TASK 12
app.get("/api/reviews/:review_id", getReviewById);
//TASK 12
app.get("/api/reviews/:review_id", getCommentsByReviewId);
///TASK 5 & TASK 11
app.get("/api/reviews", getReviews);
///TASK 6
app.get("/api/reviews/:review_id/comments", getReviewComments);
///TASK 7
app.post("/api/reviews/:review_id/comments", postNewComment);
///TASK 8
app.patch("/api/reviews/:review_id", updateVotesById);
///TASK 9
app.delete("/api/comments/:comment_id", deleteComment);
///TASK 10
app.get("/api/users", getUsers);

///ERROR HANDLING MIDDLEWARE
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle400Errors);
app.use(handle404Errors);

module.exports = { app };
