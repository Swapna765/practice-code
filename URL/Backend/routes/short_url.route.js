import express from 'express';
import { createShortUrlController } from '../controller/short_url.controller.js';
const router = express.Router();

router.post("/", createShortUrlController);

export default router;