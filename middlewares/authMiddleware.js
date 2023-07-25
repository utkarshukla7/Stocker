import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protecting routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    //this compares the token which we got in the header of the request with the token we created
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    // console.log(decode);
    // console.log(req);
    // console.log(req.body); //if tokens dont match a error will occur, otherwise the decodes data is assigned to decode variable
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (user.role != 1) {
      return res.status(401).send({
        success: false,
        message: "Only for admin!",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
