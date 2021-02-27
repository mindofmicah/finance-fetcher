type FinancialValue = {
    date: string;
    value: number;
};

type FinancialStatementItem = {
    name: string;
    values: FinancialValue[];
}

export class FinancialStatement {
    items: FinancialStatementItem[];
    name: string;

    constructor(name, items) {
        this.name = name;
        this.items = items;
    }

    item(name: string, index = 0): FinancialValue {
        for (const item of this.items) {
            if (item.name === name) {
                return item.values[index];
            }
        }
    }
}