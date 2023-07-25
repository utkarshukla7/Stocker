import fetch from "node-fetch";
import userCompaniesModel from "../models/userCompaniesModel.js";

export const infoController = async (req, res) => {
  try {
    const { compId } = req.body;
    // console.log(url)
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${compId}&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_API}`;
    const response = await fetch(url);
    var data = await response.json();
    var fin = [];
    // console.log(data);
    for (var key in data["Time Series (Daily)"]) {
      const dateString = key;
      const date = new Date(dateString);
      const unixTimestamp = Math.floor(date.getTime() / 1000);
      var temp = {
        time: key,
        open: parseFloat(data["Time Series (Daily)"][key]["1. open"]),
        high: parseFloat(data["Time Series (Daily)"][key]["2. high"]),
        low: parseFloat(data["Time Series (Daily)"][key]["3. low"]),
        close: parseFloat(data["Time Series (Daily)"][key]["4. close"]),
      };
      fin.push(temp);
    }
    const rev_fin = fin.reverse();
    const url2 = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${compId}&apikey=${process.env.ALPHA_VANTAGE_API}`;
    const response2 = await fetch(url2);
    var data2 = await response2.json();
    // console.log(data2['Global Quote']['05. price'])
    var fin2 = {
      price: data2["Global Quote"]["05. price"],
      change: data2["Global Quote"]["10. change percent"],
      trading_day: data2["Global Quote"]["07. latest trading day"],
    };
    // console.log(fin2);
    // console.log(rev_fin);
    res.status(200).send({
      success: true,
      data: rev_fin,
      quoteData: fin2,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

export const followController = async (req, res) => {
  try {
    const req_body = req.body;
    // console.log(req_body)
    if (req_body.saveType == 1) {
      const { companyName, companySymbol, companyExchange, email, saveType } =
        req_body;
      const existingUser = await userCompaniesModel.findOne({
        companyName,
        companySymbol,
        companyExchange,
        email,
        saveType,
      });

      if (existingUser) {
        return res.status(200).send({
          success: false,
          message: "You are already following this stock !",
        });
      }
      // console.log({ companyName, companySymbol, companyExchange, email, saveType })
      const entry = await new userCompaniesModel({
        companyName,
        companySymbol,
        companyExchange,
        email,
        saveType,
      }).save();
    } else if (req_body.saveType == 2) {
      const {
        companyName,
        companySymbol,
        companyExchange,
        email,
        saveType,
        stockdata,
      } = req_body;
      const existingUser = await userCompaniesModel.findOne({
        companyName,
        companySymbol,
        companyExchange,
        email,
        saveType,
      });

      if (existingUser) {
        existingUser.stockdata.push(stockdata);
        await existingUser.save();
        return res.status(200).send({
          success: true,
          message: "Stock data updated successfully.",
        });
      }
      const entry = await new userCompaniesModel({
        companyName,
        companySymbol,
        companyExchange,
        email,
        saveType,
        stockdata,
      }).save();
    } else if (req_body.saveType === 3) {
      const { companyName, companyExchange, email } = req_body;
      const del = await userCompaniesModel.deleteOne({
        companyName,
        companyExchange,
        email,
      });
      // console.log(del);
      if (del.acknowledged) {
        return res.status(200).send({
          success: true,
          message: "successfuly removed",
        });
      } else {
        return res.status(200).send({
          success: false,
          message: "couldnt remove",
        });
      }
    }
    // console.log("oi")
    res.status(201).send({
      success: true,
      message: "data added successfuly",
    });
  } catch (error) {
    res.status(500).send({
      error,
      success: false,
      message: "something went wrong!",
    });
  }
};
