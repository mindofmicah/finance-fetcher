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

    calculateRateValues(callback: (index: number) => number[]) {
        const firstRow = callback(0);
        const recentValue = firstRow[firstRow.length - 1];

        return [
            ['Recent', ...firstRow, ''],
            ...this.extraYears.map((index) => {
                const values = callback(index);
                return [
                    `${index} year(s) ago`,
                    ...values,
                    `${(100 * this.calculateRate(recentValue, values[values.length - 1], index)).toFixed(2)}%`
                ];
            })
        ];
    }

    calculateRate(current: number, previous: number, numYears: number): number {
        return RATE(numYears, 0, -1 * previous, current);
    }

    rows(): any[][] {
        return this.calculateRateValues((index: number) => {
            const statement = this.financials.statement(this.statement);
            return [
                statement.item(this.value, index).value
            ];
        });
    }
}