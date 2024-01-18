//import modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
require('dotenv').config();

// app
const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentrials: true }));
app.use(bodyParser.json());

app.options('*', cors())

//error handeling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// routes 
const authRoutes = require('./src/routes/authRoutes');
app.use("/auth", authRoutes);

const passwordReset = require('./src/routes/passwordReset');
app.use("/passwordReset", passwordReset);

//const profileRoute = require('./src/routes/profileRoute');
//app.use("/profile", profileRoute);

const mainPageRoute = require('./src/routes/mainPage');
app.use("/media", mainPageRoute);

//port
const port = process.env.PORT || 8081;

// listener
const server = app.listen(port, () => console.log(`server is running on port ${port}`));