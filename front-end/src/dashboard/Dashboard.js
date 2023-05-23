import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link, useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import { cancelReservation } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import Modal from "react-modal";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [showPopup, setShowPopup] = useState(localStorage.getItem("popupShown") !== "true");
  // const [showPopup, setShowPopup] = useState(true);

  let history = useHistory();
  

  useEffect(loadDashboard, [date]);
  useEffect(() => {
    localStorage.setItem("popupShown", "true")
  }, [])

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);


    return () => abortController.abort();
  }

  useEffect(loadTables, [])

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }
  

  function clickPrevious() {
    let previousDay = previous(date)
    history.push(`/dashboard?date=${previousDay}`);
  }

  function clickNext() {
    let nextDay = next(date)
    history.push(`/dashboard?date=${nextDay}`);
  }

  function finishable(table){
    if(table.reservation_id){
      return (
        <button 
          onClick={handleFinish} 
          value={table.table_id} 
          data-table-id-finish={table.table_id}
          class="btn btn-warning">
          Finish
        </button>
      )
    }
  }

  const handleFinish = async (event) => {
    event.preventDefault();
    if(window.confirm('Is this table ready to seat new guests? \n \nThis cannot be undone.')) {
      try{
        await finishTable(event.target.value);
        loadTables();
        loadDashboard();
      }
      catch(error){
        console.log(error);
        throw error;
      }
    }
  }


  const mappedTables = tables.map((table, index) => (
      <>
      <tr key={index}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? 'occupied' : 'free'}</td>
        <td>{finishable(table)}</td>
        </tr>
      </>
    ))
  

    const handleCancel = async (event) => {
      event.preventDefault();
      if(window.confirm(`Do you want to cancel this reservation? \n \nThis cannot be undone.`)) {
        try{
          await cancelReservation(event.target.value);
          loadTables();
          loadDashboard();
        }
        catch(error) {
          console.log(error)
          throw error
        }
      }
    }

  return (
    <main>
      <Modal isOpen={showPopup} style = {{
        overlay: {
          position: 'fixed',
          top: '25%',
          left: '30%',
          right: '30%',
          bottom: '50%',
          backgroundColor: 'rgba(244, 196, 137, 0.8)',
          borderRadius: '10px'
        },
        content: {
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '1px solid #ccc',
          background: '#fff',
          borderRadius: '16px',
          outline: '1px',
          padding: '20px',
          alignItems: "center",
          justifyContent: "center"
        }
      }

      }>
          <h2>Welcome to The Periodic Tables Restaurant Reservation App!</h2>
          <p style={{textAlign: "center", fontSize: "larger"}}>Please be patient with the tables loading</p>
          <p style={{textAlign: "center"}}>We are using a free DataBase and response times are often slow.</p>
          <button style={{marginLeft: "47%" }} onClick={() => setShowPopup(false)}>Close</button>      
        </Modal>


      <h1>Dashboard</h1>
      <hr></hr>
      <br></br>
      <div>
        <h4>Reservations for {date}</h4>
      </div>

      <ReservationsList
        reservations={reservations}
        reservationsError={reservationsError}
        handleCancel={handleCancel}
        />

      <button 
      type="button" 
      onClick={clickPrevious}
      class="btn btn-secondary mb-3"
      >Previous</button>
      {" "}
      <Link to="/dashboard">
      <button 
      type="button" 
      class="btn btn-success mb-3" 
      Link to="/dashboard"
      >Today</button>
      </Link>
      {" "}
      <button
       type="button" 
       onClick={clickNext} 
       class="btn btn-secondary mb-3" 
       >Next</button>

      <div>
        <h4 class="mb-20">Tables</h4>
      </div>
      <ErrorAlert error={tablesError} />
      <table className = "table">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Finish</th>
          </tr>
        </thead>
        <tbody>
          {mappedTables}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
