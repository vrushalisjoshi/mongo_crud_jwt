const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require("./user.controller");

// Retrieve all users
router.get("/", checkToken, getUsers);
// Create a new user
router.post("/", checkToken, createUser);
// Retrieve a single user with id
router.get("/:id", checkToken, getUserById);
// Update a user with id
router.put("/:id", checkToken, updateUser);
// Delete a user with id
router.delete("/:id", checkToken, deleteUser);
//login
router.post("/login", login);

module.exports = router;
