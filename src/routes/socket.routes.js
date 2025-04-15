// routes/chat.route.js

import express from 'express';
import { Router } from 'express';
import { handleWebSocket } from '../controller/socket.controller.js';

const router = Router();

router.route('/messages').post(handleWebSocket);

export default router;
