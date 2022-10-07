
const express = require("express");
const bodyParser = require("body-parser");
let ejs = require('ejs');
const app = express();
app.set("views", "views");
app.set("view engine", "ejs");;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
    let today = new Date();

    let options = {
        weekday: "long",
        day: 'numeric',
        month: 'long',
    }

    let day = today.toLocaleDateString('vi-VN', options)
    console.log(day)

    res.render("list", { kindOfDay: day })


})


app.listen(3000, () => {
    console.log("Server started on port 3000")
})