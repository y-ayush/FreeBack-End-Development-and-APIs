app.get('/api/:date?', (req, res) => {
    let { date } = req.params;
    console.log("Raw input:", date);

    if (!date) {
        date = new Date();
    } else if (/^\d+$/.test(date)) {
        console.log("Parsing as Unix timestamp");
        date = new Date(parseInt(date));
    } else {
        console.log("Parsing as ISO date string");
        date = new Date(date);
    }
    console.log("Parsed date:", date);

    if (date.toString() === "Invalid Date") {
        return res.json({ error: "Invalid Date" });
    }

    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});
