<template>
    <Row>
        <Col span="18" style="height: 100%">
            <Row>
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        应用总数
                    </p>
                    <div>
                        <span style="font-size: 40px">{{num}}个</span>
                    </div>
                </Col>
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        应用识别
                    </p>
                    <div>
                        <span style="font-size: 40px">{{appnum}}个</span>
                    </div>
                </Col>
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        应用阻断
                    </p>
                    <div>
                        <span style="font-size: 40px">{{blocknum}}个</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="8" style="height: 400px">
                    <tp-ssa-echarts :allParams="allParams1" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
                <Col span="8" style="height: 400px">
                    <tp-ssa-echarts :allParams="allParams2" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
                <Col span="8" style="height: 400px">
                    <tp-ssa-echarts :allParams="allParams3" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
            </Row>
            <Row>
                <Col span="8" style="height: 350px">
                    <tp-ssa-echarts :allParams="allParams4" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
                <Col span="16" style="height: 350px">
                    <tp-ssa-echarts :allParams="allParams5" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
            </Row>
        </Col>
        <Col span="6" style="height: 100%">
            <Row style="height: 300px">
                <tp-ssa-log :allParams="allParams6"></tp-ssa-log>
                <!--<tp-ssa-echarts :allParams="allParams6" @on-click="testEvent"></tp-ssa-echarts>-->
            </Row>
            <Row style="height: 300px">
                <tp-ssa-echarts :allParams="allParams7" @on-click="testEvent"></tp-ssa-echarts>
            </Row>
            <Row style="height: 300px">
                <tp-ssa-echarts :allParams="allParams8" @on-click="testEvent"></tp-ssa-echarts>
            </Row>
        </Col>
    </Row>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaLog from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-log";
    export default {
        name: "application_view",
        components: {TpSsaLog, TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '应用总览',
                timeout: 2000,
                num:0,
                appnum:0,
                blocknum:0,
                allParams1: {
                    id: 'appRank',
                    type: "bar",
                    title: "应用排名top10",
                    url: '/api/cr_app/identify/top_chart',
                    reload: this.timeout,
                    data:{
                        program:"ALL",
                        aggsCol:"AppName",
                        subAggsType:"value_count",
                        subAggsCol:"@timestamp",
                        begTime:null,
                        endTime:null
                    }
                },
                allParams2: {
                    id: 'realFlowRate',
                    type: "line",
                    title: "实时速率top5历史趋势",
                    url: '/api/cr_net/net/real_top_trend',
                    reload: this.timeout,
                    data: {
                        flowType:'AppName',
                        direction:'flow',
                        begTime:null,
                        endTime:null,
                        timeLong:'12h'
                    }
                },
                allParams3: {
                    id: 'appBlock',
                    type: "pie",
                    title: "应用阻断top10",
                    url: '/api/cr_app/control/top_chart',
                    reload: this.timeout,
                    data: {
                        aggsCol:"AppName",
                        subAggsType:"value_count",
                        subAggsCol:"@timestamp",
                        begTime:null,
                        endTime:null
                    }
                },
                allParams4: {
                    id: 'appRankTrend',
                    type: "line",
                    title: "应用排名趋势top5",
                    url: '/api/cr_app/identify/trend_chart',
                    reload: this.timeout,
                    data: {
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp',
                        timeLong:"12h",
                        begTime:null,
                        endTime:null
                    }
                },
                allParams5: {
                    id: 'appBlockTrend',
                    type: "line",
                    title: "应用阻断总趋势图",
                    url: '/api/cr_app/big/control_history',
                    reload: this.timeout,
                    data: {
                        flowType:'AppName',
                        begTime:null,
                        endTime:null
                    }
                },
                allParams6: {
                    id: 'newLog',
                    url: '/api/getlastlog',
                    logList: [],
                    title: "最新日志",
                    offline_attr:"最新安全态势感知日志_mainpage",
                    reload: this.timeout,
                    data: {
                        CombQuery: {program: ["INSANT_MESSAGE", "SEARCH_ENGINE", "SOCIAL_NETWORK", "EMAIL", "FILE_TRANSFER", "ONLINE_SHOPPING", "WEB_ACCESS"]},
                        page: 1,
                        size: 10
                    },
                },
                allParams7: {
                    id: 'SrcIP',
                    type: "bar",
                    title: "源IP排名top10",
                    url: '/api/cr_app/identify/top_chart',
                    reload: this.timeout,
                    data: {
                        program:"ALL",
                        aggsCol:"SrcIP",
                        subAggsType:"value_count",
                        subAggsCol:"@timestamp",
                        begTime:null,
                        endTime:null
                    }
                },
                allParams8: {
                    id: 'SrcIPTrend',
                    type: "line",
                    title: "源IP趋势top5",
                    url: '/api/cr_app/identify/trend_chart',
                    reload: this.timeout,
                    data: {
                        program:"ALL",
                        aggsCol:"SrcIP",
                        subAggsType:"value_count",
                        subAggsCol:"@timestamp",
                        begTime:null,
                        endTime:null,
                        timeLong:"12h",
                    }
                },
                testConfig: {
                    grid: {
                        left: '4%'
                    }
                }
            };
        },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            reloadChart () {
                console.warn(`============ 调用页面触发 重新加载 echarts ============`);
            },
            dataReckon (data) {
                data = Number(data);
                if (data > 10000) {
                    data = (data / 10000).toFixed(1) + 'w'
                }
                return data
            }
        },
        mounted () {
            this.$http.get("/api/cr_app/big/app_count").then(res => {
                this.num = this.dataReckon(res.data.count)
            });
            this.$http.get("/api/cr_app/big/identify_count").then(res => {
                this.appnum = this.dataReckon(res.data.count)
            });
            this.$http.get("/api/cr_app/big/control_count").then(res => {
                this.blocknum = this.dataReckon(res.data.count)
            });
        }
    };


</script>

<style scoped>

</style>
