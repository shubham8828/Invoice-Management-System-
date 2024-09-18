import express from 'express';
import { getUser, login, register,update } from '../controller/User.js';
const userRoutes=express.Router();

userRoutes.post('/register',register);
userRoutes.post('/login',login);
userRoutes.put('/update',update)
userRoutes.post('/user',getUser)


export default userRoutes;