const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/controller");

categoriesRouter.get("/", getCategories);
module.exports = categoriesRouter;
