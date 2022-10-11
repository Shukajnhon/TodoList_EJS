
const express = require("express");
const bodyParser = require("body-parser");
let ejs = require('ejs');
const app = express();
app.set("views", "views");
app.set("view engine", "ejs");;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


let items = ['Buy Food', 'Cook Food', 'Eat Food'];
let workListItems = [];

app.get("/", (req, res) => {
    let today = new Date();

    let options = {
        weekday: "long",
        day: 'numeric',
        month: 'long',
    }

    let day = today.toLocaleDateString('vi-VN', options)
    // console.log(day)

    res.render("list", { listTitle: day, newListItems: items })


});

app.post("/", (req, res) => {
    let itemInput = req.body.newItem

    if (req.body.list === 'Work') {
        workListItems.push(itemInput)
        res.redirect("/work")
    } else {
        items.push(itemInput)
    }

    res.redirect("/")
});


// route to work page || Work List
app.get('/work', (req, res) => {
    res.render('list', { listTitle: 'Work List', newListItems: workListItems })
});

app.post('/work', (req, res) => {
    let item = req.body.newItem
    workListItems.push(item)
    res.redirect('/work')
})


app.listen(3000, () => {
    console.log("Server started on port 3000")
})