import { Router } from 'express';
import { chat, getSendingMessage, getUserChat, getReceivingMessage, messageRemove, chatData  } from '../controller/chat.controller.js';
import { verifJWT } from "../middleware/auth.middleware.js"

const router = Router();

router.route('/message').post(verifJWT, chat);
router.route('/get-Sending-Message').post(verifJWT, getSendingMessage);
router.route('/get-user-chat').get(verifJWT, getUserChat); 
router.route('/get-Receiving-Message').post(verifJWT, getReceivingMessage);
router.route('/message-remove').delete(verifJWT, messageRemove);
router.route('/get-chat-data').get(verifJWT, chatData);


export default router;
