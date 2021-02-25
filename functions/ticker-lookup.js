const fetch = require('node-fetch').default;
const slugify = require('slugify');

const slugMe = string => {
    return slugify(string, {
        replacement: '_',
        lower: true,
    }).replace(/-/g, '_')
};
const handler = async (event) => {

    try {
        const ticker = event.queryStringParameters.ticker;
        const financial_data = {};
        for (const financial_statement of ['income-statement', 'balance-sheet', 'cash-flow-statement']) {

            const data = await fetch(`https://www.macrotrends.net/stocks/charts/${ticker}/${ticker}/${financial_statement}`);
            const body_text = await data.text();

            const response_data = JSON.parse(body_text.match(/var originalData = (\[.+?\])/)[1]).reduce((carry, current, index) => {
                let {field_name, popup_icon, ...dates} = current;
                let label = field_name.match(/>(.+?)</)[1];
                carry[slugMe(label)] = ({
                    position: index,
                    label,
                    values: Object.entries(dates).map(data => {
                        const [date, value] = data;
                        return {date, value};
                    })
                });
                return carry;
            }, {});
            financial_data[slugMe(financial_statement, '_')] = response_data;

        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                financial_data

            }),
            // // more keys you can return:
            headers: {"Content-Type": "application/json"},
            // isBase64Encoded: true,
        }
    } catch (error) {
        return {statusCode: 500, body: error.toString()}
    }
}

module.exports = {handler}
