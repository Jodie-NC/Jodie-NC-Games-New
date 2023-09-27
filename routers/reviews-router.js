const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postNewComment,
  updateVotesById,
  postNewReview,
} = require("../controllers/controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.post("/", postNewReview);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postNewComment);

reviewsRouter.patch("/:review_id", updateVotesById);
module.exports = reviewsRouter;
