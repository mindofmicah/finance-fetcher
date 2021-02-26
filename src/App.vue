<template>
    <v-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">
        <v-main>
            <v-form @submit.prevent="fetchInfo">
                <v-text-field v-model="ticker" label="Ticker" :rules="tickerRules" :counter="4" required/>
                <v-btn type="submit" color="primary">Lookup</v-btn>
            </v-form>

            <div v-if="financialStatements.items.length" style="margin-top:20px;">
                <v-tabs v-model="tab" show-arrows>
                    <v-tab v-for="heading in tabHeadings" :key="heading">
                        {{ heading }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="Dave Forms">
                        <v-expansion-panels v-model="panel_index">
                            <v-expansion-panel v-for="(form, index) in forms" :key="index">
                                <v-expansion-panel-header>{{ form.name }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <th v-for="heading in form.headings" :key="heading">{{ heading }}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(cells, i) in form.rows()" :key="i">
                                                <td v-for="(cell, ii) in cells" :key="ii">{{ cell }}</td>
                                            </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :key="statement.name" v-for="statement in financialStatements.items">
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(property,index) in statement.items" :key="index">
                                <v-expansion-panel-header>{{ property.name }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Value</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(value,index) in property.values" :key="index">
                                                <td>{{ value.date }}</td>
                                                <td>{{ value.value }}</td>
                                            </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts">

type FinancialValue = {
    date: string;
    value: number;
};

type FinancialProperty = {
    label: string;
    position: number;
    values: FinancialValue[];
};
type IncomeStatement = {
    revenue: FinancialProperty;
    cost_of_goods_sold: FinancialProperty;
    gross_profit: FinancialProperty;
    research_and_development_expenses: FinancialProperty;
    sganda_expenses: FinancialProperty;
    other_operating_income_or_expenses: FinancialProperty;
    operating_expenses: FinancialProperty;
    operating_income: FinancialProperty;
    total_non_operating_incomeexpense: FinancialProperty;
    pre_tax_income: FinancialProperty;
    income_taxes: FinancialProperty;
    income_after_taxes: FinancialProperty;
    other_income: FinancialProperty;
    income_from_continuous_operations: FinancialProperty;
    income_from_discontinued_operations: FinancialProperty;
    net_income: FinancialProperty;
    ebitda: FinancialProperty;
    ebit: FinancialProperty;
    basic_shares_outstanding: FinancialProperty;
    shares_outstanding: FinancialProperty;
    basic_eps: FinancialProperty;
    eps___earnings_per_share: FinancialProperty;
};
type BalanceSheet = {

    cash_on_hand: FinancialProperty;
    receivables: FinancialProperty;
    inventory: FinancialProperty;
    pre_paid_expenses: FinancialProperty;
    other_current_assets: FinancialProperty;
    total_current_assets: FinancialProperty;
    property_plant_and_equipment: FinancialProperty;
    long_term_investments: FinancialProperty;
    goodwill_and_intangible_assets: FinancialProperty;
    other_long_term_assets: FinancialProperty;
    total_long_term_assets: FinancialProperty;
    total_assets: FinancialProperty;
    total_current_liabilities: FinancialProperty;
    long_term_debt: FinancialProperty;
    other_non_current_liabilities: FinancialProperty;
    total_long_term_liabilities: FinancialProperty;
    total_liabilities: FinancialProperty;
    common_stock_net: FinancialProperty;
    // retained_earnings_(accumulated_deficit): FinancialProperty;
    comprehensive_income: FinancialProperty;
    other_share_holders_equity: FinancialProperty;
    share_holder_equity: FinancialProperty;
    total_liabilities_and_share_holders_equity: FinancialProperty;

};

type FinancialStatementItem = {
    name: string;
    values: FinancialValue[];
}

class FinancialStatement {
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

class DaveForm {
    headings = ['Property', 'Value'];
    financials: FinancialStatementCollection;

    constructor(financials: FinancialStatementCollection) {
        this.financials = financials;
    }

    rows(): any[][] {
        return [];
    }
}

class ROICForm extends DaveForm {
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

class FinancialStatementCollection {
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

import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    tab = 0;// || 2;
    panel_index = 0;
    forms: DaveForm[];
    ticker: string;
    tickerRules = [
        v => !!v || 'Name is required'
    ];
    financialStatements: FinancialStatementCollection;

    validators = {
        required: value => !!value || 'This field is required'
    }

    constructor() {
        super();
        this.ticker = 'nflx';
        this.financialStatements = new FinancialStatementCollection;

        this.forms = [];
        this.forms.push(new ROICForm(this.financialStatements));
    }

    fetchInfo() {
        fetch(`/.netlify/functions/ticker-lookup?ticker=${this.ticker}`)
            .then(result => result.json())
            .then(({data}) => {
                this.financialStatements.items = (data.financial_statements.map(x => {
                    return new FinancialStatement(x.name, x.items)
                }));
            });
    }

    get tabHeadings() {
        return ['Dave Forms', ...this.financialStatements.items.map(s => s.name)];
    }

    // mounted() {
        // console.clear();
        // this.fetchInfo();
    // }
}

</script>