import express from "express";
const app = express();

app.get('/api/:date?', (req, res) => {
    let dateInput = req.params.date;
    let date;

    if (!dateInput) {
        date = new Date(); // current date and time
    } else {
        // Try parsing the date input
        dateInput = parseInt(dateInput);
        date = new Date(dateInput);
        // console.log(date);
        if (isNaN(date.getTime())) {
            return res.json({ error: "Invalid Date" });
        }
    }
    // console.log(typeof(date.getTime()))
    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
