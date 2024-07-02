const { refreshTokenSecret } = require("../config/jwt");
const connection = require("../src/model");
const mysql = require("mysql");
// const { insertUsers } = require("./controller");
// const users = require("../src/model");
// const { insertUsers, updateUsers } = require("./controller");

let updateUsers = (updates, id) => {
  return new Promise((resolve, reject) => {
    var update;
    if (updates.password) {
      update = updates.password;
      var query = `UPDATE users SET password=? WHERE id=?`;
    } else if (updates.name) {
      update = updates.name;
      query = `UPDATE users SET name=? WHERE id=?`;
    } else if (updates.email) {
      update = updates.email;
      query = `UPDATE users SET email=? WHERE id=?`;
    }

    connection.query(query, [update, id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

let deleteUser = (name) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE name=?";
    connection.query(query, [name], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// const insertUsers = async (values) => {
//   return new Promise((resolve, reject) => {
//     const query = " INSERT INTO STUDENT(id,name) VALUES ?";
//     connection.query(query, [values], (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

const insertUsers = async (values) => {
  return new Promise((resolve, reject) => {
    const query = " INSERT INTO STUDENT(id,name) VALUES(?,?)";
    let id = values.id;
    let name = values.name;
    connection.query(query, [id, name], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
// const storeRefreshToken = async (refreshToken, id) => {
//   return new Promise((resolve, reject) => {
//     const query = "INSERT INTO TABLE tefreshToken VALUES(?,?) ";
//     connection.query(query, [refreshToken, id]);
//   });
// };

// const findRT = async (refreshToken, id) => {
//   const query = "SELECT * FROM users WHERE refreshToken=? and id=?";
//   connection.query(query, [refreshToken, id]);
// };

let getAllUsers = async (id) => {
  // idIn = Object.values(id)[0];
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id=?`;
    connection.query(query, id, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
      console.log(result);
    });
  });
};

const registerUser = async (name, email, password, role) => {
  return new Promise((resolve, reject) => {
    const query =
      " INSERT INTO USERS(name,email,password,role) VALUES(?,?,?,?)";
    connection.query(query, [name, email, password, role], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email=?";
    // const search_query = mysql.format(query, [email]);
    connection.query(query, [email, password], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAllUsers,
  insertUsers,
  updateUsers,
  deleteUser,
  registerUser,
  loginUser,
  // storeRefreshToken,
};
