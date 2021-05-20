const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/', ticketController.getTicketInfo, (req, res) => {
  res.status(200).json(res.locals.ticketInfo);
});

router.post('/create', ticketController.createTicket,(req, res) => {
  res.status(200).json(res.locals.createdTicket);
});

router.put('/:ticketId', ticketController.updateTicket,(req, res) => {
  res.status(200).json(res.locals.updatedTicket);
});

router.delete('/:ticketId',  ticketController.deleteTicket,(req, res) => {
  res.status(200).json(res.locals.deletedTicket);
});




module.exports = router;
