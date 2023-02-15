import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link, useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import { useParams } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ListReservations() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
let date = useQuery().get('date') || today();

  
  let history = useHistory();
  

  useEffect(loadReservations, [date]);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }



  function finishable(table){
    if(table.reservation_id){
      return (
        <button 
          onClick={handleFinish} 
          value={table.table_id} 
          data-table-id-finish={table.table_id}>
          Finish
        </button>
      )
    }
  }

  const handleFinish = async (event) => {
    event.preventDefault()
    if(window.confirm('Is this table ready to seat new guests? \n \nThis cannot be undone.')) {
      try{
        await finishTable(event.target.value);
        // loadTables();
        loadReservations();
      }
      catch(error){
        console.log(error);
      }
    }
  }

    const handleCancel = (event) => {
      //LEFT OFF HERE NEED TO IMPLEMENT CANCEL
      console.log(event.target.value)
    }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0 ? (
        <table className = "table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile Number</th>
              <th>Reservation Date</th>
              <th>Reservation Time</th>
              <th>People</th>
              <th>Status</th>
              <th>Seat</th>
              <th>Edit</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.reservation_id}</td>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.reservation_time}</td>
                <td>{reservation.people}</td>
                <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                <td>{reservation.status === 'seated' ? '' : 
                <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                  <button type="button">Seat</button>
                </Link>}
                </td>

                <td>
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                  <button type="button">Edit</button>
                  </Link>
                </td>

                <td>
                  <button 
                    type="button" 
                    value={reservation.reservation_id}
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={handleCancel}
                    >Cancel</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found for this date.</p>
      )}

    </main>
  );
}

export default ListReservations;
