import userCompaniesModel from "../models/userCompaniesModel.js";


export const dashboardController = async (req, res) => {
    const { email } = req.body;
    const followList = await userCompaniesModel.find({ saveType: 1, email: email }).exec();
    console.log(followList)
    res.status(200).send({
        success: true,
        message: "congress",
        ok: true,
    })
}

