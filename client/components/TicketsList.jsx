import React, { useEffect, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TicketDetails from './TicketDetails'
import { AuthContext } from './contexts/Auth';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function TicketsList(props) {
  const classes = useStyles();
  const [tickets, setTickets] = useState([]);
  const [currentModal, setCurrentModal] = useState([]);
  // modal controller
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useContext(AuthContext);
  console.log(user)
  const handleOpen = (e, row) => {
    setCurrentModal(row)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [])

  const loadData = () => {
    fetch('/ticket')
    .then(res => res.json())
    .then(data => setTickets(data))
    .catch(err => console.error(err))
  }

  
  return (
    <div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Problem Statement</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Cohort</TableCell>
            <TableCell align="center">Created by</TableCell>
            <TableCell align="center">Created at</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.filter(ticket => ticket.ProblemStatement.toLowerCase().includes(props.searchText.toLowerCase()))
          .map((row) => (
            <TableRow key={row.TicketID} onClick={e => handleOpen(e, row)}>
              <TableCell component="th" scope="row">
                {row.ProblemStatement}
              </TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{row.cohort}</TableCell>
              <TableCell align="center">{row.username}</TableCell>
              <TableCell align="center">{row.created_at}</TableCell>
              <TableCell align="center">{row.status ? row.status : "Pending"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {console.log(currentModal)}
      { open && 
        <TicketDetails
        open={open}
        onClose={handleClose}
        details={currentModal}
        setDetails={setCurrentModal}
        refresh={loadData}/>
      }
    </TableContainer>
    </div>
  );
}
