import {FinancialStatement} from "@/classes/FinancialStatement";

export class FinancialStatementCollection {
    items: FinancialStatement[];

    constructor(items: FinancialStatement[] = []) {
        this.items = items;
    }

    statement(name): FinancialStatement {
        for (const s of this.items) {
            if (name === s.name) {
                return s;
            }
        }
        return null;
    }
}