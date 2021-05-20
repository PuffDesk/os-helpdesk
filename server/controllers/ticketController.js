const db = require("../models/db");

const ticketController = {};

// x createTicket
// x getTicket
// x updateTicket
// x deleteTicket
// x getCategories -> ticketController
// x getCohortList -> userController
// createUser
// updateuser
// deleteuser
// validateUser
// startSession
// setCookie

// endpoints
// /signin ->  validateUser, startSession, setCookie
// /getCohortList
// /signup -> createUser, startSession, setCookie
// /ticket -> getTickets,
// /getCategories
// /ticket/create -> createTicket,
//

/** CREATE TICKET */

// creates a ticket and posts to db
ticketController.createTicket = (req, res, next) => {
  // deconstruct request body from front end
  const {
    UserID,
    description, //categoryID
    ProblemStatement,
    ExpectedBehavior,
    TriedSolution,
    SuspectedIssue,
    ZoomLink,
  } = req.body;

  let values = [];

  // get Category ID
  const getID = `SELECT "CategoryID" from "public"."Categories" WHERE description = '${description}'`;
  // make query string
  const queryStr =
    'INSERT INTO "public"."TicketTable" ("UserID", "CategoryID", "ProblemStatement", "ExpectedBehavior", "TriedSolution", "SuspectedIssue", "ZoomLink", "image_links")' +
    " VALUES($1, $2, $3, $4, $5, $6, $7, $8 )";

  db.query(getID)
    .then((data) => {
      // console.log("data:", data.rows);
      // console.log("data:", typeof data.rows);
      const { CategoryID } = data.rows[0];
      // console.log("CategoryID:", CategoryID);
      return CategoryID;
    })
    .then((id) => {
      values = [
        UserID,
        id,
        ProblemStatement,
        ExpectedBehavior,
        TriedSolution,
        SuspectedIssue,
        ZoomLink,
        "",
      ];

      db.query(queryStr, values)
        // send to res.locals object
        .then((data) => {
          // console.log("Creating ticket: ", id);
          res.locals.createdTicket = data[0];
          return next();
        });
    });
};

/** READ TICKET FCNS */

// gets basic information about a ticket to show on the dashboard
// ticketController.getTicketDashInfo = (req, res, next) => {
// make a query string (SQL query)

// problem statement
// category <--FK. needs some type of JOIN
// created by <-- FK. needs some type of JOIN
// created at
// cohort <-- FK. needs some type of JOIN
// reviewer <-- FK. needs some type of JOIN
// status

// gets detailed information about a ticket to show on the modal
ticketController.getTicketInfo = (req, res, next) => {
  const queryStr =
    'SELECT CAT.description, CO."name" as cohort, U.username, T.*' +
    'FROM "public"."TicketTable" T ' +
    'INNER JOIN "public"."Categories" CAT ON CAT."CategoryID" = T."CategoryID"' +
    'INNER JOIN "public"."UserTable" U ON U."UserID" = T."UserID"' +
    'INNER JOIN "public"."CohortTable" CO ON CO."CohortID" = U."cohortID"' +
    'ORDER BY "TicketID" DESC';

  // make an async query using db.query and pass in query string
  db.query(queryStr)
    .then((data) => {
      // console.log("Ticket Detail: ", data);
      res.locals.ticketInfo = data.rows;
      return next();
    })
    // calling global eror handler
    .catch((err) =>
      next({
        log: "ticketController.getTickets: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "ticketController.getTickets: ERROR: Check server logs for details",
        },
      })
    );
};

/** UPDATE TICKET */

// allow residents to update text as well as fellows updating the resolved status
ticketController.updateTicket = (req, res, next) => {
  // deconstruct request body from front end

  // console.log('req params wuttt', req.params)
  // console.log('req body wuttt', req.body)
  const { ticketId } = req.params;

  const {
    status,
    response,
    responderID,
  } = req.body;

  // resolution time
  const resolved_at = new Date().toUTCString();
  console.log('time resolved: ', resolved_at)

  const values = [
    status,
    response,
    responderID,
    resolved_at,
    ticketId,
  ];

  // make query string
  const queryStr =
    'UPDATE "public"."TicketTable" ' +
    'SET ("status", "response", "responderID", "resolved_at") = ' +
    '($1, $2, $3, $4) '+
    'WHERE "TicketID" = $5;';

  // create async db.query
  db.query(queryStr, values)
    // send to res.locals object
    .then(() => {
      return next();
    })
    // catch error
    .catch((err) => next(err));
};

/** DELETE TICKET */

// have the option to delete ticket in case something inappropriate gets posted/duplicates get posted
ticketController.deleteTicket = (req, res, next) => {
  const ticketId = [req.params.ticketId]; 
  const queryStr = `DELETE FROM "public"."TicketTable" WHERE "TicketID" = $1`;

  // create async db.query
  db.query(queryStr, ticketId)
    // send to res.locals object
    .then((data) => {
      console.log("Creating ticket: ", data);
      res.locals.deletedticket = data[0];
      return next();
    })
    // catch error
    .catch((err) =>
      next({
        log: "ticketController.deleteTicket: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "ticketController.deleteTicket: ERROR: Check server logs for details",
        },
      })
    );
};

// gets all ticket categories
ticketController.getCategories = (req, res, next) => {
  const queryStr = 'SELECT * FROM "public"."Categories"';
  // make an async query using db.query and pass in query string
  db.query(queryStr)
    .then((data) => {
      res.locals.categories = data.rows;
      return next();
    })
    // calling global eror handler
    .catch((err) =>
      next({
        log: "ticketController.getCategories: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
        message: {
          err: "ticketController.getCategories: ERROR: Check server logs for details",
        },
      })
    );
};

module.exports = ticketController;
