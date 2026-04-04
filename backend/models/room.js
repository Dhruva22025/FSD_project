import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true,
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        players: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                username: String,
            },
        ],

        status: {
            type: String,
            enum: ["waiting", "active"],
            default: "waiting",
        },
        problem: {
            title: String,
            description: String,
            testCases: [
                {
                    input: String,
                    output: String,
                },
            ],
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        }
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;