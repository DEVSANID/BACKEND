import express from "express";
import { CreateEvent, GetEvents } from "../controllers/eventController.js"; 
import { upload } from "../middlewares/multerConfig.js"; 

const router = express.Router();

router.post("/create", upload.single("image"), CreateEvent); 

router.get("/", GetEvents); 

export default router;
