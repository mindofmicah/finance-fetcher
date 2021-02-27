import {DaveForm} from "@/classes/Forms/DaveForm";

export class ROICForm extends DaveForm {
    name = 'ROIC';

    rows(): any[][] {

        const incomeStatement = this.financials.statement('Income Statement');
        const balanceSheet = this.financials.statement('Balance Sheet');

        const ebit = parseFloat(String(incomeStatement.item('EBIT').value));
        const taxes = parseFloat(String(incomeStatement.item('Income Taxes').value));
        const equity = parseFloat(String(balanceSheet.item('Share Holder Equity').value));
        const debt = parseFloat(String(balanceSheet.item('Long Term Debt').value));
        const roic = ((ebit - taxes) / (equity + debt) * 100).toFixed(2) + '%';

        return [
            ['EBIT', ebit],
            ['Taxes', taxes],
            ['Equity', equity],
            ['Debt', debt],
            ['ROIC', roic],

        ]
    }
}