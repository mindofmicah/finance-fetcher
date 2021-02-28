import {RateOfReturnForm} from "@/classes/Forms/RateOfReturnForm";

export class CashFlowForm extends RateOfReturnForm {
    name = 'Free Cash Flow';

    get headings() {
        return [   'Time Period', 'OCF', 'PP&E', 'FCF', 'Rate of Return']
    }

    rows(): any[][] {
        return this.calculateRateValues((index: number) => {
            const statement = this.financials.statement('Cash Flow Statement');
            const ocf = statement.item('Cash Flow From Operating Activities', index).value;
            const ppe = Math.abs(statement.item('Net Change In Property, Plant, And Equipment', index).value);
            const fcf = ocf - ppe;

            return [
                ocf, ppe, fcf
            ];
        });
    }
}