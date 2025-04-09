import express from "express";
import { CreateEvent, GetEvents, GetEventById, UpdateEvent, DeleteEvent,  SearchEvents } from "../controllers/eventController.js";
import { upload } from "../middlewares/multerConfig.js"; 

const router = express.Router();

router.post("/create", upload.single("image"), CreateEvent);

router.get("/", GetEvents);

router.get("/search", SearchEvents); 

router.get("/:eventId", GetEventById);

router.put("/:eventId", UpdateEvent);

router.delete("/:eventId", DeleteEvent);


export default router;
