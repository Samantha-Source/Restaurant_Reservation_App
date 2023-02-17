import React from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationsList({reservations, reservationsError, handleCancel, date}) {


    return (
        <main>
            {/* TODO remove extra code */}
      {/* <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div> */}
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
                <td>{reservation.status === 'booked' ? 
                <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                  <button type="button">Seat</button>
                </Link> : ''}
                </td>

                <td>{reservation.status === 'booked' ?
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                  <button type="button">Edit</button>
                  </Link> : ''}
                </td>

                <td>{reservation.status === 'booked' ? 
                  <button 
                    type="button" 
                    value={reservation.reservation_id}
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={handleCancel}
                    >Cancel</button> : ''}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}
      {/* {JSON.stringify(reservations)} */}

     
    </main>
  );

    
}