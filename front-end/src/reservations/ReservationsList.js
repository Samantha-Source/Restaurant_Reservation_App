import React from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationsList({reservations, reservationsError, handleCancel, date}) {

    const formatTime = ( time ) => {
      let hh = parseInt(time.slice(0,2));
      const mm = time.slice(3,5);
      var suffix = hh >= 12 ? "PM" : "AM";

      hh = ((hh + 11) % 12 + 1);

      return `${hh}:${mm} ${suffix}`;    
    }

    return (
      <main>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0 ? (
        <table className = "table search-results">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile Number</th>
              <th>Time</th>
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
                {/* <td>{reservation.reservation_time.slice(0,5)}</td> */}
                <td>{formatTime(reservation.reservation_time)}</td>
                <td>{reservation.people}</td>
                <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                <td>{reservation.status === 'booked' ? 
                <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                  <button type="button" class="btn btn-info">Seat</button>
                </Link> : ''}
                </td>

                <td>{reservation.status === 'booked' ?
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                  <button type="button" class="btn btn-primary ">Edit</button>
                  </Link> : ''}
                </td>

                <td>{reservation.status === 'booked' ? 
                  <button 
                    type="button" 
                    value={reservation.reservation_id}
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={handleCancel}
                    class="btn btn-danger"
                    >Cancel</button> : ''}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}     
    </main>
  );
}