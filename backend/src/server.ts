import dotenv from 'dotenv';
dotenv.config();
process.env.MONGO_URI
import path from 'path'
import express from "express";
import cors from "cors"
import { sample_foods, sample_tags, sample_users } from "./data";
import jwt from "jsonwebtoken";
import foodRouter from './routers/food.router'
import userRouter from './routers/user.router';
import orderRouter from './routers/order.router'
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();
app.use(express.json());

app.use(cors({
    credentials:true,
    origin:["https://eat-more.herokuapp.com"],
    allowedHeaders: ['access_token'],
    
}));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://eat-more.herokuapp.com');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access_token');
//     next();
//   });


app.use("/api/foods", foodRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname , 'public', 'index.html'))
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website served on http:localhost:" + port);
})

