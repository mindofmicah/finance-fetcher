const fetch = require('node-fetch').default;
const handler = async (event) => {
    try {
        const ticker = event.queryStringParameters.ticker;
        const property = event.queryStringParameters.property;


        // const data = await fetch(`https://www.macrotrends.net/assets/php/popup_fundamental.php?t=${ticker}&s=${property}&freq=A&statement=income-statement`);
        const data = await fetch(`https://www.macrotrends.net/stocks/charts/${ticker}/world-wrestling-entertainment/income-statement`);
        const body_text = await data.text();
        // const ddd = JSON.parse(body_text.match(/var chartData = (\[.+?\])/)[1]);
        const ddd = JSON.parse(body_text.match(/var originalData = (\[.+?\])/)[1]);

        // const ddd = [
        //     {
        //         "date": "2011-12-31",
        //         "v1": 483.921
        //     },
        //     {
        //         "date": "2012-12-31",
        //         "v1": 484.013
        //     },
        //     {
        //         "date": "2013-12-31",
        //         "v1": 507.97
        //     },
        //     {
        //         "date": "2014-12-31",
        //         "v1": 542.62
        //     },
        //     {
        //         "date": "2015-12-31",
        //         "v1": 658.768
        //     },
        //     {
        //         "date": "2016-12-31",
        //         "v1": 729.216
        //     },
        //     {
        //         "date": "2017-12-31",
        //         "v1": 800.959
        //     },
        //     {
        //         "date": "2018-12-31",
        //         "v1": 930.16
        //     },
        //     {
        //         "date": "2019-12-31",
        //         "v1": 960.442
        //     },
        //     {
        //         "date": "2020-12-31",
        //         "v1": 974.207
        //     }
        // ]

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: ddd
            })
            // // more keys you can return:
            // headers: { "headerName": "headerValue", ... },
            // isBase64Encoded: true,
        }
    } catch (error) {
        return {statusCode: 500, body: error.toString()}
    }
}

module.exports = {handler}
