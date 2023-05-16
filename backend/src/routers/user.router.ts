import { Router } from "express";
import { sample_foods, sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';

const userController = require('../controllers/userController');
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
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({email});
    
       if(user && (await bcrypt.compare(password,user.password))) {
        res.send(generateTokenResponse(user));
       }
       else{
         res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
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
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser:User = {
            id:'',
            name,
            email:email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        }
        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
    }
))

router.get('/', async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (err:any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.put('/:id', userController.updateUser);

  router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await UserModel.deleteOne({ _id: userId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
 

const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        id:user.id, email:user.email, isAdmin:user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });

    

    
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
}

export default router;