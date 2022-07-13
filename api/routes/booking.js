let express = require('express');
let router = express.Router();
let sqlite3 = require('sqlite3');
let moment = require('moment');

let db = new sqlite3.Database('../db/booking.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the booking database.');
});

router.get('/', function(req, res, next) {
    //select all from table
    db.all('SELECT * FROM Tables', (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        res.json(rows);
    });
});

router.get("/tableNumber", function (req, res, next) {
    let tableNumber = req.query.tableNumber;
    db.all("SELECT * FROM Tables WHERE tableNumber = ?", tableNumber, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        res.json(rows);
    });
});

router.post("/book", async function (req, res, next) {
    let tableNumber = req.body.tableNumber;
    let dateTime = req.body.dateTime;
    dateTime = moment(dateTime).format('YYYY-MM-DD HH:mm');
    let duration = req.body.duration;

    console.log(req.body);

    let tableAvailable = await checkTableAvailability(tableNumber, dateTime, duration);

    if (tableAvailable) {
        //generate random string for booking reference
        let bookingReference = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log(bookingReference);
        db.run("INSERT INTO Bookings (TableNumber, DateTime, Duration, Reference) VALUES (?, ?, ?, ?)", tableNumber, dateTime, duration, bookingReference, (err) => {
            if (err) {
                throw err;
            }
            console.log("Table Booked!");
        });
        res.json({
            "bookingReference": bookingReference
        });
    } else {
        res.json({
            "error": "Table is not available"
        });
    }
});


async function checkTableAvailability(tableNumber, dateTime, duration) {
    //check if table is available
    console.log("checking table exists...");
    let tableExists = await checkTableExists(tableNumber);
    console.log("table exists: " + tableExists);

    if (tableExists) {
        console.log("checking dateTime availability...");

        let dateTimeAvailable = await checkDateTimeAvailability(tableNumber, dateTime, duration);

        if (dateTimeAvailable) {
            console.log("Table is available");
            return true;
        } else {
            console.log("Table is not available");
            return false;
        }
    }
}

async function checkTableExists(tableNumber) {
    //check if table exists
    let tableExists = false;

    let query = "SELECT * FROM Tables WHERE tableNumber = ?";
    let params = [tableNumber];

    let rows = await getAllPromise(query, params);

    if (rows.length > 0) {
        tableExists = true;
    }

    return tableExists;
}

async function checkDateTimeAvailability(tableNumber, dateTime, duration) {
    //check if dateTime is available for duration
    let dateTimeAvailable = true;

    let query = "SELECT * FROM Bookings WHERE TableNumber = ?";
    let params = [tableNumber];

    let rows = await getAllPromise(query, params);
    console.log("rows: " + rows);

    if (rows.length > 0) {
        //check if dateTime is available for duration
        dateTimeAvailable = checkDateTimeAvailabilityForDuration(rows, dateTime, duration);

    } else {
        dateTimeAvailable = true;
    }
    return dateTimeAvailable;
}

function checkDateTimeAvailabilityForDuration(rows, dateTime, duration) {
    //check if dateTime is available for duration
    let dateTimeAvailable = true;

    let startTime = moment(dateTime).format('YYYY-MM-DD HH:mm');
    let endTime = moment(dateTime).add(duration, 'hours').format('YYYY-MM-DD HH:mm');

    console.log("startTime: " + startTime);
    console.log("endTime: " + endTime);

    for (let i = 0; i < rows.length; i++) {
        let DBstartTime = moment(rows[i].DateTime).format('YYYY-MM-DD HH:mm');
        let DBendTime = moment(DBstartTime).add(rows[i].Duration, 'hours').format('YYYY-MM-DD HH:mm');

        console.log("DBstartTime: " + DBstartTime);
        console.log("DBendTime: " + DBendTime);

        //if the booking is in the same time slot
        if (moment(startTime).isBetween(DBstartTime, DBendTime) || moment(endTime).isBetween(DBstartTime, DBendTime)) {
            return false;
        }

        if(moment(DBstartTime).isBetween(startTime, endTime) || moment(DBendTime).isBetween(startTime, endTime)) {
            return false;
        }
        //if the booking starts or ends at the same time
        if(moment(startTime).isSame(DBstartTime) || moment(endTime).isSame(DBendTime)) {
            return false;
        }
    }

    console.log("dateTimeAvailable: " + dateTimeAvailable);
    return true;
}

function getAllPromise(query, params) {
    return new Promise((resolve, reject) => {

        db.all(query, params, (err, rows) => {

            if(err) {
                
                // case error
                reject(err);
            }

            // "return" the result when the action finish
            resolve(rows);
        })
    })
}

module.exports = router;