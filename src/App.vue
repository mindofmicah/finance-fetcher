<template>
    <w-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">

        <w-form @submit="fetchInfo">
            <w-input label="Ticker" :validators="[validators.required]" v-model="ticker"/>

            <w-button type="Submit">Submit</w-button>
        </w-form>

        <div v-show="fetchedData.length" style="margin-top:20px;">

        <pre>

        {{ fetchedData }}
        </pre>
        </div>
    </w-app>
</template>

<script lang="ts">
import {data as lookups} from './data/lookups'
import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    lookup_options = [];
    lookup_callbacks = {};
    lookup: string;
    ticker: string;
    fetchedData = [];
    validators = {
        required: value => !!value || 'This field is required'
    }

    constructor() {
        super();
        this.lookup = 'revenue';
        this.ticker = 'nflx';
    }

    async fetchInfo() {
        console.clear();
        const resp = await fetch(`/.netlify/functions/hi?ticker=${this.ticker}&property=${this.lookup}`);
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
