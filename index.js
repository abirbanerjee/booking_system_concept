const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static("www"));

app.listen(3000);

let bookings = [];

bookings.push({
    date: "2023-10-25",
    time: "08:00",
    name: "Abir Banerjee",
    userName: "abir"
}, {
    date: "2023-10-25",
    time: "10:00",
    name: "Syed Nabeel Azeez",
    userName: "nabeel"
});

app.post("/createbooking", (req, res) => {
    const { date, time, userName, name } = req.body;
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].userName === "abir") {
            bookings.splice(i, 1);
        }
    }
    bookings.push({ date, time, userName, name });

    return res.send("Received");
})

app.post("/getbookings", (req, res) => {
    const { date } = req.body;
    console.log(date);
    let booking = [];
    bookings.forEach(item => {
        if (item.date === date) {
            booking.push(item);
        }
    })
    return res.json(booking);
})