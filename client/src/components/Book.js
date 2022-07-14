import React, { useEffect, useState } from 'react'


function Book() {

    const [seats, setSeats] = React.useState(0);
    const [date, setDate] = React.useState(new Date());
    const [time, setTime] = React.useState(new Date());
    const [duration, setDuration] = React.useState(1);

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
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Choose Amount of Seats</h5>
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
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Choose Date</h5>
                            <p className="card-text">
                                <input type="date" className="form-control" value={date} onChange={handleDateChange}/>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Choose Time</h5>
                            <p className="card-text">
                                <input type="time" className="form-control" value={time} onChange={handleTimeChange}/>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Choose Duration</h5>
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
            </div>
            <button className="btn btn-primary" onClick={handleClick}>Book</button>
        </div>
    )
}

export default Book