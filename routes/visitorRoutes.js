import { Router } from "express";
import {
  trackVisitor,
  getAllVisitors,
  getVisitorStats,
  deleteVisitor,
  subscribeVisitor,
  clearAllVisitors,
  clearVisitors,
  clearVisits,
} from "../controllers/visitorsController.js";

const router = Router();

// ✅ Routes for clearing data should be before ":id" route
router.delete("/clear-all", clearAllVisitors);
router.delete("/clear-visitors", clearVisitors);
router.delete("/clear-visits", clearVisits);

router.post("/", trackVisitor);
router.get("/", getAllVisitors);
router.get("/stats", getVisitorStats);
router.post("/subscribe", subscribeVisitor);
router.delete("/:id", deleteVisitor); // ✅ Keep this last

export default router;
export { router as visitorRoutes };
