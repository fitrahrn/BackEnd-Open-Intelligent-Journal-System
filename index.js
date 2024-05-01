
import express from "express";
import cors from "cors";
import FileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/AuthRoute.js";
import JournalRoute from "./routes/JournalRoute.js";
import IssueRoute from "./routes/IssueRoute.js"
import ArticleRoute from "./routes/ArticleRoute.js"

const app = express(); 
const PORT = 3001; 
  
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(AuthRoute);
app.use(JournalRoute);
app.use(IssueRoute);
app.use(ArticleRoute);



app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running,and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 
