import mongoose from "mongoose";


const symbolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        symbol: {
            type: String,
            required: true,
            trim: true
        },
        exchange: {
            type: String,
            required: true,
            trim: true
        }
    }, { versionKey: false }
);

export default mongoose.model('symbols', symbolSchema);