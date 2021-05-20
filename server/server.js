const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const ticketController = require("./controllers/ticketController");
// const cors = require('cors');

const PORT = 3000;
const app = express();

const signupRouter = require("./routes/signupRouter");
const loginRouter = require('./routes/loginRouter');
const ticketRouter = require("./routes/ticketRouter");
const userController = require("./controllers/userController");
// const sessionController = require('./controllers/sessionController');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initial Page Request
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../index.html"));
});

app.use(express.static("client"));

app.get("/categories", ticketController.getCategories, (req, res) => {
  console.log("res.locals.categories", res.locals.categories);
  res.status(200).send(res.locals.categories);
});
/**
 * define route handlers
 */
app.use("/signup", signupRouter);
app.use('/login', loginRouter);
app.use("/ticket", ticketRouter);

app.get("/cohort", userController.getCohorts, (req, res) => {
  res.status(200).send(res.locals.allCohorts);
});

// everyone: can see tickets
// students: can submit tickets (action buttons disabled)
// fellows: can close tickets (action buttons enabled)
// admins: can close tickets, change usertype, add users, add/delete cohorts

/** Error Handling */

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("Error 404"));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
