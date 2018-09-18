<template>
    <Tabs v-model="tabFlag">

        <TabPane label="漏洞分析" name="loopholeAnalysis" class="tabItem">
            <Row :gutter="10" class="chart-row">
                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholeType" :allParams="allParamsLoopholeType"></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholeSeverity" :allParams="allParamsLoopholeSeverity"></tp-ssa-echarts>

                </Col>

            </Row>

            <Row :gutter="10" class="chart-row">
                <Col :span="12" >

                    <tp-ssa-echarts ref="refAddressLoophole" :allParams="allParamsAddressLoophole"></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refIpLoopholeMax" :allParams="allParamsIpLoopholeMax" ></tp-ssa-echarts>

                </Col>
            </Row>

            <Row :gutter="10" class="chart-row">
                <Col :span="12">

                    <tp-ssa-echarts ref="refScanType" :allParams="allParamsScanType" ></tp-ssa-echarts>

                </Col>

                <Col :span="12">

                    <tp-ssa-echarts ref="refLoopholePort" :allParams="allParamsLoopholePort" ></tp-ssa-echarts>

                </Col>
            </Row>

        </TabPane>

        <TabPane label="漏洞列表" name="loopholeList" class="tabItem">

            <tp-table ref="reftable" :all_params="tableParams" ></tp-table>

        </TabPane>
        <!--筛选-->
        <tp-ssa-selectbtn  slot="extra" :all_params="allParamsSelect" @select-confirm="selectConfirmCallback"></tp-ssa-selectbtn>
    </Tabs>

</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaSelectbtn from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-selectbtn";

    export default {
        name: "loopholeAnalysis",
        components: {TpSsaSelectbtn,  TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                tabFlag:'loopholeAnalysis',
                //筛选参数配置
                allParamsSelect:{
                    url: '/api/getbar',
                    index: 'loophole_result',
                    type: 'lph_scan_result',
                    aggFieldlist:{
                        'nvtName':"漏洞名称",
                        'resultHost':"漏洞主机",
                        'resultPort':'漏洞位置',
                        'ip_position':"漏洞最多的地区"
                        // {
                        //     title: '漏洞最多的地区',
                        //      key: 'ip_position',
                        //     checked: true,
                        //     customSearch: true,
                        //     url: config.PLATFORM_URL + '/getbar',
                        //     data: {
                        //     index: "ipweb_result",
                        //         type: "ip_geo_info",
                        //         aggField: 'ip_position'
                        // }
                    }
                },
                //echart图参数配置
                allParamsLoopholeType: {
                    id: 'loopholeType',
                    type: "pie",
                    title: "漏洞类型分布",
                    url: '/api/getpie',
                    data: {
                        index: "loophole_result",
                        type:  "lph_scan_result",
                        aggField:"nvtName"
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("nvtName",params.name);
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
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("resultSeverity",params.name);
                        }
                    }
                },
                allParamsAddressLoophole: {//跳转到 IP分析页面   IP列表
                    id: 'addressLoophole',
                    type: "bar",
                    title: "漏洞最多的地区",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "ip_geo_info",
                        sumField:"loopholeAllCnt",
                        aggField: "ip_position",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["ip_position"]: [params.name]}};
                            this.$router.push({
                                name: "ipPage_index",
                                params: {
                                    source: 'loopholeAnalysis',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsIpLoopholeMax: {//端口/ass_loophole/loophole/loophole_top
                    id: 'ipLoopholeMax',
                    type: "bar",
                    title: "漏洞最多的IP",
                    url: '/api/ass_loophole/loophole/loophole_top',
                    reload: 0,
                    data: {
                        index: "loophole_result",
                        type: "lph_stastic_ip",
                        sort: {"loopholeAllCnt": "desc"},
                        aggField: "uuid",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("resultHost",params.name);//uuid
                        }
                    }
                },
                allParamsScanType: {
                    id: 'scanType',
                    type: "pie",
                    title: "漏洞扫描方式分布",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: "loophole_result",
                        type: "lph_scan_result",
                        aggField: "nvtQodType",
                        sort: {"nvtQodType": "desc"},
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("nvtQodType",params.name);
                        }
                    }
                },
                allParamsLoopholePort: {
                    id: 'loopholePort',
                    type: "pie",
                    title: "漏洞端口分布",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: "loophole_result",
                        type: "lph_scan_result",
                        aggField: "resultPort"
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("resultPort",params.name);
                        }
                    }
                },
                //tableParams  为table参数配置
                tableParams: {
                    id: 'loopholeList',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "loophole_result",
                        type: "lph_scan_result",
                        sort: {"taskStartTime": "desc"},
                        page: 1,
                        size: 10
                        //combQuerys:combQuerys
                    },

                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '漏洞名称',
                            key: 'nvtName',
                            search: 'nvtName',
                            render: (h, params) =>{
                                return h('div',params.row._source.nvtName)
                            }
                        },
                        {
                            title: '严重性',
                            key: 'resultSeverity',
                            render: (h, params) =>{
                                if (params.row._source.resultSeverity <= 5.0) {
                                    return h('div','低')
                                } else if (params.row._source.resultSeverity >= 8.0) {
                                    return h('div','高')
                                } else {
                                    return h('div','中')
                                }
                            }
                        },
                        {
                            title: '主机',
                            key: 'resultHost',
                            search:'resultHost',
                            render: (h, params) =>{
                                return h('div',params.row._source.resultHost)
                            }
                        },
                        {
                            title: '位置',
                            key: 'resultPort',
                            search:'resultPort',
                            render: (h, params) =>{
                                return h('div',params.row._source.resultPort)
                            }
                        },
                        {
                            title: '扫描方式',
                            key: 'nvtQodType',
                            search:'nvtQodType',
                            render: (h, params) =>{
                                return h('div',params.row._source.nvtQodType)
                            }
                        },
                        {
                            title: '漏洞等级',
                            key: 'resultSeverity',
                            search: 'resultSeverity',
                            searchtype:true,
                            render: (h, params) =>{
                                return h('div',Math.abs(params.row._source.resultSeverity))
                            }
                        },
                        {
                            title: '操作',
                            key: 'operation',
                            render: (h,params) => {
                                //let _data = JSON.stringify(params.row._source).replace(/"/g, "'");
                                return h('a', {
                                    domProps:{
                                        href:'#'
                                    }
                                },'详情')
                            }
                        }
                    ]
                }
            }
        },
        mounted(){
            let source = this.$route.params.source;
            setTimeout(()=>{
                if(source && source === 'countPandect' || source === 'threatIntelligence'){
                    this.tabFlag = 'loopholeList';//跳转
                    let CombQueryDataObject = this.$route.params.CombQueryDataObject;
                    this.$refs.reftable.changeParams(CombQueryDataObject);
                }
            },500);

        },
        methods: {
            //筛选返回参数  刷新echart table
            selectConfirmCallback(combQuerys){
                let CombQueryDataObject={};
                if(combQuerys)
                {
                    CombQueryDataObject={CombQuerys: combQuerys};
                }

                this.$refs.refLoopholeType.changeParams(CombQueryDataObject);
                this.$refs.refLoopholeSeverity.changeParams(CombQueryDataObject);
                this.$refs.refAddressLoophole.changeParams(CombQueryDataObject);
                this.$refs.refIpLoopholeMax.changeParams(CombQueryDataObject);
                this.$refs.refScanType.changeParams(CombQueryDataObject);
                this.$refs.refLoopholePort.changeParams(CombQueryDataObject);
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            //点击echart  跳转到相应的列表  刷新列表
            jumpToTableWithCombQuery(aggField,value )
            {
                let CombQueryDataObject={CombQuerys:{[aggField]: [value]}};
                this.tabFlag = 'loopholeList';//跳转
                this.$refs.reftable.changeParams(CombQueryDataObject);
            }
        }
    };
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
            background-color: rgba(255,255,255,0.01);
        }
    }

</style>
