<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: "scanTarget",
        methods: {
          openNew() {
              window.open("https://172.20.20.28:9392/omp?r=1&cmd=get_targets&token=11d2a9da-2765-42c3-85c4-b238d70d57e9","_blank",
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
