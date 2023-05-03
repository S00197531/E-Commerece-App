import { Router } from "express";
import { sample_foods, sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import { UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

const router = Router()

router.get("/seed", asyncHandler(
    async (req,res) => {
     const usersCount = await UserModel.countDocuments();
     if(usersCount> 0){
         res.send("Seed is already done!");
         return
     }
     await UserModel.create(sample_users);
     res.send("Seed is Done!")
    }
 ))

router.post("/login", asyncHandler(
    async (req,res) => {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email, password})
    
            if(user){
                res.send(generateTokenResponse(user))
            } else {
                res.status(HTTP_BAD_REQUEST).send("username or password is invalid")
            }
    }
))

router.post('/register', asyncHandler(
    async (req, res) => {
        const {name, email, password, address} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            res.status(HTTP_BAD_REQUEST).send('User already exists, please login!');
            return;
        }
        
    }
))

const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    }, "12345", {
        expiresIn: "30d"
    });

    user.token = token;
    return user;
}

export default router;