require("dotenv").config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const connectedDb = require("./config/db");
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const app = express();


connectedDb();


app.set('trust proxy', 1); 


app.set("view engine", "ejs");


app.use(helmet());


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24,
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production", 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use("/auth", require("./routes/authRoute"));
app.use("/profile", require("./routes/profileRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/exam", require("./routes/exam"));
app.use("/chatroute", require("./routes/chatRoute"));


app.get("/", (req, res) => {
    res.redirect('/auth/login');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash('error', 'Something went wrong!');
    res.redirect('/auth/login');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
