import fetch from "node-fetch";


export const homeController = async (req, res) => {
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_DATA_API}&q=indian%20stock%20market`


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
            }
            final.push(temp);
        }
        console.log("hello")
        res.status(201).send({
            success: true,
            message: 'user registered succesfully ',
            final,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'something went wrong!!',
            error,
        });
    }
};