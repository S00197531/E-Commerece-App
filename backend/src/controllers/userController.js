

const User = require('../models/user.model');
const { UserModel } = require("../models/user.model");

const updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
      // Find the user in the database by ID
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user properties
      user.name = req.body.name;
      user.email = req.body.email;
      user.address = req.body.address;
      user.isAdmin = req.body.isAdmin;
  
      // Save the updated user to the database
      await user.save();
  
      return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  updateUser,
};
// import { Request, Response } from 'express';
// import { UserModel, User } from '../models/user.model';

// const updateUser = async (req: Request, res: Response): Promise<Response> => {
//   const userId: string = req.params.id;

//   try {
//     // Find the user in the database by ID
//     const user: User | null = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user properties
//     user.name = req.body.name;
//     user.email = req.body.email;
//     user.address = req.body.address;
//     user.isAdmin = req.body.isAdmin;

//     // Save the updated user to the database
//     await UserModel.updateOne();

//     return res.status(200).json({ message: 'User details updated successfully' });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export { updateUser };
