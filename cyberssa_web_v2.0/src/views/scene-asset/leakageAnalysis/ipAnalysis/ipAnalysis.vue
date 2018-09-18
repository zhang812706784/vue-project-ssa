<template>
    <div>
        <Tabs  v-model="tabFlag">

            <TabPane label="IP信息分析" name="ipAnalysis" class="tabItem">
                <div >
                    <Row :gutter="10" class="chart-row">
                        <Col :span="12">
                            <tp-ssa-echarts ref="refIpLocal" :allParams="allParamsIpLocal"></tp-ssa-echarts>
                        </Col>
                        <Col :span="12">
                            <tp-ssa-echarts ref="refLoopholeTypeMax" :allParams="allParamsLoopholeTypeMax"></tp-ssa-echarts>
                        </Col>

                    </Row>

                    <Row :gutter="10" class="chart-row">
                        <Col :span="12">
                            <tp-ssa-echarts ref="refSiteMax" :allParams="allParamsSiteMax"></tp-ssa-echarts>
                        </Col>

                        <Col :span="12">
                            <tp-ssa-echarts ref="refLoopholeMax" :allParams="allParamsLoopholeMax" ></tp-ssa-echarts>

                        </Col>
                    </Row>

                    <Row :gutter="10" class="chart-row">
                        <Col :span="12">
                            <tp-ssa-echarts ref="refHighLoophole" :allParams="allParamsHighLoophole"></tp-ssa-echarts>

                        </Col>

                        <Col :span="12">
                            <tp-ssa-echarts ref="refPortExpose" :allParams="allParamsPortExpose"></tp-ssa-echarts>

                        </Col>
                    </Row>

                </div>

            </TabPane>

            <TabPane label="IP列表" name="ipList" class="tabItem">
                <div >
                    <tp-table ref="reftable" :all_params="tableParams" ></tp-table>
                </div>

            </TabPane>

            <tp-ssa-selectbtn  slot="extra" :all_params="allParamsSelect" @select-confirm="selectConfirmCallback"></tp-ssa-selectbtn>

        </Tabs>
    </div>
</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaSelectbtn from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-selectbtn";
    import IpListDetail from "./ipListDetail";

    export default {
        name: "ipAnalysis",
        components: {IpListDetail, TpSsaSelectbtn, TpTable, TpSsaEcharts},
        data() {
            return {
                selectDetailDate:{
                    _data:{},
                    uuid:'',
                    ip_position:'',
                    ip_GeoPosition:'',
                    siteCount:'',
                    openPortServer:[],//resultPort
                    loopholeAllCnt:'',
                    loopholeTypeCnt:'',
                    highLevelCnt:'',
                    loopholePorCnt:''
                },
                //筛选参数配置
                allParamsSelect: {
                    url: '/api/getbar',
                    index: 'ipweb_result',
                    type: 'ip_geo_info',
                    aggFieldlist: {
                        'ip_position': "IP地区",
                        'uuid': "IP地址",
                        // 'loopholePorCnt':"开放端口",
                    }
                },
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                tabFlag: 'ipAnalysis',
                //allParams  为echarts参数配置
                allParamsIpLocal: {
                    id: 'ipLocal',
                    type: "pie",
                    title: "IP地域分布",
                    url: '/api/getpie',
                    reload: 20000,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        aggField: "ip_position",
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery(this.allParamsIpLocal.data.aggField, params.name);
                        }
                    },
                },
                allParamsLoopholeTypeMax: {
                    id: 'loopholeTypeMax',
                    type: "pie",
                    title: "漏洞类型最多的IP",
                    url: '/api/getpie',
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sort: {"loopholeTypeCnt": "desc"},
                        showField: "loopholeTypeCnt",
                        page: 1,
                        size: 10,
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid", params.name);
                        }
                    }
                },
                allParamsSiteMax: {  //crossbar
                    id: 'siteMax',
                    type: "crossBar",
                    title: "站点最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sort: {"webstatic.webSiteTotol": "desc"},
                        showField: "webstatic.webSiteTotol",
                        page: 1,
                        size: 5
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid", params.name);
                        }
                    }
                },
                allParamsLoopholeMax: {
                    id: 'loopholeMax',
                    type: "bar",
                    title: "漏洞最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sort: {"loopholeAllCnt": "desc"},
                        showField: "loopholeAllCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid", params.name);
                        }
                    },
                },
                allParamsHighLoophole: {
                    id: 'highLoophole',
                    type: "bar",
                    title: "高危漏洞最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sort: {"highLevelCnt": "desc"},
                        showField: "highLevelCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid", params.name);
                        }
                    },
                },
                allParamsPortExpose: {
                    id: 'portExpose',
                    type: "bar",
                    title: "端口暴露最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sort: {"loopholePorCnt": "desc"},
                        showField: "loopholePorCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid", params.name);

                        }
                    },
                },
                //tableParams  表格参数配置
                tableParams: {
                    id: 'ipList1',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type: 'table',
                    ajaxType: 'get',
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info"
                    },
                    add_btn: false,
                    del_btn: false,
                    modify_btn: false,
                    cols: [
                        {
                            title: 'Ip地址',
                            search: 'uuid',
                            render: (h, params) => {
                                return h('div', params.row._source.uuid)
                            }
                        },
                        {
                            title: '地理位置',
                            search: 'ip_position',
                            render: (h, params) => {
                                return (params.row._source.ip_position === "" || params.row._source.ip_position === "_none_access") ?
                                    h('div', '暂无数据') : h('div', params.row._source.ip_position)
                            }
                        },
                        {
                            title: '经纬度',
                            search: "ip_GeoPosition.D_L",
                            render: (h, params) => {
                                return h('div', params.row._source.ip_GeoPosition.D_L || '私有地址')
                            }
                        },
                        {
                            title: '站点数',
                            render: (h, params) => {
                                return h('div', params.row._source.webstatic.webSiteTotol)
                            }
                        },
                        {
                            title: '无效数',
                            render: (h, params) => {
                                return h('div', params.row._source.webstatic.webSiteNoneTitle || 0)
                            }
                        },
                        {
                            title: '备案数',
                            render: (h, params) => {
                                return h('div', params.row._source.webstatic.webSiteNoneAccess || 0)
                            }
                        },
                        {
                            title: '漏洞数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeAllCnt)
                            }
                        },
                        {
                            title: '漏洞类型',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeTypeCnt)
                            }
                        },
                        {
                            title: '严重告警数量',
                            render: (h, params) => {
                                return h('div', params.row._source.highLevelCnt)
                            }
                        },
                        {
                            title: '开放端口数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholePorCnt)
                            }
                        },
                        {
                            title: '操作',
                            render: (h, params) => {
                                let data=params.row._source;
                                let CombQueryDataObject={
                                    uuid : data.uuid,
                                    ip_position:data.ip_position,
                                    ip_GeoPosition:data.ip_GeoPosition.D_L,
                                    siteCount:data.webstatic.webSiteTotol,
                                    loopholeAllCnt: data.loopholeAllCnt,
                                    loopholeTypeCnt: data.loopholeTypeCnt,
                                    highLevelCnt: data.highLevelCnt,
                                    loopholePorCnt: data.loopholePorCnt,
                                    strIP:data.strIP,
                                };
                                if(!data.ip_GeoPosition.D_L){
                                    CombQueryDataObject.ip_GeoPosition= '私有地址'
                                }

                                return h('a', {
                                    on: {
                                        click:()=>{
                                            this.$router.push({
                                                name: "ipListDetail",
                                                params: {
                                                    source: 'ipAnalysis',
                                                    CombQueryDataObject: CombQueryDataObject
                                                }

                                            })
                                        }
                                    }
                                }, '详情')
                            }
                        }
                    ],
                }
            }
        },

        methods: {
            //筛选返回参数  刷新echart table
            selectConfirmCallback(combQuerys) {
                let CombQueryDataObject = {};
                if (combQuerys) {
                    CombQueryDataObject = {CombQuerys: combQuerys};
                }

                this.$refs.refIpLocal.changeParams(CombQueryDataObject);
                this.$refs.refLoopholeTypeMax.changeParams(CombQueryDataObject);
                this.$refs.refSiteMax.changeParams(CombQueryDataObject);
                this.$refs.refLoopholeMax.changeParams(CombQueryDataObject);
                this.$refs.refHighLoophole.changeParams(CombQueryDataObject);
                this.$refs.refPortExpose.changeParams(CombQueryDataObject);
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            //点击echart  跳转到相应的列表  刷新列表
            jumpToTableWithCombQuery(aggField, value) {
                let CombQueryDataObject = {CombQuerys: {[aggField]: [value]}};
                this.tabFlag = 'ipList';//跳转
                this.$refs.reftable.changeParams(CombQueryDataObject);
            }
        },
        mounted() {
            //地图
            if (this.$route.params.mapKey) {
                console.log(this.$route.params.mapKey)

                setTimeout(() => {
                    this.tabFlag = 'ipList'
                }, 500)
            }


            /*if(this.$route().params)*/


            let source = this.$route.params.source;
            setTimeout(() => {
                if (source && source === 'threatIntelligence' || source === 'loopholeAnalysis') {
                    this.tabFlag = 'ipList';//跳转
                    let CombQueryDataObject = this.$route.params.CombQueryDataObject;
                    this.$refs.reftable.changeParams(CombQueryDataObject);
                }
            }, 500);


        }
    }
</script>

<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import './../../../scene-demo/tables/components/table.less';
    .tabItem{
        height: calc(~"100vh + 200px");
    }
    .chart-row {
        .ivu-col {
            background-clip: content-box;
            height:220px;
            margin-bottom: 10px;
            background-color: rgba(255,255,255,0.1);
        }
    }


</style>
