const knex = require("../db/connection");


function list(date) {
    return knex("reservations")
        .select("*")
        // .whereNotIn("status")
        .where({ reservation_date: date })
        .orderBy("reservation_time")
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((newReservation) => newReservation[0])
}

// function read(reservationId) {
//     return knex('reservations as r')
//         .join("tables as t", "r.reservation_id", "t.reservation_id")
//         .select("t.table_id", "r.reservation_id", "t.status")
//         .where({ reservation_id: reservationId })
//         .first()
// }


function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first()
}

module.exports = {
    list,
    create,
    read,
    
}