import userCompaniesModel from "../models/userCompaniesModel.js";
import fetch from "node-fetch";


export const dashboardController = async (req, res) => {
    try {
        const { email } = req.body;
        const apicall = async (req_type, sym) => {
            // console.log(sym)
            var url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${sym}`
            if (req_type == 1) {
                url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${sym}`
            }
            if (req_type == 2) {
                url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${sym}/1d`
            }
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPID_API,
                    'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
                }
            };

            try {

                const response = await fetch(url, options);
                const result = await response.json();
                // console.log(result)
                return result;
            } catch (error) {
                console.error(error);
            }
        }
        const followobj = await userCompaniesModel.find({ saveType: 1, email: email }).exec();
        const portfoliobj = await userCompaniesModel.find({ saveType: 2, email: email }).exec();
        const followList = []
        var symbol_list = ''


        // creating a string of symbols to get the  endquote data of all the followed companies together ;)
        for (var key in followobj) {
            var x = followobj[key];
            var temp = x.companySymbol
            if (x.companyExchange === 'BSE') {
                temp += '.' + 'BO'
            }
            if (x.companyExchange === 'NSE') {
                temp += '.' + 'NS'
            }
            if (symbol_list.length) {
                symbol_list += ',' + temp;
            }
            else {
                symbol_list = temp
            }

        }
        let completeQuote = await apicall(1, symbol_list);
        let QuoteList = {}
        for (let i in completeQuote) {
            // console.log(completeQuote[i])
            let obj = completeQuote[i]
            let symb = ''
            for (let a in obj.symbol) {
                if (obj.symbol[a] === '.') {
                    break
                }
                symb += obj.symbol[a];
            }
            QuoteList[symb] = { price: obj.regularMarketPrice, change: obj.regularMarketChange, changePercent: obj.regularMarketChangePercent }
        }

        //creating follow list
        for (var key in followobj) {
            var x = followobj[key];
            var temp = {
                name: x.companyName,
                symbol: x.companySymbol,
                exchange: x.companyExchange,
                price: QuoteList[x.companySymbol].price,
                change: QuoteList[x.companySymbol].change,
                changePercent: QuoteList[x.companySymbol].changePercent,
            }
            followList.push(temp)
        }
        function convertDateFormat(dateString) {
            const parts = dateString.split('-');
            const mm = parts[0];
            const dd = parts[1];
            const yyyy = parts[2];

            return `${yyyy}-${mm}-${dd}`;
        }

        const convertUTC = (date) => {
            const dateString = date; // Date without time component
            const defaultTime = '00:00:00'; // Default time value
            const dateTimeString = `${dateString}T${defaultTime}`;
            const unixTimestamp = Date.parse(dateTimeString) / 1000;

            return unixTimestamp;
        }
        const Portfoliolist = []

        //creating the portfoliolist
        for (var key in portfoliobj) {
            var x = portfoliobj[key];
            var temp = x.companySymbol
            if (x.companyExchange === 'BSE') {
                temp += '.' + 'BO'
            }
            if (x.companyExchange === 'NSE') {
                temp += '.' + 'NS'
            }

            let result = await apicall(2, temp);
            result = result.items
            let last100Items = []
            let keys = Object.keys(result)
            let len = keys.length
            for (let i = (len - 100); i < len; i++) {
                let q = keys[i]
                last100Items.push({
                    date: result[q].date,
                    date_utc: result[q].date_utc,
                    open: result[q].open
                })
            }

            // console.log(last100Items)
            const stockBought = x.stockdata;
            let ind = 0;
            let compData = [], compTotalProfit = 0, compTotalStocks = 0, compTotalInvestment = 0;
            // console.log(stockBought)
            for (let i of last100Items) {
                if (i.open === 0) {
                    continue
                }

                while (ind < stockBought.length && convertUTC(stockBought[ind].dateBought) <= convertUTC(convertDateFormat(i.date))) {
                    compTotalInvestment += stockBought[ind].stockPrice;
                    compTotalStocks += stockBought[ind].stockNumber;
                    ind += 1;
                }
                compData.push({
                    time: convertDateFormat(i.date),
                    value: parseInt(compTotalInvestment),
                })
                compTotalProfit += compTotalStocks * i.open - compTotalInvestment
            }
            let compDataModified = [];
            let flag = false;
            for (let i in compData) {
                // console.log(i)
                if (compData[i].value != 0 || flag) {
                    compDataModified.push(compData[i]);
                    flag = true;
                }
            }
            Portfoliolist.push({
                name: x.companyName,
                symbol: x.companySymbol,
                exchange: x.companyExchange,
                compTotalProfit: compTotalProfit,
                compTotalInvestment: compTotalInvestment,
                compTotalStocks: compTotalStocks,
                compData: compDataModified
            })

            console.log(typeof Portfoliolist[0].compData[0].time)
        }





        res.status(200).send({
            success: true,
            message: "congress",
            followList: followList,
            Portfoliolist: Portfoliolist,
            ok: true,
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong",
            ok: false,
            error
        })
    }
}

