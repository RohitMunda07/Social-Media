// ============================================
// message.controller.js (USE GLOBAL.ONLINEUSER)
// ============================================
import { Chat } from "../Models/chat.model.js";
import { Message } from "../Models/Message.model.js";
import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js";
import { apiError } from "../utils/errorHandler.js";
import mongoose from "mongoose";

// Find or Create ChatId
const findOrCreateChatId = asyncHandler(async (req, res) => {
    const { senderId, selectedUser } = req.query
    if (!senderId || !selectedUser) {
        throw new apiError(400, "SenderId or selectedUser missing")
    }

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(selectedUser)) {
        throw new apiError(400, "Invalid Sender or Receiver Id")
    }

    let chat = null;
    chat = await Chat.findOne({
        members: { $all: [senderId, selectedUser] }
    })

    if (!chat) {
        chat = await Chat.create({
            members: [senderId, selectedUser],
            lastMessage: null,
            lastMessagePreview: ""
        })
    } else {
        console.log("Got the existing chatId", chat?._id);
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                chat?._id,
                "Fetch chat id successfully"
            )
        )
})

// Create Message
const createMessage = asyncHandler(async (req, res) => {
    const { senderId, textMessage, imageMessages, videoMessage, selectedUser } = req.body;

    // Validation
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
        throw new apiError(400, "Invalid or missing senderId");
    }

    if (!selectedUser || !mongoose.Types.ObjectId.isValid(selectedUser)) {
        throw new apiError(400, "Invalid or missing selectedUser");
    }

    const noText = !textMessage || textMessage.length === 0;
    const noImage = !imageMessages || imageMessages.length === 0;
    const noVideo = !videoMessage || videoMessage.length === 0;

    if (noText && noImage && noVideo) {
        throw new apiError(400, "You can't send an empty message");
    }

    // Create or find chat room
    let ChatRoom = await Chat.findOne({
        members: { $all: [senderId, selectedUser] }
    });

    if (!ChatRoom) {
        ChatRoom = await Chat.create({
            members: [senderId, selectedUser]
        });
    }

    const chatId = ChatRoom._id;

    // Create message
    const newMessage = await Message.create({
        chatId,
        senderId,
        textMessage: textMessage || "",
        imageMessages: Array.isArray(imageMessages) ? imageMessages : [],
        videoMessage: Array.isArray(videoMessage) ? videoMessage : []
    });

    if (!newMessage) {
        throw new apiError(500, "Error creating message");
    }

    // Populate sender info
    const populatedMessage = await Message.findById(newMessage._id).populate(
        "senderId",
        "userName fullName avatar"
    );

    console.log("\n========== 📤 SOCKET EMIT ==========");
    console.log("✅ Message created:", populatedMessage._id);
    console.log("   From:", senderId);
    console.log("   To:", selectedUser);

    // ✅ USE GLOBAL.IOINSTANCE AND GLOBAL.ONLINEUSER
    const io = global.ioInstance;
    const onlineUser = global.onlineUser;

    console.log("\n🔌 Socket Status:");
    console.log("   IO exists:", !!io);
    console.log("   OnlineUser exists:", !!onlineUser);
    console.log("   OnlineUser is Map:", onlineUser instanceof Map);
    console.log("   OnlineUser size:", onlineUser ? onlineUser.size : 0);

    if (onlineUser && onlineUser.size > 0) {
        console.log("   Online users:", Array.from(onlineUser.entries()));
    }

    if (io && onlineUser) {
        const receiverSocketId = onlineUser.get(selectedUser);
        const senderSocketId = onlineUser.get(senderId);

        console.log("\n📤 Socket Lookup:");
        console.log("   Receiver ID:", selectedUser, "→ Socket:", receiverSocketId);
        console.log("   Sender ID:", senderId, "→ Socket:", senderSocketId);

        if (receiverSocketId) {
            console.log("\n✅ Emitting 'receive_message' to receiver");
            io.to(receiverSocketId).emit("receive_message", populatedMessage);
        } else {
            console.log("\n⚠️  Receiver not online");
        }

        if (senderSocketId) {
            console.log("✅ Emitting 'message_sent' to sender");
            io.to(senderSocketId).emit("message_sent", populatedMessage);
        } else {
            console.log("⚠️  Sender socket not found");
        }
    } else {
        console.error("\n❌ IO or OnlineUser not available!");
    }

    console.log("====================================\n");

    // Update last message preview
    let preview = "";
    if (textMessage) preview = textMessage;
    else if (imageMessages?.length > 0) preview = "📷 Photo";
    else if (videoMessage?.length > 0) preview = "🎥 Video";

    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: newMessage._id,
        lastMessagePreview: preview
    });

    return res.status(201).json(
        new apiResponse(201, populatedMessage, "Message created successfully")
    );
});

// Get All Messages
const getAllMessages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, chatId } = req.query;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
        throw new apiError(400, "Invalid or missing chatId");
    }

    const normalizePageNo = Math.max(1, Number(page));
    const normalizeLimit = Math.min(50, Number(limit));
    const offset = (normalizePageNo - 1) * normalizeLimit;

    const allMessages = await Message.find({ chatId })
        .populate("senderId", "userName fullName avatar")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(normalizeLimit);

    if (allMessages.length === 0) {
        throw new apiError(404, "No messages found");
    }

    const totalMessages = await Message.countDocuments({ chatId });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                allMessages,
                pagination: {
                    totalMessages: Math.ceil(totalMessages / normalizeLimit),
                    currentPageNo: normalizePageNo,
                    hasPreviousPage: normalizePageNo > 1,
                    nextPage: normalizePageNo < Math.ceil(totalMessages / normalizeLimit)
                }
            },
            "Fetched all messages successfully"
        )
    );
});

// Update Message
const updateMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { senderId, selectedUser, textMessage } = req.body;

    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
        throw new apiError(400, "Invalid or missing senderId");
    }

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
        throw new apiError(400, "Invalid or missing messageId");
    }

    const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { textMessage },
        { new: true }
    ).populate("senderId", "userName fullName avatar");

    if (!updatedMessage) {
        throw new apiError(500, "Error updating message");
    }

    // Socket emit
    const io = global.ioInstance;
    const onlineUser = global.onlineUser;

    if (io && onlineUser) {
        const receiverSocketId = onlineUser.get(selectedUser);
        const senderSocketId = onlineUser.get(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_updated", updatedMessage);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("message_updated", updatedMessage);
        }
    }

    return res.status(200).json(
        new apiResponse(200, updatedMessage, "Message updated successfully")
    );
});

// Delete Message
const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { senderId, selectedUser } = req.body;

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
        throw new apiError(400, "Invalid or missing messageId");
    }

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
        throw new apiError(500, "Error deleting message");
    }

    // Socket emit
    const io = global.ioInstance;
    const onlineUser = global.onlineUser;

    if (io && onlineUser) {
        const receiverSocketId = onlineUser.get(selectedUser);
        const senderSocketId = onlineUser.get(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_deleted", deletedMessage);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("message_deleted", deletedMessage);
        }
    }

    return res.status(200).json(
        new apiResponse(200, {}, "Message deleted successfully")
    );
});

export { findOrCreateChatId, createMessage, getAllMessages, updateMessage, deleteMessage };
