import express from "express";
import {
  homeController,
  indexController,
} from "../controllers/homeController.js";

const router = express.Router();

router.get("/news", homeController);
router.get("/index", indexController);
export default router;
