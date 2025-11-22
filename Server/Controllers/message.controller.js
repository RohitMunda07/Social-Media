// ============================================
// BACKEND: message.controller.js (UPDATED WITH BETTER DEBUGGING)
// ============================================
import { Chat } from "../Models/chat.model.js";
import { Message } from "../Models/Message.model.js";
import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js";
import { apiError } from "../utils/errorHandler.js";
import mongoose from "mongoose";
import { onlineUser } from "../Src/socket.js";

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

    console.log("\n========== 📤 SENDING MESSAGE ==========");
    console.log("Message:", populatedMessage._id);

    // ✅ GET IO FROM GLOBAL
    const io = global.ioInstance;
    console.log("✅ IO instance check:", !!io);
    console.log("📊 Online users:", onlineUser.size);
    console.log("📊 Users:", Array.from(onlineUser.keys()));

    if (io) {
        const receiverSocketId = onlineUser.get(selectedUser);
        const senderSocketId = onlineUser.get(senderId);

        console.log("📤 Receiver socket:", receiverSocketId);
        console.log("📤 Sender socket:", senderSocketId);

        if (receiverSocketId) {
            console.log("✅ Sending to receiver");
            io.to(receiverSocketId).emit("receive_message", populatedMessage);
        }

        if (senderSocketId) {
            console.log("✅ Sending to sender");
            io.to(senderSocketId).emit("message_sent", populatedMessage);
        }
    } else {
        console.error("❌ IO is null - use global.ioInstance");
    }

    console.log("========================================\n");

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




// GET ALL MESSAGES
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

// UPDATE MESSAGE
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
    const io = getio();
    if (io) {
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

// DELETE MESSAGE
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
    const io = getio();
    if (io) {
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

export { createMessage, getAllMessages, updateMessage, deleteMessage };





// previous code

// import { Chat } from "../Models/chat.model.js";
// import { Message } from "../Models/Message.model.js";
// import { asyncHandler } from "../utils/asynceHandler.js"
// import { apiResponse } from "../utils/responseHandler.js"
// import { apiError } from "../utils/errorHandler.js"
// import mongoose, { mongo } from "mongoose";
// import { getio } from "../Src/socket.js";
// import { onlineUser } from "../Src/socket.js";

// // create message
// // const createMessage = asyncHandler(async (req, res) => {
// //     // get the details
// //     const { senderId, textMessage, imageMessages, videoMessage, selectedUser } = req.body

// //     // validate details
// //     if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
// //         throw new apiError(400, "invalid or missing senderId")
// //     }

// //     if (!selectedUser || !mongoose.Types.ObjectId.isValid(selectedUser)) {
// //         throw new apiError(400, "invalid or missing selectedUser")
// //     }

// //     const noText = !textMessage || textMessage.length === 0
// //     const noImage = !imageMessages || imageMessages.length === 0
// //     const noVideo = !videoMessage || videoMessage.length === 0

// //     if (noText && noImage && noVideo) {
// //         throw new apiError(400, "you can't send an empty message")
// //     }

// //     // check existing chat room
// //     let ChatRoom = await Chat.findOne({
// //         members: { $all: [senderId, selectedUser] }
// //     })

// //     if (!ChatRoom) {
// //         ChatRoom = await Chat.create({
// //             members: [senderId, selectedUser]
// //         })
// //     }

// //     const chatId = ChatRoom?._id

// //     const newMessage = await Message.create({
// //         chatId,
// //         senderId,
// //         textMessage: textMessage || "",
// //         imageMessages: Array.isArray(imageMessages) ? imageMessages : [],
// //         videoMessage: Array.isArray(videoMessage) ? videoMessage : []
// //     })

// //     if (!newMessage) {
// //         throw new apiError(500, "something went wrong while creating new message")
// //     }

// //     // socket setup
// //     const io = getio();
// //     if (io) {
// //         const receiverSocketId = onlineUser.get(selectedUser)
// //         const senderSocketId = onlineUser.get(senderId)

// //         // message sent to receiver
// //         if (receiverSocketId) {
// //             io.to(receiverSocketId).emit("receive_message", newMessage)
// //         }

// //         if (senderSocketId) {
// //             io.to(senderSocketId).emit("message_sent", newMessage)
// //         }
// //     }


// //     // update last message in chat
// //     let preview = ""
// //     if (textMessage) preview = textMessage;
// //     else if (imageMessages?.length > 0) preview = "📷 Photo";
// //     else if (videoMessage?.length > 0) preview = "🎥 Video";

// //     await Chat.findByIdAndUpdate(chatId, {
// //         lastMessage: newMessage?._id,
// //         lastMessagePreview: preview
// //     })

// //     return res
// //         .status(201)
// //         .json(
// //             new apiResponse(
// //                 201,
// //                 newMessage,
// //                 "New Message Created Successfully"
// //             )
// //         )
// // })

// // create message
// const createMessage = asyncHandler(async (req, res) => {
//     const { senderId, textMessage, imageMessages, videoMessage, selectedUser } = req.body;

//     if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
//         throw new apiError(400, "invalid or missing senderId");
//     }

//     if (!selectedUser || !mongoose.Types.ObjectId.isValid(selectedUser)) {
//         throw new apiError(400, "invalid or missing selectedUser");
//     }

//     const noText = !textMessage || textMessage.length === 0;
//     const noImage = !imageMessages || imageMessages.length === 0;
//     const noVideo = !videoMessage || videoMessage.length === 0;

//     if (noText && noImage && noVideo) {
//         throw new apiError(400, "you can't send an empty message");
//     }

//     // check existing chat room
//     let ChatRoom = await Chat.findOne({
//         members: { $all: [senderId, selectedUser] }
//     });

//     if (!ChatRoom) {
//         ChatRoom = await Chat.create({
//             members: [senderId, selectedUser]
//         });
//     }

//     const chatId = ChatRoom?._id;

//     const newMessage = await Message.create({
//         chatId,
//         senderId,
//         textMessage: textMessage || "",
//         imageMessages: Array.isArray(imageMessages) ? imageMessages : [],
//         videoMessage: Array.isArray(videoMessage) ? videoMessage : []
//     });

//     if (!newMessage) {
//         throw new apiError(500, "something went wrong while creating new message");
//     }

//     // SOCKET EMIT FIXED
//     const io = getio();
//     if (io) {
//         const receiverSocketId = onlineUser.get(selectedUser);
//         const senderSocketId = onlineUser.get(senderId);

//         // send to receiver (real time update)
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("receive_message", newMessage);
//         }

//         // send confirmation to sender
//         if (senderSocketId) {
//             io.to(senderSocketId).emit("message_sent", newMessage);
//         }
//     }

//     // update last message preview
//     let preview = "";
//     if (textMessage) preview = textMessage;
//     else if (imageMessages?.length > 0) preview = "📷 Photo";
//     else if (videoMessage?.length > 0) preview = "🎥 Video";

//     await Chat.findByIdAndUpdate(chatId, {
//         lastMessage: newMessage?._id,
//         lastMessagePreview: preview
//     });

//     return res.status(201).json(
//         new apiResponse(
//             201,
//             newMessage,
//             "New Message Created Successfully"
//         )
//     );
// });


// // getAllMessages
// const getAllMessages = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 20, chatId } = req.query

//     if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
//         throw new apiError(400, "Invalid or Missing ChatId")
//     }

//     const normalizePageNo = Math.max(1, Number(page)) // page no
//     const normalizeLimit = Math.min(50, Number(limit))  // max document per page
//     const offset = (normalizePageNo - 1) * normalizeLimit // no of documents to skip

//     const allMessages = await Message.find({ chatId })
//         .populate("senderId", "userName fullName avatar")
//         .sort({ createAt: -1 })
//         .skip(offset)
//         .limit(normalizeLimit)

//     if (allMessages.length === 0) {
//         throw new apiError(404, "no messages found")
//     }

//     const totalMessages = await Message.countDocuments({ chatId })

//     return res
//         .status(200)
//         .json(
//             new apiResponse(
//                 200,
//                 {
//                     allMessages,
//                     pagination: {
//                         totalMessages: Math.ceil(totalMessages / normalizeLimit),
//                         currentPageNo: normalizePageNo,
//                         hasPreviousPage: normalizePageNo > 1,
//                         nextPage: normalizePageNo < Math.ceil(totalMessages / normalizeLimit)
//                     }
//                 },
//                 "Fetched All Messages Successfully"
//             )
//         )

// })

// // updateMessage
// const updateMessage = asyncHandler(async (req, res) => {
//     const { messageId } = req.params
//     const { senderId, selectedUser, textMessage } = req.body

//     if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
//         throw new apiError(400, "Invalid or Missing ChatId")
//     }
//     if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
//         throw new apiError(400, "Invalid or Missing ChatId")
//     }

//     const updatedMessage = await Message.findByIdAndUpdate(
//         messageId,
//         {
//             textMessage
//         },
//         {
//             new: true
//         }
//     ).populate("senderId", "userName fullName avatar")

//     if (!updatedMessage) {
//         throw new apiError(500, "Error while Editing Message")
//     }

//     // socket setup
//     const io = getio();
//     if (io) {
//         const receiverSocketId = onlineUser.get(selectedUser)
//         const senderSocketId = onlineUser.get(senderId)

//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("message_updated", updatedMessage)
//         }

//         if (senderSocketId) {
//             io.to(senderSocketId).emit("message_updated", updatedMessage)
//         }
//     }

//     return res
//         .status(200)
//         .json(
//             new apiResponse(
//                 200,
//                 updatedMessage,
//                 "Message Edited Successfully"
//             )
//         )
// })

// // delteMessage
// const deleteMessage = asyncHandler(async (req, res) => {
//     const { messageId } = req.params
//     const { senderId, selectedUser } = req.body; // you MUST send this from frontend

//     if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
//         throw new apiError(400, "Invalid or Missing ChatId")
//     }

//     const deletedMessage = await Message.findByIdAndDelete(messageId)

//     if (!deletedMessage) {
//         throw new apiError(500, "Error while deleting the message")
//     }

//     // socket setup
//     const io = getio();
//     if (io) {
//         const receiverSocketId = onlineUser.get(selectedUser)
//         const senderSocketId = onlineUser.get(senderId)

//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("message_deleted", deletedMessage)
//         }

//         if (senderSocketId) {
//             io.to(senderSocketId).emit("message_deleted", deletedMessage)
//         }
//     }

//     return res
//         .status(200)
//         .json(
//             new apiResponse(
//                 200,
//                 {},
//                 "Chat deleted Successfully"
//             )
//         )

// })

// export {
//     createMessage,
//     getAllMessages,
//     updateMessage,
//     deleteMessage
// }