const db = require("../db/connection");


exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (id) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id
      `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${id}`,
        });
      }
      return rows[0];
    });
};

exports.fetchReviews = (
  sort_by = "created_at",
  order_by = "DESC",
  category,
  limit = 10,
  p = 1
) => {
  let offset = 0;
  if (p > 1) {
    offset = limit * p - limit;
  }
  return db

    .query(`SELECT slug FROM categories`)
    .then((result) => {
      const categoryArr = result.rows;
      const categories = categoryArr.map((category) => {
        return category.slug;
      });
      return categories;
    })
    .then((validCategory) => {
      const validSortBy = ["created_at", "votes", "comment_count"];
      const validOrderBy = ["asc", "desc", "ASC", "DESC"];
      if (
        (sort_by && !validSortBy.includes(sort_by)) ||
        (order_by && !validOrderBy.includes(order_by)) ||
        !/[0-9]+/.test(limit) ||
        !/[0-9]+/.test(p)
      ) {
        return Promise.reject({
          status: 400,
          msg: "Invalid Request",
        });
      }
      if (category && !validCategory.includes(category)) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      let queryString =
        "SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id ";

      const selectedCategory = category;
      const queryInputs = [];
      if (selectedCategory) {
        queryInputs.push(selectedCategory);
        queryString += `WHERE reviews.category = $1`;
      }

      queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order_by} LIMIT ${limit} OFFSET ${offset};`;
      return db.query(queryString, queryInputs);
    })
    .then(({ rows }) => {
      const totalQuery = `SELECT COUNT(*) AS total_count 
        FROM reviews
        WHERE category = $1`;
      return db.query(totalQuery, [category]).then((total) => {
        const totalCount = parseInt(total.rows[0].total_count);
        return { rows: rows, total_count: totalCount };
      });
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.createComment = (username, body, reviewId) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING*;`,
      [reviewId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchVotesById = (inc_votes, reviewId) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`,
      [inc_votes, reviewId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No user found with username ${id}`,
        });
      }
      return rows[0];
    });
};

exports.patchCommentsById = (inc_votes, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`,
      [inc_votes, comment_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return response.rows[0];
    });
};

exports.createReview = (reviewBody) => {
  const { owner, title, review_body, designer, category, review_img_url } =
    reviewBody;
  return db
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category, review_img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [owner, title, review_body, designer, category, review_img_url]
    )
    .then((response) => {
      const newReview = response.rows[0];
      return db
        .query(
          `SELECT COUNT(comment_id)::INT AS comment_count FROM comments WHERE review_id = $1;`,
          [newReview.review_id]
        )
        .then(({ rows }) => {
          const commentCount = rows[0].comment_count;
          newReview.comment_count = commentCount;
          return newReview;
        });
    });
};

exports.createCategory = (newCategory) => {
  const { slug, description } = newCategory;
  return db
    .query(
      `INSERT INTO categories (slug, description)
      VALUES ($1, $2)
      RETURNING *;`,
      [slug, description]
    )
    .then((response) => {
      return response.rows[0];
    });
};


exports.deleteReviewById = (review_id) => {
  return db
    .query(`DELETE FROM reviews WHERE review_id = $1;`, [review_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
};
