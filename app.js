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

module.exports = { app };
