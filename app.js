const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const loginRoute = require('./routes/loginRoute');
const profileRoute = require('./routes/profileRoute');
const chatRoute = require('./routes/chatRoute');
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret:'flashblog',
    saveUninitialized: false,
    resave: false
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get("/",(req, res) => {
  res.redirect("/loginroute");
});

app.use("/authroute", authRoute);
app.use("/loginroute", loginRoute);
app.use("/profileroute", profileRoute);
app.use("/chatroute", chatRoute);
app.listen(3000);