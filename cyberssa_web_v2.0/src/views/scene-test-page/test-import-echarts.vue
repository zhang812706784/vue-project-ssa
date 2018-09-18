<template>

    <Row class="page-container">

        <Row class="height-auto">

            <Col span="3">
                <Button @click="reloadChart">点击重置</Button>
            </Col>

            <Col span="4">
                <h1>{{ $t(msg) }}</h1>
            </Col>

        </Row>

        <Row style="height: 70px;">
            <Col span="24">
                <Page :total="100" show-total></Page>
            </Col>
        </Row>

        <Row class="test-row" v-if="!hideChart">

            <!-- example bar -->
            <Col :span="6">

                <!--<tp-ssa-echarts :allParams="circleChart"></tp-ssa-echarts>-->

                <tp-ssa-echarts :allParams="allParams"></tp-ssa-echarts>

            </Col>

            <!-- example pie -->
            <Col :span="6">

                <tp-ssa-echarts ref="chart" :allParams="allParams1"></tp-ssa-echarts>

            </Col>

            <!-- example line -->
            <Col :span="6">

                <tp-ssa-echarts :allParams="allParams2"></tp-ssa-echarts>

            </Col>

            <!-- example line2 -->
            <Col :span="6">

                <tp-ssa-echarts :allParams="allParams3"></tp-ssa-echarts>

            </Col>

        </Row>

        <!-- example map -->
        <Row class="test-row" v-if="!hideMap">

            <Col :span="24">

                <tp-ssa-echarts :allParams="allParams4"></tp-ssa-echarts>

            </Col>

        </Row>

        <!-- 测试拖布图 -->
        <Row v-if="true">

            <Col span="24">
                <tp-ssa-echarts :allParams="topChart"></tp-ssa-echarts>
            </Col>

        </Row>

        <!-- 测试图 -->
        <Row v-if="false">

            <Col span="5">
                <tp-ssa-echarts :allParams="circleChart"></tp-ssa-echarts>
            </Col>

        </Row>

    </Row>

</template>

<script type="es6">
    import TpSsaEcharts from "../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";

    export default {
        name: "test-import-echarts",
        components: {TpSsaEcharts},
        data () {
            return {
                msg: '测试页面',
                hideChart: false,
                hideMap: false,
                topChart: {
                    id: 'net_topology',
                    type: "topology",
                    title: "",
                    url: '/api/cr_net/net_if/net_pology',
                    data: {},
                    config: {
                        // VFWPic: '',
                        // VNPic: '',
                        // VMPic: ''
                    }
                },
                circleChart: {
                    id: 'chart8',
                    type: "circle",
                    title: "XXX剩余XXX",
                    url: '/api/ssa_table',
                    data: {
                        index: 'ipweb_db',
                        type: 'web_info',
                        page: 1,
                        size: 10,
                        oo: [1, 2, 3],
                        obj: {
                            name: '312',
                            foo: 123
                        }
                    }
                },
                allParams: {
                    id: 'chart1',
                    type: 'bar',
                    title: '被攻击目的IPtop10',
                    url: '/api/getbar',
                    // reload: 50000,
                    data: {
                        index: 'loophole_result',
                        type: 'lph_scan_result',
                        aggField: 'resultPort',
                    },
                    event: {
                        click: params => {
                            // console.warn(`============ click ============`);
                            // console.log(params);
                        }
                    },
                    callback: data => {
                        // console.warn(`============ ajax 数据 ============`);
                        // console.log(data);
                    }
                },
                allParams1: {
                    id: 'chart2',
                    type: 'pie',
                    title: '被攻击目的IPtop10',
                    url: '/api/getpie',
                    data: {
                        index: 'ipweb_result',
                        type: 'ip_geo_info',
                        sort: {
                            loopholeTypeCnt: 'desc'
                        },
                        showField: 'loopholeTypeCnt',
                        page: 1,
                        size: 10
                    }
                },
                allParams2: {
                    id: 'chart3',
                    type: "line",
                    title: "被攻击总数趋势图",
                    url: '/api/cr_sec/anomalies/top_attack_trend',
                    data: {
                        begTime: '1533830400000',
                        endTime: '1537113600000',
                        timeLong: '273600s'
                    },
                    config: {
                        yNumType: 'bytes',
                    }
                },
                allParams3: {
                    id: 'chart4',
                    type: "line",
                    title: "被攻击目的IP趋势图",
                    url: '/api/cr_sec/anomalies/attack_trend',
                    data: {
                        begTime: '1531430400000',
                        endTime: '1537113600000',
                        timeLong: '273600s'
                    }
                },
                allParams4: {
                    id: 'chart5',
                    type: 'map',
                    title: '入侵感知地图',
                    url: '/api/getmap',
                    data: {
                        CombQuery: {program: ['IPS']},
                        maxLine: 50,
                        level1Aggs: "SrcIP", /*一级聚合字段*/
                        level2Aggs: "DstIP", /*一级聚合字段*/
                        level1_topN: 40, /*一级聚合topN*/
                        level2_topN: 40, /*二级聚合topN*/
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

                // this.$refs.chart_map.reload();

                this.allParams1.title = '盗墓笔记之云顶天宫';

                this.$refs.chart.changeParams({
                    level1_topN: 22,
                    level2_topN: 4444
                });

            }
        },
        mounted () {

            this.$http.get('/api/getversion')
                .then(res => {
                    // console.log(res);
                });

        }
    };
</script>

<style lang="less" scoped>

    .page-container {

        .ivu-row {
            height: 300px;

            .ivu-col {
                height: 100%;
                border: 1px solid rgba(255, 255, 255, .5);
            }
        }

        .height-auto {
            height: auto;
        }

    }

</style>
