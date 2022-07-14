import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Book from './components/Book';
import Booked from './components/Booked';
import React, { useEffect, useState } from 'react';

function App() {

    const [bookingReference, setBookingReference] = useState('');

    useEffect(() => {
        console.log("Booking reference (App.js): " + bookingReference);
    }, [bookingReference]);

    return (
        <div className="App">
            {/* title  */}
            <h1>Restaurant Booking</h1>

            <Router>
                <Routes>
                    <Route path="/" element={<Book setBookingReference={setBookingReference} />} />
                    <Route path="/booked" element={<Booked bookingReference={bookingReference} />} />
                </Routes>
            </Router>

            {/* footer  */}

        </div>
    );
}

export default App;
