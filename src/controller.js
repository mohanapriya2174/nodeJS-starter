const { customeError } = require("../middleware/errorHandeler");
const userService = require("../src/service");
const { customError } = require("../middleware/customeError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usejwt = require("../config/jwt");
const { json } = require("express");
// const { use } = require("./routes");
exports.getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};
// exports.insertUsers = async (req, res) => {
//   const datas = req.body.datas;
//   const id = req.body.id;
//   const name = req.body.name;
//   console.log(datas);
//   const values = datas.map((data) => [data.id, data.name]);
//   console.log(values);
//   const users = await userService.insertUsers(values);
//   res.status(201).send(users);
// };

exports.insertUsers = async (req, res, next) => {
  try {
    const datas = req.body.datas;
    console.log(datas);
    if (datas) {
      const users = await datas.forEach((elements) => {
        userService.insertUsers(elements);
      });
      res.status(201).json({ message: "inserted successful" });
    } else {
      throw new Error("data not found");
    }
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};

exports.updateUsers = async (req, res, next) => {
  try {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const id = req.user.id;

    const updates = {};
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      updates.password = hashedPassword;
      const users = await userService.updateUsers(updates, id);
      res.status(201).json({ message: "updated successful" });
    } else if (name) {
      updates.name = name;
      const users = await userService.updateUsers(updates, id);
      res.status(201).json({ message: "updated successful" });
    } else if (email) {
      updates.email = email;
      const users = await userService.updateUsers(updates, id);
      res.status(201).json({ message: "updated successful" });
    } else {
      throw new Error("data not found");
    }
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (name && password) {
      const users = await userService.loginUser(email, password);
      if (users.length == 0) {
        return res
          .status(404)
          .json({ message: "emailId or password not valid" });
      } else {
        const hashedPassword = users[0].password;
        const passWord = await bcrypt.compare(password, hashedPassword);
        if (!passWord) {
          return res
            .status(401)
            .json({ message: "emailId or password is not valid" });
        } else {
          const deleted = await userService.deleteUser(name, password);
          res.status(200).json({ message: "Deleted Successful" });
        }
      }
    } else {
      throw new customError("Data not found");
    }
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    if (name || email || password) {
      const users = await userService.registerUser(
        name,
        email,
        hashedPassword,
        role
      );
      res.status(201).json({
        message: "Rejestered successful",
      });
    } else {
      throw new customError("please enter all the required values");
    }
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};
exports.loginUsers = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email || password) {
      const users = await userService.loginUser(email, password);
      // console.log(users[0].id);
      if (users.length == 0) {
        return res
          .status(404)
          .json({ message: "emailId or password not valid" });
      } else {
        const hashedPassword = users[0].password;
        const passWord = await bcrypt.compare(password, hashedPassword);
        if (!passWord) {
          return res
            .status(401)
            .json({ message: "emailId or password is not valid" });
        }

        const accessToken = jwt.sign(
          { id: users[0].id },
          usejwt.accessTokenSecret,
          { subject: "accessApi", expiresIn: "1d" }
        );

        //refresh token
        // const refreshToken = jwt.sign(
        //   { id: users[0].id },
        //   usejwt.refreshTokenSecret,
        //   { subject: "refreshToken", expiresIn: "1w" }
        // );

        // await userService.storeRefreshToken(refreshToken, users[0].id);

        res.status(201).json({
          id: users[0].id,
          name: users[0].name,
          accessToken: accessToken,
          // refreshToken: refreshToken,
        });
      }
    } else {
      throw new customError("please enter all the required values");
    }
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};

// exports.refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//       return res.status(401).json({
//         message: "refresh token not found",
//       });
//     }
//     const decodedRefressToken = jwt.verify(
//       refreshToken,
//       usejwt.refreshTokenSecret
//     );

//     const userRefreshToken = await userService.findRT(
//       refreshToken,
//       decodedRefressToken.id
//     );
//     if (!userRefreshToken) {
//       return res.status(401).json({
//         message: "refresh token not valid or found",
//       });
//     }
//   } catch (err) {
//     if (
//       err instanceof jwt.TokenExpiredError ||
//       err instanceof jwt.JsonWebTokenError
//     ) {
//       return res.status(401).json({
//         message: "refresh token not valid or found",
//       });
//     }
//     err.statusCode = 500;
//     return next(err);
//   }
// };

exports.newPage = async (req, res) => {
  const id = req.user.id;
  const users = await userService.getAllUsers(id);
  res.status(200).json({
    id: users[0].id,
    name: users[0].name,
    email: users[0].email,
  });
};

exports.authorize = async (req, res, next) => {
  const id = req.user.id;
  const users = await userService.getAllUsers(id);
  if (users[0].role !== "admin") {
    return res.status(403).json({
      message: `this user is not allowed to access  this route`,
    });
  }
  next();
};

exports.ensureAuthenticated = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.status(401), json({ message: "access token not found" });
  }
  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      usejwt.accessTokenSecret
    );
    req.user = { id: decodedAccessToken.id };
    next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
};

exports.unhandeledRouts = (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl}`);
  err.statusCode = 404;

  return next(err);
};
