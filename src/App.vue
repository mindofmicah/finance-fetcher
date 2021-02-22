<template>
    <w-app style="margin:0 auto; max-width:800px; background-color:whitesmoke; padding:20px;" class="pa4">

        <w-form @submit="fetchInfo">
            <w-input label="Ticker" :validators="[validators.required]" v-model="ticker"/>

            <w-select label="Property" v-model="lookup" :validators="[validators.required]" :items="lookup_options">

            </w-select>
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
import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class App extends Vue {
    lookup_options = [
        {value: 'revenue', label: 'Revenue'},
        {value: 'total-provision-income-taxes', label: 'Total Provision Income Taxes'},
    ];
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
        this.fetchedData = (await resp.json()).data;
    }
}
</script>
