<template>
            <Row class="page-container">
                <Col span="24">
                     <tp-two-stage-drilling-plugin-flow :all_params="allparams"></tp-two-stage-drilling-plugin-flow>
                </Col>
            </Row>
</template>

<script type="es6">
    import TpTwoStageDrillingPluginFlow from "../../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-flow";
    export default {
        name: "test-import-echarts",
        components: {TpTwoStageDrillingPluginFlow},
        data () {
            return {
                allparams:{
                    bar_yNumType:"rate",
                    SecondTable_yNumType:"rate",
                    trendyNumType:"rate",
                    SecondTrendyNumType:"rate",

                    //一级钻取字段和二级钻取字段
                    FirstDrillingType:'AppName',
                    SecondDrillingType:"UserIp",
                    ShowFiled:'up',

                    //一级钻取柱状图参数
                    bar_elementID:'realBar',
                    bar_title:"实时速率Top10",
                    bar_url:'/api/cr_net/net/real_top_chart',

                    //一级钻取topN趋势图参数
                    trend_elementID:'realLines',
                    trendTitle:"实时速率Top5历史趋势图",
                    trendUrl:'/api/cr_net/net/real_top_trend',

                    //二级钻取table表格参数
                    SecondTableElementID:"realsecondtable",
                    SecondTableURL:'/api/cr_net/net/real_top_list',
                    SecondTableListColumns:[
                        {
                            title: '应用名',
                            key:  'selectFirstStage',
                        },
                        {
                            title: '源IP',
                            key: 'key',
                        },
                        {
                            title: '次数',
                            key: 'doc_count',
                        }
                        ],
                    //二级钻取趋势图参数
                    SecondTrendElementID:"realBarTendLine",
                    SecondTrendTitle:"趋势图",
                    SecondTrendURL:'/api/cr_net/net/real_top_list_trend',
                }
            };
        }
    };


</script>

<style lang="less" scoped>

    .page-container {
        /*background-color: rgba(61, 157, 59, 0.4);*/

        .vms-row1 {
            /*height: 500px;*/

            .ivu-col {
                border: 1px solid #888888;
            }
        }

    }

</style>
