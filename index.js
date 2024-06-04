
import express from "express";
import cors from "cors";
import FileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import JournalRoute from "./routes/JournalRoute.js";
import IssueRoute from "./routes/IssueRoute.js"
import ArticleRoute from "./routes/ArticleRoute.js"
import ContributorsRoute from "./routes/ContributorsRoute.js"
import ReviewsRoute from "./routes/ReviewsRoute.js"
import ReviewersRoute from "./routes/ReviewersRoute.js"
import ReviewersFileRoute from "./routes/ReviewersFileRoute.js";
import dotenv from "dotenv";

const app = express(); 
const PORT = 3001; 
const corsOptions = {
    // set origin to a specific origin.
    origin: 'http://localhost:3000',
    
    // or, set origin to true to reflect the request origin
    //origin: true,
  
    credentials: true,
    optionsSuccessStatus: 200,
  };  


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(AuthRoute);
app.use(UserRoute);
app.use(JournalRoute);
app.use(IssueRoute);
app.use(ArticleRoute);
app.use(ContributorsRoute);
app.use(ReviewsRoute);
app.use(ReviewersRoute);
app.use(ReviewersFileRoute);
dotenv.config();
    // access config var
process.env.TOKEN_SECRET;


app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running,and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 
