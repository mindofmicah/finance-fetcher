<template>
    <v-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">

        <v-main>
            <v-form @submit.prevent="fetchInfo">
                <v-text-field v-model="ticker" label="Ticker" :rules="tickerRules" :counter="4" required/>
                <v-btn type="submit" color="primary">Lookup</v-btn>
            </v-form>

            <div v-show="fetchedData.length" style="margin-top:20px;">
                <v-expansion-panels>

                    <v-expansion-panel v-for="property in fetchedData" :key="property.label">
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
                                        <tr v-for="(value,date) in property.dates" :key="date">
                                            <td>{{ date }}</td>
                                            <td>{{ value }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                </v-expansion-panels>
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    ticker: string;
    tickerRules = [
        v => !!v || 'Name is required'
    ];
    fetchedData = [];
    validators = {
        required: value => !!value || 'This field is required'
    }

    constructor() {
        super();
        this.ticker = 'nflx';
    }

    async fetchInfo() {
        const resp = await fetch(`/.netlify/functions/ticker-lookup?ticker=${this.ticker}`);
        this.fetchedData = (await resp.json()).data;
    }
}
</script>
