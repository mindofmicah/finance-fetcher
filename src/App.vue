<template>
    <v-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">

        <v-main>
            <v-form @submit.prevent="fetchInfo">
                <v-text-field v-model="ticker" label="Ticker" :rules="tickerRules" :counter="4" required/>
                <v-btn type="submit" color="primary">Lookup</v-btn>
            </v-form>

            <div v-show="fetchedData.length" style="margin-top:20px;">
                <pre>
                    {{ fetchedData }}
                </pre>
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import {data as lookups} from './data/lookups'
import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    ticker: string;
    tickerRules = [
        v => !!v || 'Name is required'
    ];
    lookup_options = [];
    lookup_callbacks = {};
    fetchedData = [];
    validators = {
        required: value => !!value || 'This field is required'
    }

    constructor() {
        super();
        this.ticker = 'nflx';
    }

    async fetchInfo() {
        const resp = await fetch(`/.netlify/functions/hi?ticker=${this.ticker}`);
        this.fetchedData = this.lookup_callbacks[this.lookup]((await resp.json()).data);
    }

    created() {
        lookups.forEach((entry) => {
            this.lookup_options.push({
                value: entry.slug,
                label: entry.label
            });
            this.lookup_callbacks[entry.slug] = entry.cb;
        })
    }
}
</script>
