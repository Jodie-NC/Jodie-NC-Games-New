const cors = require("cors");
const express = require("express");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handle400Errors,
  handle404Errors,
  handle500Error,
} = require("./controllers/error-controller");

const apiRouter = require("./routers/api-router");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle400Errors);
app.use(handle404Errors);
app.use(handle500Error);

// app.all("/*", (err) => {
//   console.log(err, "ERRRRRORRRR");
// });

module.exports = { app };

// const {
//   getCategories,
//   getApi,
//   getReviewById,
//   getCommentsByReviewId,
//   getReviews,
//   postNewComment,
//   updateVotesById,
//   deleteComment,
//   getUsers,
// } = require("./controllers/controller");

// app.use(express.json());
// ///TASK 3
// app.get("/api", getApi);
// ///TASK 3.5
// app.get("/api/categories", getCategories);
// ///TASK 4 ////TASK 12
// app.get("/api/reviews/:review_id", getReviewById);
// ///TASK 5 & TASK 11
// app.get("/api/reviews", getReviews);
// ///TASK 6
// app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
// ///TASK 7
// app.post("/api/reviews/:review_id/comments", postNewComment);
// ///TASK 8
// app.patch("/api/reviews/:review_id", updateVotesById);
// ///TASK 9
// app.delete("/api/comments/:comment_id", deleteComment);
// ///TASK 10
// app.get("/api/users", getUsers);
