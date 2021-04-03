require("dotenv").config();
import express from 'express';
import configViewEngine from "./config/viewEngine";
import initWebRouter from "./routes/web";
import bodyParser from 'body-parser';

let app = express();

// use body-parsers to handel post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view engine
configViewEngine(app);

// init all web routes
initWebRouter(app);

let port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log(`App is running at port ${port}`);
})
