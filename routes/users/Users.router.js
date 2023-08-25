const {createUser, getUsers, getUserById } = require("../../Controller/users/users.controller.js");
const router = require("express").Router();

router.post("/create", createUser);
// GET ALL USERS
router.get("/", getUsers);
// GET USER BY ID
router.get("/:id", getUserById);

module.exports = router;
