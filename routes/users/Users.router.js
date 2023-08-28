const {createUser, getUsers, getUserById,updateUser,deleteUser } = require("../../Controller/users/users.controller.js");
const router = require("express").Router();

router.post("/create", createUser);
// GET ALL USERS
router.get("/", getUsers);
// GET USER BY ID
router.get("/:id", getUserById);
// UPDATE USER
router.put("/update/:id", updateUser);

// DELETE USER
router.delete("/delete/:id", deleteUser);

module.exports = router;
