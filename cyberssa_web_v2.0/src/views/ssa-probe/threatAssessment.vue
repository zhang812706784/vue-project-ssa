<template>
   <div>
       <!--<h1>威胁评估</h1>-->
       <iframe src="http://172.21.10.198/#/projects/plan/accessory" name="threatFrame"  id="threat" ></iframe>
   </div>
</template>

<script>
    export default {
        name: "threatAssessment"
    }
</script>

<style lang="less" scoped>
    #threat{
        width: 100%;
        height: calc(~'100vh - 95px');
        //height:850Px;
        border: none;
    }
</style>
