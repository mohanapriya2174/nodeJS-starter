const mysql = require("mysql");
const dotenv = require("dotenv");
// const users = [{ id: 1, name: "John Doe" }];
// const database = require("../script");
dotenv.config();
var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  connectTimeout: 100000,
});
const dbConnection = connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
// module.exports = dbConnection;
module.exports = connection;
