<template>
    <div></div>
</template>

<script>
    export default {
        name: "scanTask",
        methods: {
            openNew() {
                window.open("https://172.20.20.28:9392/omp?r=1&cmd=get_tasks&token=c16e1402-c65d-4d33-8b7f-48f0ec697f3b","_blank",
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
