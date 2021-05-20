const db = require("../models/db");

const userController = {};

// creates a User and posts to db
userController.createUser = (req, res, next) => {
  // deconstruct request body from front end
  const { username, password, cohortID, usertypeID } = req.body;
  const values = [username, password, cohortID, usertypeID];

  // make query string
  const queryStr =
    'INSERT INTO "public"."UserTable" ("username", "password", "cohortID", "usertypeID") ' +
    "VALUES($1, $2, $3, $4)";
  console.log(queryStr);
  // create async db.query
  db.query(queryStr, values)
    // send to res.locals object
    .then((data) => {
      console.log("Creating user: ", data);
      res.locals.createdUser = data.rows[0];
      return next();
    })
    // catch error
    .catch((err) => {next(
      {
        log: "userController.createUser: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "userController.createUser: ERROR: Check server logs for details", err,
        },
      }
    )});
};

userController.verifyUser = (req, res, next) => {
  const values = [req.body.username, req.body.password];
  const statement =
    'SELECT * FROM "public"."UserTable" WHERE username = $1 AND password = $2';
  db.query(statement, values)
    .then((result) => {
      console.log("Verifying user: ", result);
      res.locals.user = result.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log: "userController.verifyUser: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "userController.verifyUser: ERROR: Check server logs for details",
        },
      })
    );
};

userController.updateUser = (req, res, next) => {
  // deconstruct request body from front end
  const { UserID, username, password, cohortID, usertypeID } = req.body;

  const values = [UserID, username, password, cohortID, usertypeID];
  const queryStr =
    'UPDATE "public"."UserTable" SET ("username") = $2 WHERE "UserID" = $1;';
  db.query(queryStr, values)
    .then((result) => {
      if (result.rows.length) {
        console.log("Updating user: ", data);
        res.locals.user = result.rows[0];
        return next();
      }
    })
    .catch((err) =>
      next({
        log: "userController.updateUser: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "userController.updateUser: ERROR: Check server logs for details",
        },
      })
    );
};

userController.deleteUser = (req, res, next) => {
  const { ticketId } = req.body;
  const queryStr = 'DELETE FROM "public"."UserTable" WHERE "UserID" = $1;';
  db.query(queryStr, ticketId)
    .then((data) => {
      console.log("Deleting user: ", data);
      res.locals.deleteduser = data[0];
      return next();
    })
    .catch((err) =>
      next({
        log: "ticketController.deleteUser: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "ticketController.deleteUser: ERROR: Check server logs for details",
        },
      })
    );
};

// gets all cohorts
userController.getCohorts = (req, res, next) => {

  const queryStr = 'SELECT * FROM "public"."CohortTable" LIMIT 25';

  db.query(queryStr)
    .then((data) => {
      console.log("Getting cohorts: ", data);
      res.locals.allCohorts = data.rows;
      return next();
    })
    // calling global eror handler
    .catch((err) =>
      next({
        log: "userController.getCohorts: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "userController.getChorts: ERROR: Check server logs for details",
        },
      })
    );
}; 
module.exports = userController;
