import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function Book({ setBookingReference }) {

    const navigate = useNavigate();

    const [seats, setSeats] = useState(1);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [time, setTime] = useState(moment().format('HH:mm'));
    const [duration, setDuration] = useState(1);

    function handleSeatChange(event) {
        setSeats(event.target.value);
    }

    function handleDateChange(event) {
        setDate(event.target.value);
    }

    function handleTimeChange(event) {
        setTime(event.target.value);
    }

    function handleDurationChange(event) {
        setDuration(event.target.value);
    }

    useEffect(() => {
        console.log("date: " + date);
        console.log("time: " + time);
    }, []);

    async function handleClick() {
        console.log("You have selected " + seats + " seats");
        console.log("You have selected " + date + " date");
        console.log("You have selected " + time + " time");
        console.log("You have selected " + duration + " duration");
        //send to api
        //create body for post request
        let body = {
            "seats": seats,
            "dateTime": date + " " + time,
            "duration": duration
        }
        //send request
        const response = await fetch('http://localhost:9000/booking/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        //get response
        const data = await response.json();
        console.log(data);
        //if response is ok, redirect to booking page
        if (data.status === "ok") {
            setBookingReference(data.bookingReference);
            console.log("Booking reference: " + data.bookingReference);
            //go to /booking without using window.href
            navigate('/booked');
        } else {
            alert("Something went wrong");
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <p className="card-title">Seats</p>
                        <p className="card-text">
                            <select className="form-control" value={seats} onChange={handleSeatChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p className="card-title">Date</p>
                        <p className="card-text">
                            <input type="date" className="form-control" value={date} onChange={handleDateChange}/>
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p className="card-title">Time</p>
                        <p className="card-text">
                            <input type="time" className="form-control" value={time} step="3600" onChange={handleTimeChange}/>
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p className="card-title">Duration</p>
                        <p className="card-text">
                            <select className="form-control" value={duration} onChange={handleDurationChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                        </p>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleClick}>Book</button>
        </div>
    )
}

export default Book