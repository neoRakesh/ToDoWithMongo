const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const TodoTask = require("./models/TodoTask");

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', 'views');





mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));



app.listen(3000, () => console.log("server log successfully"));

//Starting page entry point that will show list of item
app.get("/", (req, res) => {
  TodoTask.find({})
    .then(todoTask => {
      res.render('todo.ejs',
        {
          todoTasks: todoTask,
          path: '/',

        }
      );
    })
    .catch(err => { console.log(err) })
});




//Creating todo 
app.post('/', async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    console.log("saved");
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});


//Editing and updating new edited value

app.route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({})
      .then(todoTask => {
        res.render("todoEdit.ejs", { todoTasks: todoTask, idTask: id });
      })
  })
  .post((req, res) => {
    TodoTask.findByIdAndUpdate(req.params.id, { $set: { content: req.body.content } }, { new: true }).then((docs) => {
      console.log("Updated successfully");

      res.redirect("/");


    }).catch((err) => {
      console.log(err);
    })
  });


  //Deleting the selected todo
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id)
    .then((docs) => {
      res.redirect("/");
    }).catch((err) => {
      cosole.log(err);
    })

});










