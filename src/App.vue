<template>
    <v-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">

        <v-main>
            <v-form @submit.prevent="fetchInfo">
                <v-text-field v-model="ticker" label="Ticker" :rules="tickerRules" :counter="4" required/>
                <v-btn type="submit" color="primary">Lookup</v-btn>
            </v-form>

            <div v-if="fetchedData" style="margin-top:20px;">
                <v-tabs v-model="tab">
                    <v-tab
                        v-for="heading in tabs"
                        :key="heading"
                    >
                        {{ heading }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">

                    <v-tab-item key="Dave Forms">
                        <v-expansion-panels v-model="panel_index">
                            <v-expansion-panel>
                                <v-expansion-panel-header>ROIC</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <th>Property</th>
                                                <th>Value</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(cells, i) in roicColumns" :key="i">
                                                <td v-for="(cell, ii) in cells" :key="ii">{{ cell }}</td>
                                            </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>

                        </v-expansion-panels>

                    </v-tab-item>
                    <v-tab-item key="Balance Sheet">
                        <v-expansion-panels>
                            <v-expansion-panel v-for="property in fetchedData.balance_sheet" :key="property.label">
                                <v-expansion-panel-header>{{ property.label }}</v-expansion-panel-header>
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
                    <v-tab-item key="Income Statement">
                        <v-expansion-panels>
                            <v-expansion-panel v-for="property in fetchedData.income_statement" :key="property.label">
                                <v-expansion-panel-header>{{ property.label }}</v-expansion-panel-header>
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
type FinancialData = {
    income_statement: IncomeStatement;
    balance_sheet: BalanceSheet;
};

import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    tabs = ['Dave Forms', 'Balance Sheet', 'Income Statement'];
    tab = 0;// || 2;
    panel_index = 0;
    ticker: string;
    tickerRules = [
        v => !!v || 'Name is required'
    ];
    fetchedData?: FinancialData;
    validators = {
        required: value => !!value || 'This field is required'
    }

    constructor() {
        super();
        this.ticker = 'nflx';
        this.fetchedData = null;
    }

    fetchInfo() {
        fetch(`/.netlify/functions/ticker-lookup?ticker=${this.ticker}`)
            .then(result => result.json())
            .then((result: { financial_data: FinancialData }) => {
                this.fetchedData = result.financial_data;
                // console.log(result)

            });
        // this.fetchedData = (await resp.json()).data;
    }


    get roicColumns() {
        if (!this.fetchedData) {
            return [];
        }
        const ebit = parseFloat(String(this.fetchedData.income_statement.ebit.values[0].value));
        const taxes = parseFloat(String(this.fetchedData.income_statement.income_taxes.values[0].value));
        const equity = parseFloat(String(this.fetchedData.balance_sheet.share_holder_equity.values[0].value));
        const debt = parseFloat(String(this.fetchedData.balance_sheet.long_term_debt.values[0].value));
        const roic = ((ebit - taxes) / (equity + debt) * 100).toFixed(2) + '%';

        return [
            ['EBIT', ebit],
            ['Taxes', taxes],
            ['Equity', equity],
            ['Debt', debt],
            ['ROIC', roic],
        ]
    }

    mounted() {
        // this.fetchInfo();
    }
}
</script>