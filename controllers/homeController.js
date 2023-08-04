import fetch from "node-fetch";

export const homeController = async (req, res) => {
  try {
    //news
    const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_DATA_API}&q=indian%20stock%20market`;
    const response = await fetch(url);
    var data = await response.json();

    var t = data.results;

    var final = [];
    for (var i = 0; i < 10; i++) {
      const temp = {
        title: t[i].title,
        link: t[i].link,
        image: t[i].image_url,
        description: t[i].description,
        source: t[i].source_name,
        date: t[i].date,
      };
      final.push(temp);
    }

    res.status(201).send({
      success: true,
      message: "user registered succesfully ",
      final,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong!!",
      error,
    });
  }
};

export const indexController = async (req, res) => {
  try {
    const ind = ["NSEI", "BSESN", "NDX", "SPX", "DJI"];
    let full_data = [];

    function convertDateFormat(dateString) {
      const parts = dateString.split("-");
      const mm = parts[0];
      const dd = parts[1];
      const yyyy = parts[2];

      return `${yyyy}-${mm}-${dd}`;
    }

    for (let i = 0; i < 3; i++) {
      const url1 = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/%5E${ind[i]}/1d?diffandsplits=false`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API,
          "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url1, options);
        let result = await response.json();
        const graph_data = [];

        result = result.items;
        let ke = Object.keys(result);
        let len = ke.length;
        for (let j = len - 500; j < len; j++) {
          let obj = result[ke[j]];
          const milsec = parseInt(ke[j], 10) * 1000;
          const dateObject = new Date(milsec);
          const year = dateObject.getFullYear();
          const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
          const day = dateObject.getDate().toString().padStart(2, "0");
          let date = `${year}-${month}-${day}`;
          graph_data.push({
            time: date,
            value: obj.close,
          });
        }

        full_data.push(graph_data);
        // console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
    console.log(full_data.length);
    res.status(201).send({
      success: true,
      message: "indexes fetched succesfully",
      full_data: full_data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong in loading indexes",
      error,
    });
  }
};
