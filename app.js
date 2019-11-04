const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

//DB Config
const db = require("./config/keys").MongoURL;
mongoose
  .connect("mongodb://localhost/test", { useNewUrlParser: true })
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body Parser
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server started on Port " + PORT);
});

// process.once("SIGUSR2", function() {
//   server.close(function() {
//     process.kill(process.pid, "SIGUSR2");
//   });
// });
