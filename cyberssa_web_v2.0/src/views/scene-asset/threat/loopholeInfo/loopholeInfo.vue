<template>
    <div></div>
</template>

<script>
    export default {
        name: "loopholeInfo",
        methods: {
            openNew() {
                window.open("https://172.20.20.28:9392/omp?r=1&cmd=dashboard&token=9404e761-63c7-443b-ad80-36761234a7f4","_blank",
                    "top=100,left=200,width=1600,height=800,menubar=yes,scrollbars=no,toolbar=yes,status=yes");
            }
        },
        created() {
            this.openNew();
        }
    }
</script>

<style scoped>

</style>
