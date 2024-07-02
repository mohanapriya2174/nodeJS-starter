const express = require("express");
const userController = require("../src/controller");

const router = express();

router.get("/users", userController.getUsers);

router.post("/insert", userController.insertUsers);

router.put(
  "/update",
  userController.ensureAuthenticated,
  userController.updateUsers
);

router.delete(
  "/delete",
  userController.ensureAuthenticated,
  userController.deleteUser
);

router.post("/api/auth/register", userController.register);

router.post("/api/auth/login", userController.loginUsers);

router.get("/home", userController.ensureAuthenticated, userController.newPage);

router.get(
  "/admin",
  userController.ensureAuthenticated,
  userController.authorize,
  userController.newPage
);

// router.post("/refresh", userController.refreshToken);

router.all("*", userController.unhandeledRouts);

module.exports = router;
