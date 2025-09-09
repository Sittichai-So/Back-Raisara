import { Router  } from "express";
import * as CategoriesRepository from "./categories.controller.js";

const router = Router();

router.get("/getCategories", CategoriesRepository.getCategories);

export default router;
