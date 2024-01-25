const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postNewComment,
  updateVotesById,
  postNewReview,
  deleteReview,
} = require("../controllers/controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.post("/", postNewReview);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postNewComment);
reviewsRouter.patch("/:review_id", updateVotesById);
reviewsRouter.delete("/:review_id", deleteReview);

module.exports = reviewsRouter;
