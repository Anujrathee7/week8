import express,{ Express } from "express";
import mongoose, { Connection } from "mongoose";
import morgan from "morgan";
import path from "path";
import router from "./src/routes/user";


const app: Express = express();
const port = 3000
app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,"../public")))

const mongoDb: string = "mongodb://localhost:27017/testdb"

mongoose.connect(mongoDb)

mongoose.Promise = Promise

const db: Connection = mongoose.connection

db.on("error",console.error.bind(console, 'MongoDB connection error'))

app.use("/api",router);

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})



