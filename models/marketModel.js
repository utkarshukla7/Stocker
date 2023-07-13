import mongoose from "mongoose";


const marketSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        closeVal: {
            type: [Number],
            required: true,
        },
        time: {
            type: [String],
            required: true
        },
        date: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('marketData', marketSchema);