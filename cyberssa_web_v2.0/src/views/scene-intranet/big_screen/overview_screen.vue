<!--Created by zmj on 2018/9/6-->
<template>
    <div id="bigScreen">
        <Row type="flex" justify="space-around" :gutter="16">
            <Col class="bigScreenContent" span="5">
                <div>
                    <img title="入侵感知大屏" v-on:click="jumpBigScreen('IPSAnalysis','intrusion')" class="bigScreenItem"
                         src="./../../../../static/images/big-sereen/入侵感知.png">
                </div>
                <span class="bigScreenItemFont">入侵感知大屏</span>
            </Col>
            <Col class="bigScreenContent" span="5">
                <div>
                    <img title="威胁总览大屏" v-on:click="jumpBigScreen('','intrusion_all1')" class="bigScreenItem"
                         src="./../../../../static/images/big-sereen/威胁总览.png">
                </div>
                <span class="bigScreenItemFont">威胁总览大屏</span>
            </Col>
            <Col class="bigScreenContent" span="5">
                <div>
                    <img title="异常流量大屏" v-on:click="jumpBigScreen('异常流量分析','abnormal')" class="bigScreenItem"
                         src="./../../../../static/images/big-sereen/异常流量.png">
                </div>
                <span class="bigScreenItemFont">异常流量大屏</span>
            </Col>
            <Col class="bigScreenContent" span="5">
                <div>
                    <img title="病毒防护大屏" v-on:click="jumpBigScreen('avAnalysis','av')" class="bigScreenItem"
                         src="./../../../../static/images/big-sereen/病毒防护.png">
                </div>
                <span class="bigScreenItemFont">病毒防护大屏</span>
            </Col>
        </Row>
    </div>

</template>
<script>
    import Button from "iview/src/components/button/button";
    export default {
        components: {Button},
        methods: {

            jumpBigScreen(bigScreen,route){

                this.$router.push({
                    name: route,
                    params: {
                        jumpFiled:bigScreen
                    }

                });

            },

        },
    }
</script>
<style lang="less" scoped>
    #bigScreen {
        height: 100%;
        margin: 2% 4%;
    }

    .bigScreenContent {
         height:300px;

        .bigScreenItemFont {
            height: 40px;
            width: 200px;
            font-size :30px;
            margin:0 20%;
            /*color: rgb(21,31,76);*/
        }
        .bigScreenItem {
            height: 200px;
            width: 320px;
            border: 2px solid rgb(21,31,76);
            margin-bottom: 20px;
        }
    }

    .bigScreenItem:hover {
        transform: scale(1.3);
        transition: all 1s ease 0s;
        -webkit-transform: scale(1.3);
        -webkit-transition: all 1s ease 0s;
    }
</style>
