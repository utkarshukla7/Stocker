import express from "express";
import { registerController, loginController } from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";                   // adding middleware : router.post('/route',middleware ,Controller);
//we can add as many middleware as we want s
//router object
const router = express.Router();

//ROUTING

//Register
router.post('/register', registerController);

//Login
router.post('/login', loginController);


//test
// router.post('/test', requireSignIn, testController);

export default router;