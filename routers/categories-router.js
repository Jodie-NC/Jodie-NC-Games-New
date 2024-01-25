const categoriesRouter = require("express").Router();
const { postCategory, getCategories } = require("../controllers/controller");

categoriesRouter.get("/", getCategories);
categoriesRouter.post("/", postCategory);

module.exports = categoriesRouter;
