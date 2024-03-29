exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Invalid Request" });
  } else {
    next(err);
  }
};
exports.handle400Errors = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: "Invalid Request" });
  } else next(err);
};
exports.handle404Errors = (err, req, res, next) => {
  if (err.status === 404 || err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  } else next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: `${err.message}` });
  } else {
    next(err);
  }
};
exports.handle500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
};
