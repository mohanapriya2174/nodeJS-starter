const express = require("express");
const userRoutes = require("./src/routes");
// const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandeler");
const app = express();

dotenv.config();
app.use(express.json());
// app.use(bodyParser.json());
app.use("/", userRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
