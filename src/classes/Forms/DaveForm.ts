import {FinancialStatementCollection} from "@/classes/FinancialStatementCollection";

export class DaveForm {
    _headings = ['Property', 'Value'];
    financials: FinancialStatementCollection;

    constructor(financials: FinancialStatementCollection) {
        this.financials = financials;
    }

    get headings() {
        return this._headings;
    }

    rows(): any[][] {
        return [];
    }
}