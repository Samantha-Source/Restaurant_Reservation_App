import React from "react";


export default function ValidateReservation(reservation) {
    
    const {first_name="", last_name="", mobile_number="", reservation_date="", reservation_time="", people=""} = reservation;
    let errors = [];

    const fullReservationDate = new Date(`${reservation_date}T${reservation_time}:00`);
    const fullTodayDate = new Date();

    const reservationTimeHours = Number(reservation_time.slice(0,2));
    const reservationTimeMinutes = Number(reservation_time.slice(3,5));


    if(!mobile_number.match(/^[\]?[(]?[0-9]{3}[)]?[-\s\]?[0-9]{3}[-\s\]?[0-9]{4,6}$/)){
        errors.push(`Please enter a valid mobile number.`);
    }
    if(first_name.length < 1){
        errors.push(`A first name is required.`);
    }
    if(last_name.length < 1){
        errors.push(`A last name is required.`);
    }
    if(people < 1){
        errors.push(`People must be at least 1, you entered ${people}`);
    }
    if(fullTodayDate > fullReservationDate){
        
        errors.push(`Reservations must be in the future.`);
    }
    if(reservationTimeHours === 10 && reservationTimeMinutes <= 30){
        errors.push(`Reservations must be after 10:30 AM`)
    }
    if(reservationTimeHours && reservationTimeHours < 10){
        errors.push(`Reservations must be after 10:30 AM`)
    }
    if(reservationTimeHours >= 21 && reservationTimeMinutes >= 30){
        errors.push('It is too late to make a reservation')
    }
    if(reservationTimeHours >= 22){
        errors.push(`It is too late to make a reservation`)
    }
    if(typeof(fullReservationDate.getHours()) !== 'number' || typeof(fullReservationDate.getMinutes()) !== 'number'){
        errors.push(`Please enter a valid reservation time`);
    }
    if(fullReservationDate.getDay() === 2){
        errors.push(`Sorry, we are closed on Tuesdays.`);
    }
        

    if(errors.length > 0){
        return (
            <div className="error alert alert-danger">
                <ul>
                    {errors.map((error, index) =>(
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        )
    } 
    else {
        return (
            <>
            </>
        )
    }
}


        



