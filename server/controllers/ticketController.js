const db = require("../models/db");

const ticketController = {};

// x createTicket
// x getTicket
// x updateTicket
// x deleteTicket
// x getCategories -> ticketController
// x getCohortList -> userController
// xcreateUser
// updateuser
// deleteuser
// xvalidateUser
// startSession
// setCookie

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
      const { CategoryID } = data.rows[0];
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
          res.locals.createdTicket = data[0];
          return next();
        });
    });
};

/** READ TICKET FCNS */

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
      res.locals.ticketInfo = data.rows;
      return next();
    })
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
    .then(() => {
      return next();
    })
    .catch((err) => next({
      log: "ticketController.updateTicket: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals to be an object.",
      message: {
        err: "ticketController.updateTicket: ERROR: Check server logs for details",
      },
    }));
};

/** DELETE TICKET */

// have the option to delete ticket in case something inappropriate gets posted/duplicates get posted
ticketController.deleteTicket = (req, res, next) => {
  const ticketId = [req.params.ticketId]; 
  const queryStr = `DELETE FROM "public"."TicketTable" WHERE "TicketID" = $1`;

  // create async db.query
  db.query(queryStr, ticketId)
    .then((data) => {
      console.log("Creating ticket: ", data);
      res.locals.deletedticket = data[0];
      return next();
    })
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
  db.query(queryStr)
    .then((data) => {
      res.locals.categories = data.rows;
      return next();
    })
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
