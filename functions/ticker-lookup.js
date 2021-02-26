const fetch = require('node-fetch').default;

const handler = async (event) => {
    try {
        const ticker = event.queryStringParameters.ticker;
        const financial_statements = [];
        const statements = [
            {name: 'Income Statement', slug: 'income-statement'},
            {name: 'Balance Sheet', slug: 'balance-sheet'},
            {name: 'Cash Flow Statement', slug: 'cash-flow-statement'},
        ];
        for (const financial_statement of statements) {

            const data = await fetch(`https://www.macrotrends.net/stocks/charts/${ticker}/${ticker}/${financial_statement.slug}`);
            const body_text = await data.text();

            const statement_data = {
                name: financial_statement.name,
            };
            statement_data.items = JSON.parse(body_text.match(/var originalData = (\[.+?\])/)[1]).map(current => {
                let {field_name, popup_icon, ...dates} = current;
                let name = field_name.match(/>(.+?)</)[1];
                return {
                    name,
                    values: Object.entries(dates).map(data => {
                        const [date, value] = data;
                        return {date, value};
                    })
                }
            }, {});

            financial_statements.push(statement_data);

        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: {
                    financial_statements
                }
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
