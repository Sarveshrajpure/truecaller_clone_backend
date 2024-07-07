const express = require("express");
const routes = require("./routes/index");
const sequelize = require("./config/database");
const { convertToApiError, handleError } = require("./middlewares/errorHandlingMiddleware");
const httpStatus = require("http-status");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

console.log(port);

// api route
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(httpStatus.OK).send({ message: "Welcome!" });
});

//API ERROR HANDLING
app.use(convertToApiError);
app.use((err, req, res, next) => {
  handleError(err, res);
});

const connectDb = async () => {
  console.log("Checking database connection...");
  await sequelize.authenticate();
  console.log("Database connection established!");
  try {
  } catch (err) {
    console.log("Database connection failed!", err);
    process.exit(1);
  }
};

(async () => {
  await connectDb();

  console.log(`Attempting to run server on port ${port}...`);
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
})();
