const fetch = require('node-fetch').default;
const handler = async (event) => {
    try {
        const ticker = event.queryStringParameters.ticker;
        const property = event.queryStringParameters.property;

        const data = await fetch(`https://www.macrotrends.net/assets/php/popup_fundamental.php?t=${ticker}&s=${property}&freq=A&statement=income-statement`);
        const body_text = await data.text();

        const ddd = JSON.parse(body_text.match(/var chartData = (\[.+?\])/)[1]);

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
