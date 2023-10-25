const commentsRouter = require("express").Router();
const {
  postNewComment,
  deleteComment,
  patchCommentsById,
} = require("../controllers/controller");

commentsRouter.delete("/:comment_id", deleteComment);
commentsRouter.post("/:comment_id", postNewComment);
commentsRouter.patch("/:comment_id", patchCommentsById);

module.exports = commentsRouter;
