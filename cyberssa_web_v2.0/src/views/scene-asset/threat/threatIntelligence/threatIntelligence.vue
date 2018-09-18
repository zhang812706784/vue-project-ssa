<template>
    <Tabs value="threatIntelligence">

        <TabPane label="威胁情报总览" name="threatIntelligence">
            <Row :gutter="10">
                <Col :span="12">

                    <tp-ssa-echarts ref="refIpLocal" :allParams="allParamsIpLocal"></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholeSeverity" :allParams="allParamsLoopholeSeverity"></tp-ssa-echarts>

                </Col>

            </Row>

            <Row :gutter="10">
                <Col :span="12">

                    <tp-ssa-echarts ref="refSiteMax" :allParams="allParamsSiteMax"></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refHighLoophole" :allParams="allParamsHighLoophole" ></tp-ssa-echarts>

                </Col>
            </Row>

            <Row :gutter="10">
                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholeMax" :allParams="allParamsLoopholeMax" ></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholeCount" :allParams="allParamsLoopholeCount" ></tp-ssa-echarts>

                </Col>
            </Row>

            <Row>

            </Row>
        </TabPane>

    </Tabs>

</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";

    export default {
        name: "threatIntelligence",
        components: {TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                allParamsIpLocal: {
                    id: 'ipLocal',
                    type: "pie",
                    title: "IP地域分布总览",
                    url: '/api/getpie',
                    data: {
                        index: "ipweb_db",
                        type: "ip_geo_info",
                        aggField: "ip_GeoPosition.P",
                        size: 10
                    },
                    event: {       //跳转到   Ip地址信息库
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["ip_GeoPosition.P"]: [params.name]}};
                            this.$router.push({
                                name: "ipAddrressPage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }
                            })
                        }
                    }
                },
                allParamsLoopholeSeverity: {
                    id: 'loopholeSeverity',
                    type: "pie",
                    title: "漏洞严重性评分分布",
                    url: '/api/getpie',
                    config: {
                        label:{
                            formatter:function (params) {
                                return params.data.name+"分"
                            }
                        }
                    },
                    data: {
                        index: "loophole_result",
                        type: "lph_scan_result",
                        aggField: "resultSeverity",
                        size: 10
                    },
                    event: {       //跳转到   漏洞分析
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["resultSeverity"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsSiteMax: {
                    id: 'siteMax',
                    type: "bar",
                    title: "站点数最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_db",
                        type: "web_info",
                        aggField: "strIP"
                    },
                    event: {       //跳转到   IP地址信息库
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["strIP"]: [params.name]}};
                            this.$router.push({
                                name: "ipAddrressPage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsHighLoophole: {
                    id: 'highLoophole',
                    type: "crossBar",
                    title: "高危漏洞名称Top10",
                    url: '/api/getbar',
                    reload: 0,
                    config: {
                        axisLabel: {
                            formatter : function(params){
                                if (params.length > 10) {
                                    return params.substring(0, 10)+"...";
                                } else {
                                    return params;
                                }
                            }
                        },
                    },
                    data: {
                        index: "loophole_result",
                        type:  "lph_scan_result",
                        aggField: "nvtName",
                        queryrange:["resultSeverity","8","10"],
                        page:1,
                        size:10
                    },
                    event: {       //跳转到    漏洞分析
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["nvtName"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsLoopholeMax: {
                    id: 'loopholeMax',
                    type: "crossBar",
                    title: "漏洞最多的IPTop10",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "loophole_result",
                        type:  "lph_stastic_ip",
                        sort: {"loopholeAllCnt":"desc"},
                        showField: "loopholeAllCnt",
                        page:1,
                        size:10
                    },
                    event: {       //跳转到    IP分析
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["uuid"]: [params.name]}};//有问题
                            this.$router.push({
                                name: "ipPage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsLoopholeCount: {
                    id: 'loopholeCount',
                    type: "bar",
                    title: "出现次数最多的漏洞",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "loophole_result",
                        type:  "lph_scan_result",
                        aggField:"nvtName",
                        size:10
                    },
                    event: {       //跳转到    漏洞分析
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["nvtName"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'threatIntelligence',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                }
            };
        },
    };
</script>

<style lang="less" scoped>

    .ivu-row {
        .ivu-col {
            background-clip: content-box;
            height: 220px;
            margin-bottom: 10px;
            background-color: rgba(255, 255, 255, 0.01);
        }
    }
</style>
