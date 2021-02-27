import {DaveForm} from "@/classes/Forms/DaveForm";
import {RATE} from '@formulajs/formulajs';

export class RateOfReturnForm extends DaveForm {
    statement = '';
    value = '';
    heading = null;
    extraYears = [1, 3, 5, 10]

    get headings() {
        return ['Time Period', this.heading ?? this.value, 'Rate of Return']
    }

    rows(): any[][] {

        const statement1 = this.financials.statement(this.statement);
        const recent = statement1.item(this.value).value;
        const others = this.extraYears;
        return [
            ['Recent', recent, ''],
            ...others.map((index) => {
                const value = statement1.item(this.value, index).value
                return [
                    `${index} year(s) ago`,
                    value,
                    `${(100 * RATE(index, 0, -1 * value, recent)).toFixed(2)}%`
                ]
            })
        ];
    }
}