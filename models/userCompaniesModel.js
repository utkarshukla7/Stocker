import mongoose from "mongoose";

const userCompanySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },
        companySymbol: {
            type: String,
            required: true,
            trim: true
        },
        companyExchange: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        saveType: {
            type: Number,
            required: true
        },
        stockdata: [
            {
                stockNumber: {
                    type: Number
                },
                stockPrice: {
                    type: Number
                },
                dateBought: {
                    type: String,
                }
            }
        ]

    },
    { timestamps: true }
);

export default mongoose.model('userCompanies', userCompanySchema);