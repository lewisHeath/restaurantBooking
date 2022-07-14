import React from 'react'

function Booked({ bookingReference }) {
    return (
        <div>
            <h2>Table Booked!</h2>
            <p>Your booking reference is: <b>{bookingReference}</b></p>
        </div>
    )
}

export default Booked