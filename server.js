var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();

// setup 'route'
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});
app.post("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});
app.get("/BnB", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/detailBnB.html"));
});

app.post("/rooms", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/roomListing.html"));
});

app.post("/payment", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/paymentConfirm.html"));
});

//make express look in the public directory for assets (css/js/img)
app.use(express.static(path.join(__dirname,'public')));

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);

