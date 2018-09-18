<template>
    <div>
        <h1>漏洞扫描</h1>
    <!--<iframe src="https://172.20.20.28:9392/omp?r=1&cmd=get_targets&token=11d2a9da-2765-42c3-85c4-b238d70d57e9"-->
            <!--frameborder="0"  name="threatFrame"  id="threat" scrolling="auto"></iframe>-->
    </div>
</template>

<script>
    export default {
        name: "loopholeScan",
        methods: {
            openNew() {
                window.open("https://172.20.20.28:9392/omp?r=1&cmd=get_targets&token=11d2a9da-2765-42c3-85c4-b238d70d57e9", "_blank",
                    "top=100,left=200,width=1600,height=800,menubar=yes,scrollbars=no,toolbar=yes,status=yes");
            }
        },
        created() {
            this.openNew();
        }
    }
</script>

<style lang="less" scoped>
    #threat{
        width: 100%;
        height: 100%;
    }
</style>
