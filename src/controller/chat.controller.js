import { asyncHandler } from "../utils/asyncHandler.js"
import { MSGschema } from "../models/message.model.js"
import { io } from "../app.js"

const chat = asyncHandler(async (req, res) => {


    const { SenderId, ReceiverId, sandMsg, time, date } = req.body;
    const message = await MSGschema.create({
        SenderId,
        ReceiverId,
        content: sandMsg,
        time,
        date
    })
    if (!message) {
        return res.status(404).json({ error: 'message not sand' });
    }
    return res.status(200).json({ message: 'message sand successfully', data: message });

})

const getUserChat = asyncHandler(async (req, res) => {

    const message = await MSGschema.find().sort({ time: 1 })
    if (!message) {
        return res.status(404).json({ error: 'message not sand' });
    }
    return res.status(200).json({ message: 'message sand successfully', data: message });

})

const getSendingMessage = asyncHandler(async (req, res) => {
    const { sender, receiver } = req.body;

    const messages = await MSGschema.find({ SenderId: sender, ReceiverId: receiver }).sort({ updatedAt: 1 });

    if (!messages || messages.length === 0) {
        return res.status(404).json({ error: 'No messages found' });
    }
    return res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
});

const getReceivingMessage = asyncHandler(async (req, res) => {
    const { sender, receiver } = req.body;

    const messages = await MSGschema.find({ SenderId: sender, ReceiverId: receiver }).sort({ time: 1 });

    if (!messages || messages.length === 0) {
        return res.status(404).json({ error: 'No messages found' });
    }

    return res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
});

const messageRemove = asyncHandler(async (req, res) => {
    const { removeId } = req.body

    const message = await MSGschema.findByIdAndDelete(removeId);

    if (!message) {
        return res.status(404).json({ error: 'Remove Id No found' });
    }

    return res.status(200).json({ message: 'Messages Remove successfully', data: message });
})



const chatData = asyncHandler(async (req, res) => {
    try {
        const chat = await MSGschema.find().sort({ updatedAt: 1 });

        if (chat.length === 0) {
            return res.status(404).json({ error: 'No messages found' });
        }

        io.emit('messageAPP', { chat });
        res.status(200).json({ success: true, chat });

    } catch (error) {
        console.error("Error in fetchChatData:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});













export { chat, getSendingMessage, getUserChat, getReceivingMessage, messageRemove, chatData }