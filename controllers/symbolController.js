import { set } from 'mongoose';
import symbolModel from '../models/symbolModel.js'

const symbolController = async (req, res) => {
    try {
        const { query, querytype } = req.body;
        if (querytype == 1) {
            const help = { name: { $regex: `^${query}`, $options: 'i' } }
            const result = await symbolModel.find(help).exec();
            const fin = [];
            const fullInfo = {};
            function isAlphabetical(str) {
                const alphabeticRegex = /^[a-zA-Z]+$/;
                return alphabeticRegex.test(str);
            }
            for (var i = 0; i < Math.min(10, result.length); i++) {
                // console.log((result[i]['symbol']))
                if (isAlphabetical(result[i]['symbol']) == true) {
                    // console.log(isAlphabetical(result[i]['name']['symbol']))
                    fin.push(result[i]['name']);
                    var s = result[i]['name']
                    fullInfo[s] = { exchange: result[i]['exchange'], symbol: result[i]['symbol'] }
                }
            }
            // console.log(fin)
            const uniqueList = Array.from(new Set(fin));
            res.status(200).send({
                success: true,
                data: uniqueList,
                fullData: fullInfo,
            })
        }
        else {
            const result = await symbolModel.find(query).exec();
            console.log(query, result);

            res.status(200).send({
                success: true,
                data: result[0],
            })
        }


    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "something went wrong",
            error,
        })
    }
}

export default symbolController

