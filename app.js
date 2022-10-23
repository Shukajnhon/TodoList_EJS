
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const date = require(__dirname + '/date.js');
let ejs = require('ejs');
const app = express();
app.set("views", "views");
app.set("view engine", "ejs");;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// Connect mongodb
mongoose.connect('mongodb+srv://Shukajnhon:Hieutn1997@cluster0.knxgenb.mongodb.net/todoListDB', { useNewUrlParser: true })


// Create Schema
const itemSchema = new mongoose.Schema({
    name: String
})

// Create Model
const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todoList!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "<--- Hit the checkbox to delete an item"
})

const defaultItem = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)


app.get("/", (req, res) => {

    // Read file, Mongodb
    Item.find({}, function (err, foundItems) {
        // Check FoundItems [] or === 0, add Default Item into Database
        if (foundItems.length === 0) {
            // Insert Item
            Item.insertMany(defaultItem, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Successfully add ${defaultItem}`)
                }
                res.redirect("/")
            })
        } else {
            // console.log(foundItems)
            res.render("list", { listTitle: "Today", newListItems: foundItems })
        }

    })

});
// Custom list name on link direction (Local host domain)
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName) // lodash to capitalize the first letter

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItem
                })
                list.save()
                res.redirect("/" + customListName)
            } else {
                // Show an existing list
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    })



})

app.post("/", (req, res) => {
    const itemName = req.body.newItem
    const listName = req.body.list

    const newItem = new Item({
        name: itemName
    })
    // direct to listName
    if (listName === "Today") {
        newItem.save()
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, function (err, foundList) {

            foundList.items.push(newItem)
            // console.log(foundList.name)
            foundList.save()
            res.redirect("/" + listName)
        })
    }

});



// Delete item when click checked box
app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    // console.log(checkedItemId)
    const listName = req.body.listName

    if (listName === "Today") {
        // matching with checkbox
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log(`Successfully delete id ${checkedItemId}`)
            }
            res.redirect("/")
        })
    } else {
        // $pull operator removes from an existing array
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (err) {
                console.log(err)

            } else {
                res.redirect("/" + listName)
            }
        })

        // List.findOne({ name: listName }, function (err, foundList) {
        //     foundList.items.pull({ _id: checkedItemId });
        //     foundList.save(function () {

        //         res.redirect("/" + listName);
        //     });
        // });

    }
})


// route to work page || Work List
app.get('/work', (req, res) => {
    res.render('list', { listTitle: 'Work List', newListItems: workListItems })
});

app.post('/work', (req, res) => {
    let item = req.body.newItem
    workListItems.push(item)
    res.redirect('/work')
})

let port = process.env.PORT
if (port == null || port == "") {
    port = 3000
}

app.listen(port, () => {
    console.log("Server started successfully")
})