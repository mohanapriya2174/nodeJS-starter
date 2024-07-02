const express = require("express");
const mysql = require("mysql");
const app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test_db",
  port: "3306",
});
module.exports = connection;
// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("connected");
//   }
// });
// connection.query("CREATE TABLE STAFF(id INT(5), name VARCHAR(10))");
// const port = process.env.PORT || 5000;
// app.listen(port);
// console.log("listining" + port);

// app.listen(5000, () => {
//   console.log("listning");
// });
