const fetch = require('node-fetch').default;
const handler = async (event) => {
    try {
        const ticker = event.queryStringParameters.ticker;
        const data = await fetch(`https://www.macrotrends.net/stocks/charts/${ticker}/${ticker}/income-statement`);
        const body_text = await data.text();

        const response_data = JSON.parse(body_text.match(/var originalData = (\[.+?\])/)[1]).map((current) => {
            const {field_name, popup_icon, ...dates} = current;
            return {
                label: field_name.match(/>(.+?)</)[1],
                dates
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: response_data
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
