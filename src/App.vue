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
                                                <th v-for="heading in form.headings" :key="heading">{{
                                                        heading
                                                    }}
                                                </th>
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
import {DaveForm} from "@/classes/Forms/DaveForm";
import {FinancialStatementCollection} from "@/classes/FinancialStatementCollection";
import {FinancialStatement} from "@/classes/FinancialStatement";
import {Component, Vue} from 'vue-property-decorator';
import {ActiveForms} from "@/classes/Forms";


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

        this.forms = ActiveForms.map(className => {
            return new className(this.financialStatements);
        });
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

    mounted() {
        // console.clear();
        // this.fetchInfo();
    }
}

</script>