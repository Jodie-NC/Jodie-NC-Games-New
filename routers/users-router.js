const usersRouter = require("express").Router();
const { getUsers, getUserByUserName } = require("../controllers/controller");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUserName);

module.exports = usersRouter;
