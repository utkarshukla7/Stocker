import { set } from "mongoose";
import userCompaniesModel from "../models/userCompaniesModel.js";
import fetch from "node-fetch";

export const dashboardController = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    // console.log(req.body);
    const apicall = async (req_type, sym) => {
      // console.log(sym)
      var url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${sym}`;
      if (req_type == 1) {
        url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${sym}`;
      }
      if (req_type == 2) {
        url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${sym}/1d`;
      }
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API,
          "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result)
        return result;
      } catch (error) {
        console.error(error);
      }
    };
    const followobj = await userCompaniesModel
      .find({ saveType: 1, email: email })
      .exec();
    const portfoliobj = await userCompaniesModel
      .find({ saveType: 2, email: email })
      .exec();
    const followList = [];
    var symbol_list = "";

    // console.log(portfoliobj);
    // creating a string of symbols to get the  endquote data of all the followed companies together ;)
    for (var key in followobj) {
      var x = followobj[key];
      var temp = x.companySymbol;
      if (x.companyExchange === "BSE") {
        temp += "." + "BO";
      }
      if (x.companyExchange === "NSE") {
        temp += "." + "NS";
      }
      if (symbol_list.length) {
        symbol_list += "," + temp;
      } else {
        symbol_list = temp;
      }
    }
    let completeQuote = await apicall(1, symbol_list);
    let QuoteList = {};
    for (let i in completeQuote) {
      // console.log(completeQuote[i])
      let obj = completeQuote[i];
      let symb = "";
      for (let a in obj.symbol) {
        if (obj.symbol[a] === ".") {
          break;
        }
        symb += obj.symbol[a];
      }
      QuoteList[symb] = {
        price: obj.regularMarketPrice,
        change: obj.regularMarketChange,
        changePercent: obj.regularMarketChangePercent,
      };
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
      };
      followList.push(temp);
    }
    function convertDateFormat(dateString) {
      const parts = dateString.split("-");
      const mm = parts[0];
      const dd = parts[1];
      const yyyy = parts[2];

      return `${yyyy}-${mm}-${dd}`;
    }

    const convertUTC = (date) => {
      const dateString = date; // Date without time component
      const defaultTime = "00:00:00"; // Default time value
      const dateTimeString = `${dateString}T${defaultTime}`;
      const unixTimestamp = Date.parse(dateTimeString) / 1000;

      return unixTimestamp;
    };

    const Portfoliolist = [];
    let dateValueArray = [];
    let dateArray = [];
    let userTotalInvestment = 0;
    let GainerLooserArray = [];
    let namelist = [];
    let investmentlist = [];
    //creating the portfoliolist
    for (var key in portfoliobj) {
      var x = portfoliobj[key];
      var temp = x.companySymbol;
      if (x.companyExchange === "BSE") {
        temp += "." + "BO";
      }
      if (x.companyExchange === "NSE") {
        temp += "." + "NS";
      }

      let result = await apicall(2, temp);
      result = result.items;
      let last100Items = [];
      let keys = Object.keys(result);
      let len = keys.length;
      for (let i = len - 100; i < len; i++) {
        let q = keys[i];
        last100Items.push({
          date: result[q].date,
          date_utc: result[q].date_utc,
          open: result[q].open,
        });
      }

      const stockBought = x.stockdata;
      let ind = 0;
      let compData = [],
        compTotalProfit = 0,
        compTotalStocks = 0,
        compTotalInvestment = 0,
        price = 0;

      for (let i of last100Items) {
        if (i.open === 0) {
          continue;
        }

        while (
          ind < stockBought.length &&
          convertUTC(stockBought[ind].dateBought) <=
            convertUTC(convertDateFormat(i.date))
        ) {
          compTotalInvestment += stockBought[ind].stockPrice;
          compTotalStocks += stockBought[ind].stockNumber;
          ind += 1;
        }
        compData.push({
          time: convertDateFormat(i.date),
          value: parseInt(compTotalInvestment),
        });
        price = i.open;
      }
      let compDataModified = [];
      let flag = false;
      let compDateValue = {};
      for (let i in compData) {
        if (compData[i].value != 0 || flag) {
          compDataModified.push(compData[i]);
          flag = true;
          compDateValue[compData[i].time] =
            x.companyExchange === "NSE" || x.companyExchange === "BSE"
              ? compData[i].value
              : compData[i].value * 82;
          if (!dateArray.includes(compData[i].time)) {
            dateArray.push(compData[i].time);
          }
        }
      }

      dateValueArray.push(compDateValue);
      compTotalProfit = compTotalStocks * price - compTotalInvestment;
      GainerLooserArray.push([compTotalProfit, x.companyName]);

      Portfoliolist.push({
        name: x.companyName,
        symbol: x.companySymbol,
        exchange: x.companyExchange,
        compTotalProfit: compTotalProfit,
        compTotalInvestment: compTotalInvestment,
        compTotalStocks: compTotalStocks,
        compData: compDataModified,
        price: price,
      });
      namelist.push(x.companyName);
      investmentlist.push(compTotalInvestment);
    }
    // console.log(dateValueArray);
    // dateArray = [...Set(dateArray)];
    // console.log(dateArray);
    dateArray.sort();
    GainerLooserArray.sort(function (a, b) {
      return a[0] - b[0];
    });
    let gainer = [];
    let looser = [];
    let n = GainerLooserArray.length;
    // console.log(GainerLooserArray);
    for (let i = 0; i < Math.min(5, n); i++) {
      looser.push(GainerLooserArray[i]);
      gainer.push(GainerLooserArray[n - i - 1]);
    }
    // console.log(dateArray)
    let userCompleteGraphData = [];
    for (let i in dateArray) {
      let sum = 0;
      for (let obj of dateValueArray) {
        sum += obj[dateArray[i]] ? obj[dateArray[i]] : 0;
      }
      userCompleteGraphData.push({ time: dateArray[i], value: sum });

      userTotalInvestment = sum;
    }

    // console.log(userCompleteGraphData)
    // console.log(gainer, looser);
    // console.log(namelist, investmentlist);
    res.status(200).send({
      success: true,
      message: "congress",
      followList: followList,
      Portfoliolist: Portfoliolist,
      userCompleteGraphData: userCompleteGraphData,
      userTotalInvestment: userTotalInvestment,
      gainer: gainer,
      looser: looser,
      namelist: namelist,
      investmentlist: investmentlist,
      ok: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong",
      ok: false,
      error,
    });
  }
};
