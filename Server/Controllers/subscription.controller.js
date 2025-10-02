import mongoose from "mongoose";
import { Subscription } from "../Models/subscription.model.js";
import { asyncHandler } from "../utils/asynceHandler.js"
import { apiError } from "../utils/errorHandler.js"
import { apiResponse } from "../utils/responseHandler.js";

// subscribe to channel
const toggleSubscription = asyncHandler(async (req, res) => {
    // get channel id form url
    const { channelId } = req.params
    const userId = req.user?._id

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid Channel Id")
    }

    if (channelId.toString() === userId.toString()) {
        throw new apiError(400, "You can't subscribe yourself")
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        follower: userId
    })


    if (!existingSubscription) {
        const newSubscription = await Subscription.create({
            channel: channelId,
            follower: userId
        })

        if (!newSubscription) {
            throw new apiError(500, "Error subscribing to channel")
        }

        const populateSubscription = await Subscription.findById(newSubscription?._id)
            .populate("follower", "userName fullName avatar")
            .populate("channel", "userName fullName avatar")
            .lean()

        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    populateSubscription,
                    "Channel Subscribed Successfully"
                )
            )
    }

    else {
        const unSubscribe = await Subscription.findByIdAndDelete(existingSubscription?._id)

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    null,
                    "Channel Unsubscribed Successfully"
                )
            )
    }
})

// get all subscribers
const getAllSubscriber = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const getAllSubscriberCount = await Subscription.find(
        { channel: userId }
    ).populate("follower", "userName fullName avatar")


    if (!getAllSubscriberCount) {
        throw new apiError(500, "Something went wrong while fetching subscribers")
    }

    const subcriberDetails = getAllSubscriberCount.map((sub) => sub.follower)


    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    subcriberDetails,
                    totalSubscribers: getAllSubscriberCount.length,
                },
                "Fetched All Subscribers Successfully"
            )
        )
})

// get user followings
const getUserfollowings = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    let getUserfollowingTo = await Subscription.find({ follower: userId })
        .populate("channel", "userName fullName avatar")

    if (!getUserfollowingTo) {
        throw new apiError(500, "Something went wrong while get your followings")
    }

    const channelDetails = getUserfollowingTo.length > 0 ? getUserfollowingTo.map((ch) => ch.channel) : "You are not following to anyone"

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    followingToChannels: channelDetails,
                    totalFollowings: getUserfollowingTo.length
                },
                "Fetched all user followings"
            )
        )
})

export {
    toggleSubscription,
    getAllSubscriber,
    getUserfollowings
}