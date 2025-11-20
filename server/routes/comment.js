import express from "express";
import {
  deletecomment,
  getallcomment,
  postcomment,
  editcomment,
  translateComment,
} from "../controllers/comment.js";

const routes = express.Router();
routes.post("/postcomment", postcomment);
routes.delete("/deletecomment/:id", deletecomment);
routes.post("/editcomment/:id", editcomment);
routes.post("/translate", translateComment);
routes.get("/:videoid", getallcomment);
export default routes;
