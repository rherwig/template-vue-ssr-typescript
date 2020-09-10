<template>
    <div id="vue-root">
        <div class="example-container">
            <main>
                <h1>{{ message }}</h1>
                <p>
                    To get started, open <code>src/shared/components/App.vue</code> and start hacking away.
                </p>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { State } from 'vuex-class';

    @Component
    export default class App extends Vue {
        @State message: string;
    }
</script>

<style lang="scss">
    * {
        font-family: sans-serif;
    }

    html,
    body,
    #vue-root {
        margin: 0;
        height: 100%;
        width: 100%;
    }

    .example-container {
        display: flex;
        justify-content: center;

        code {
            font-family: monospace;
            background-color: #545454;
            color: #fff;
            padding: 4px 8px;
        }
    }
</style>
