<template>
    <div id="main" class="app-main">
        <router-view v-if="!getRouterStatus"></router-view>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        watch: {
            getRouterStatus (a) {

                console.warn(`============ watch ============`);
                console.log(a);

                this.$nextTick(() => {

                    this.$store.commit('changeRouterAlive', false);

                });

                console.warn(`============ watch ============`);

            }
        },
        computed: {
            ...mapGetters([
                'getRouterStatus'
            ])
        },
        methods: {
            reload () {

            }
        },
        mounted () {
            // console.log(this.getRouterStatus);
        },
        beforeDestroy () {

        }
    };
</script>

<style>
    html, body {
        width: 100%;
        height: 100%;
        /*background: #f0f0f0;*/
        overflow: hidden;
    }

    .app-main {
        width: 100%;
        height: 100%;
        background: url("../static/images/global/background.png") 0 0 no-repeat;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
    }
</style>
