const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  createComment,
  patchVotesById,
  deleteCommentById,
  fetchUsers,
  fetchUserByUsername,
  patchCommentsById,
  createReview,
} = require("../models/models");

const endpoints = require("../endpoints.json");
////TASK 3.5
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};
////TASK 3
exports.getCategories = (req, res, next) => {
  return fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 4 ///TASK 12
exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  // const review_id = Number(req.params.review_id);
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 5 AND TASK 11
exports.getReviews = (req, res, next) => {
  const { sort_by, order_by, category, limit } = req.query;
  const pageNum = req.query.p;
  fetchReviews(sort_by, order_by, category, limit, pageNum)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
}; //catch block is functionally redundant for ticket 5 - needs to be added for 11
////TASK 6
exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const reviewIdPromise = fetchReviewById(review_id);
  const commentsPromise = fetchCommentsByReviewId(review_id);

  Promise.all([reviewIdPromise, commentsPromise])
    .then(([promiseOne, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 7
exports.postNewComment = (req, res, next) => {
  const { username, body } = req.body;
  const { review_id } = req.params;
  if (!username || !body) {
    return res.status(400).send({ message: "Invalid Request" });
  }
  createComment(username, body, review_id)
    .then((createdComment) => {
      res.status(201).send(createdComment);
    })
    .catch(next);
};
////TASK 8
exports.updateVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchVotesById(inc_votes, review_id)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 9
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 10
exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 16
exports.getUserByUserName = (req, res, next) => {
  const { username } = req.params;
  return fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(err);
    });
};
////TASK 17
exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentsById(inc_votes, comment_id)
    .then((updatedVotes) => {
      res.status(200).send(updatedVotes);
    })
    .catch((err) => {
      console.log(err);
    });
};
////TASK 18
exports.postNewReview = (req, res, next) => {
  const reviewBody = req.body;
  createReview(reviewBody)
    .then((createdReview) => {
      res.status(201).send(createdReview);
    })
    .catch(next);
};
