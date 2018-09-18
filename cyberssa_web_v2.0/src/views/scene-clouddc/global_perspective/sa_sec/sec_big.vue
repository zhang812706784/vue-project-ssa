<!--Created by zmj on 2018/8/22-->
<template>

    <Row class="page-container">
        <!--第一列-->
        <Col :span="4" class="mainPageHigh">
            <!--安全风险评估-->
            <Row class="left-1">
                <!-- example bar -->
                <Col :span="12" class="echartHeight">
                    <tp-ssa-echarts :allParams="pieApp"></tp-ssa-echarts>
                </Col>
                <Col :span="12" class="echartHeight">
                    <tp-ssa-echarts :allParams="pieNet"></tp-ssa-echarts>
                </Col>
            </Row>
            <!--探针-->
            <Row class="left-2 fontStyle">
                <div style="margin-top: 5px;margin-bottom: 3px;">探针</div>
                <!--防火墙-->
                <Col span="8" class="contentHeight">
                    <p class="lineHeight">防火墙</p>
                    <div>
                        <span style="font-size: 30px">{{probeNGFW}}</span>
                        <span>个</span>
                    </div>
                </Col>
                <!--WAF-->
                <Col span="8" class="contentHeight">
                    <p class="lineHeight">WAF</p>
                    <div>
                        <span style="font-size: 30px">{{probeWAF}}</span>
                        <span>个</span>
                    </div>
                </Col>
                <!--云盾-->
                <Col span="8" class="contentHeight">
                    <p class="lineHeight">云盾</p>
                    <div>
                        <span style="font-size: 30px">{{probeEnforce}}</span>
                        <span>个</span>
                    </div>
                </Col>
            </Row>
            <!--攻击趋势预警-->
            <Row class="left-3">
                <!-- example line -->
                <Col :span="24" style="height: 100%">
                    <tp-ssa-echarts :allParams="attackLines"></tp-ssa-echarts>
                </Col>
            </Row>
            <!--WAF攻击总趋势图-->
            <Row class="left-4">
                <Col :span="24" style="height: 100%">
                    <tp-ssa-echarts :allParams="wafAttackLines"></tp-ssa-echarts>
                </Col>
            </Row>
        </Col>
        <!--第二列-->
        <Col :span="16" class="mainPageHigh">
            <Row class="fontStyle">
                <!--近1h攻击次数-->
                <Col span="6" style="height: 80px;text-align: center">
                    <p class="lineHeight">近1h攻击次数</p>
                    <div>
                        <span class="countFont">{{dropHourCount}}</span>
                        <span>次</span>
                    </div>
                </Col>
                <!--近30d攻击次数-->
                <Col span="6" style="height: 80px;text-align: center">
                    <p class="lineHeight">近30d攻击次数</p>
                    <div>
                        <span class="countFont">{{dropMonthCount}}</span>
                        <span>次</span>
                    </div>
                </Col>
                <!--近1h事件数-->
                <Col span="6" style="height: 80px;text-align: center">
                    <p class="lineHeight">近1h事件数</p>
                    <div>
                        <span class="countFont">{{eventHourCount}}</span>
                        <span>件</span>
                    </div>
                </Col>
                <!--近30d事件数-->
                <Col span="6" style="height: 80px;text-align: center">
                    <p class="lineHeight">近30d事件数</p>
                    <div>
                        <span class="countFont">{{eventMonthCount}}</span>
                        <span>件</span>
                    </div>
                </Col>
            </Row>
            <!--第二行 地图-->
            <Row class="mapRowHeight">
                <!--地图-->
                <Col :span="24" class="mapHeight">
                    <tp-ssa-echarts :allParams="worldMap"></tp-ssa-echarts>
                </Col>
            </Row>

        </Col>
        <!--第三列-->
        <Col :span="4" class="mainPageHigh">
            <Row class="rightStyle">
                <Col :span="24">
                <tp-ssa-top-list :allParams="attackSer" ></tp-ssa-top-list>
                </Col>
            </Row>
            <!--第二行 最新日志-->
            <Row class="rightStyle">
                <Col :span="24">
                <tp-ssa-log :allParams="newLog"></tp-ssa-log>
                </Col>
            </Row>
            <!--第三行 受攻击主机-->
            <Row class="rightStyle">
                <Col :span="24">
                    <tp-ssa-top-list :allParams="attackHost"></tp-ssa-top-list>
                </Col>
            </Row>
            <!--第四行 关键字-->
            <Row class="rightStyle">
                <Col :span="24">
                <tp-ssa-top-list :allParams="keyWords" ></tp-ssa-top-list>
                </Col>

            </Row>
            <!--第五行 用户流量趋势top5-->
            <Row class="rightStyle">
                <Col :span="24">
                    <tp-ssa-top-list :allParams="AV" ></tp-ssa-top-list>
                </Col>
            </Row>
        </Col>

    </Row>

</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaTopology from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-topology";
    import TpSsaLog from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-log";
    import Row from "iview/src/components/grid/row";
    import TpSsaTopList from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-top-list";


    export default {
        name: "test-import-echarts",
        components: {TpSsaTopList, Row, TpSsaLog, TpSsaTopology, TpSsaEcharts, TpTable},
        data() {
            return {

                barRefs: '',
                msg: '网络总览',
                timeout: 600,
                probeNGFW: 0,
                probeWAF: 0,
                probeEnforce: 0,
                dropHourCount: 0,
                dropMonthCount: 0,
                eventHourCount: 0,
                eventMonthCount: 0,
                bTime: '',
                eTime: '',
                pieApp: {
                    id: 'pieApp',
                    type: "circle",
                    title: "应用风险",
                    url: '/api/getsecscore',
                    data: {
                        offline_attr: "应用风险",
                        CombQuery: {program: ["INSANT_MESSAGE", "SEARCH_ENGINE", "SOCIAL_NETWORK", "EMAIL", "FILE_TRANSFER", "ONLINE_SHOPPING", "WEB_ACCESS", "FILTER"]}
                    },
                    callback: data => {
                        console.warn(`============ ajax 数据 ============`);
                        console.log(data);
                        data.total = data.rows.score

                    }
                },
                pieNet: {
                    id: 'pieNet',
                    type: "circle",
                    title: "安全风险",
                    url: '/api/getsecscore',
                    data: {
                        offline_attr: "应用风险",
                        CombQuery: {program: ["ATTACK", "SCAN", "FLOOD", "DDOS", "IPS", "AV"]}
                    },
                    callback: data => {
                        console.warn(`============ ajax 数据 ============`);
                        console.log(data);
                        data.total = data.rows.score

                    }
                },
                attackLines: {
                    id: 'attackLines',
                    type: "line",
                    title: "攻击趋势预警",
                    url: '/api/cr_sec/big/attack_trend',
                    data: {},
                },
                wafAttackLines: {
                    id: 'wafAttackLines',
                    type: "line",
                    title: "WAF攻击总趋势图",
                    url: '/api/cr_sec/big/waf_attack_trend',
                    data: {},
                },
                worldMap: {
                    id: 'worldMap',
                    type: 'map',
                    title: '安全态势感知地图',
                    url: '/api/getmap',
                    data: {
                        queryObj: {program: "ATTACK"},
                        maxLine: 50, /*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                        level1Aggs: "SrcIP", /*一级聚合字段*/
                        level2Aggs: "DstIP", /*一级聚合字段*/
                        level1_topN: 30, /*一级聚合topN*/
                        level2_topN: 30, /*二级聚合topN*/
                    }
                },
                newLog: {
                    id: 'newLog',
                    url: '/api/getlastlog',
                    title: "最新日志",
                    offline_attr: '最新流量感知日志_mainPage',
                    logList: [],
                    data: {
                        length:5,
                        CombQuery: {program: ["ATTACK", "SCAN", "FLOOD", "DDOS", "IPS", "AV"]},
                        page: 1,
                        size: 3
                    },
                },
                attackHost:{
                    id:'attackHost',
                    url: '/api/cr_sec/big/attack_target_ip',
                    title:"受攻击主机" ,
                    list:[],
                    data:{
                        length:5
                    }
                },
                attackSer:{
                  id:'attackSer',
                  url: '/api/cr_sec/big/attack_target_app',
                  title:"受攻击业务" ,
                  list:[],
                  data:{
                    length:5
                  }
                },
                keyWords:{
                    id:'keyWords',
                    url:'/api/cr_sec/keywords/histogram',
                    title:'关键字',
                    keyWord:false,
                    list:[],
                    data:{
                        length:5,
                        fieldName: 'Content',
                    }
                },
                AV:{
                    id:'AV',
                    url:'/api/cr_sec/big/virus',
                    title:'病毒',
                    list:[],
                    data:{
                        length:5,
                        fieldName: 'Content',
                    }
                }
            }
        },
        methods: {
            testEvent(params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            changeDate(params) {
            },

            dataReckon(data) {
                data = Number(data);
                // var count = data < 100 ? data : '99+';
                if (data > 10000) {

                    data = (data / 10000).toFixed(1) + 'w'

                }
                return data
            },

        },
        mounted() {
            this.$http.get("/api/cr_sec/big/probe_count",
                {
                    params: {

                        type: 'nsec'

                    }
                }
            ).then(res => {

                this.probeNGFW = this.dataReckon(res.data.count)
            });
            this.$http.get("/api/cr_sec/big/probe_count",
                {
                    params: {

                        type: 'waf'

                    }
                }
            ).then(res => {
                this.probeWAF = this.dataReckon(res.data.count)
            });
            this.$http.get("/api/cr_sec/big/probe_count",
                {
                    params: {

                        type: 'enforce'

                    }
                }
            ).then(res => {
                this.probeEnforce = this.dataReckon(res.data.count)
            });
            this.$http.get("/api/cr_sec/big/risk_analysis",
                {
                    params: {
                        type: 'attack'
                    }
                }
            ).then(res => {
                this.dropHourCount = this.dataReckon(res.data.hours_count);
                this.dropMonthCount = this.dataReckon(res.data.month_count);

            });
            this.$http.get("/api/cr_sec/big/risk_analysis",
                {
                    params: {
                        type: 'event'
                    }
                }
            ).then(res => {
                this.eventHourCount = this.dataReckon(res.data.hours_count);
                this.eventMonthCount = this.dataReckon(res.data.month_count);

            });
        }

    };


</script>

<style lang="less" scoped>
    .page-container {
        height: 100%;
        .lineHeight {
            line-height: 2;
        }
    }

    .mainPageHigh {
        height: 100%;
        .left-1 {
            width: 100%;
            height: calc(~"19% - 6px");
            margin-bottom: 6px;
            .echartHeight {
                height: 100%;
            }
        }
        .left-2 {
            width: 100%;
            height: calc(~"15% - 6px");
            margin-bottom: 6px;
            .contentHeight {
                height: calc(~"100% -25px");
            }
        }
        .left-3 {
            width: 100%;
            height: 28%;
        }
        .left-4 {
            width: 100%;
            height: calc(~"28% - 6px");
            margin-top: 6px;
        }
        .fontStyle {
            color: #fff;
            font-size: 14px;
            font-family: "Microsoft YaHei";
            height: 10%;
            .countFont {
                font-size: 4vh;
            }
        }
        .mapRowHeight {
            height: 80%;
            .mapHeight {
                height:100%;
            }
        }
        .rightStyle {
            height:18.7%;
            .ivu-card-body {
                padding:10px;
            }
        }
    }

    .ivu-tabs-tabpane > .vm-date {
        float: right;
        top: -50px;
    }

    .ivu-tabs-tabpane > .vm-date .ivu-input-wrapper > .ivu-input {
        background: transparent;
    }

    .ivu-tabs-tabpane > .vm-date .ivu-input-wrapper .ivu-input-icon {
        color: #b94a48;
    }

</style>
