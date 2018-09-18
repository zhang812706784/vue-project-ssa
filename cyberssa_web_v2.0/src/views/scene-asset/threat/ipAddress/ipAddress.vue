<template>
    <Tabs v-model="tabFlag">

        <TabPane label="IP信息分析" name="ipAddress" class="tabItem">
            <Row :gutter="10" class="chart-row">

                <Col class="chart-container" span="12">

                    <Row class="circle-container">

                        <Col span="6"></Col>

                        <Col span="6">
                            <tp-ssa-echarts :allParams="circle1"></tp-ssa-echarts>
                        </Col>

                        <Col span="6">
                            <tp-ssa-echarts :allParams="circle2"></tp-ssa-echarts>
                        </Col>

                        <Col span="6"></Col>

                    </Row>

                </Col>

                <Col class="chart-container" span="12">

                    <tp-ssa-echarts ref="refIpLocal" :allParams="allParamsIpLocal"></tp-ssa-echarts>

                </Col>

            </Row>

            <Row :gutter="10"  class="chart-row">
                <Col class="chart-container" span="12">

                    <tp-ssa-echarts ref="refSiteMax" :allParams="allParamsSiteMax"></tp-ssa-echarts>

                </Col>

                <Col class="chart-container" span="12">

                    <tp-ssa-echarts ref="refWebType" :allParams="allParamsWebType"></tp-ssa-echarts>

                </Col>
            </Row>

        </TabPane>

        <TabPane label="IP列表" name="ipAddressList" class="tabItem">

            <tp-table ref="reftable" :all_params="tableParams" ></tp-table>

        </TabPane>
        <tp-ssa-selectbtn  slot="extra" :all_params="allParamsSelect" @select-confirm="selectConfirmCallback"></tp-ssa-selectbtn>
    </Tabs>

</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaSelectbtn from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-selectbtn";

    export default {
        name: "ipAddress",
        components: {TpSsaSelectbtn, TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                tabFlag:'ipAddress',
                //筛选参数配置
                allParamsSelect:{
                    url: '/api/getbar',
                    index: 'ipweb_db',
                    type: 'ip_geo_info',
                    aggFieldlist:{
                        'uuid':"IP地址",
                        'ip_GeoPosition.P':"IP地区",
                        'resultPort':"端口服务",
                        //     title: '端口服务',
                        //         key: 'resultPort',
                        //     checked: true,
                        //     customSearch: true,
                        //     url: config.PLATFORM_URL + '/getbar',
                        //     data: {
                        //     index: 'ipweb_db',
                        //         type: 'lph_scan_result',
                        //         aggField: 'resultPort'
                        // }
                        // }
                    }
                },

                //echart图配置参数
                circle1: {
                    id: 'ipSum',
                    type: "circle",
                    title: "库中IP总数",
                    url: '/api/ssa_table',
                    data: {
                        index: "ipweb_db",
                        type:  "ip_geo_info",
                        page:1,
                        size:10
                    }
                },
                circle2: {
                    id: 'siteSum',
                    type: "circle",
                    title: "库中站点总数",
                    url: '/api/ssa_table',
                    data: {
                        index: "ipweb_db",
                        type:  "web_info",
                        page:1,
                        size:10
                    }
                },
                allParamsIpLocal: {
                    id: 'ipLocal',
                    type: "pie",
                    title: "IP地域分布",
                    url: '/api/getpie',
                    data: {
                        index: "ipweb_db",
                        type: "ip_geo_info",
                        aggField: "ip_position",
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("ip_position",params.name);
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
                    event: {
                        click: params => {
                            this.jumpToTableWithCombQuery("strIP",params.name)
                        }
                    }
                },
                allParamsWebType: {// 跳转到 站点信息库   站点列表
                    id: 'webType',
                    type: "pie",
                    title: "按备案网站类型统计",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: "ipweb_db",
                        type: "web_info",
                        queryObj:{"legalityInfo.legality":"true"},
                        aggField: "legalityInfo.websponsorNature"
                    },
                    event: {
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["legalityInfo.websponsorNature"]: [params.name]}};
                            this.$router.push({
                                name: "siteInfoPage_index",
                                params: {
                                    source: 'ipAddress',
                                    CombQueryDataObject: CombQueryDataObject
                                }
                            })
                        }
                    }
                },
                //tableParams  为table参数配置
                tableParams: {
                    id: 'ipAddressList',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: 'ipweb_db',
                        type:'ip_geo_info'
                        //combQuerys: combQuerys
                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: 'Ip地址',
                            search: 'uuid',
                            render: (h, params) =>{
                                return h('div',params.row._source.uuid)
                            }
                        },
                        {
                            title: '地理地址',
                            search: 'ip_position',
                            render: (h, params) =>{
                                return h('div',params.row._source.ip_position)
                            }
                        },
                        {
                            title: 'IP归属地',
                            search: 'ip_GeoPosition.P',
                            render: (h, params) =>{
                                return h('div',params.row._source.ip_GeoPosition.P)
                            }
                        },
                        {
                            title: '经纬度',
                            render: (h, params) =>{
                                return h('div',params.row._source.ip_GeoPosition.D_L || '私有地址')
                            }
                        },
                        {
                            title: '站点数',
                            render: (h, params) =>{
                                return h('div',params.row._source.webstatic.webSiteTotol)
                            }
                        },
                        {
                            title: '无效数',
                            render: (h, params) =>{
                                return h('div',params.row._source.webstatic.webSiteNoneTitle || 0)
                            }
                        },
                        {
                            title: '备案数',
                            render: (h, params) =>{
                                return h('div',params.row._source.webstatic.webSiteNoneAccess || 0)
                            }
                        }
                    ],
                }
            }
        },
        methods: {
            //筛选返回参数  刷新echart table
            selectConfirmCallback(combQuerys){
                let CombQueryDataObject={};
                if(combQuerys)
                {
                    CombQueryDataObject={CombQuerys: combQuerys};
                }

                this.$refs.refIpLocal.changeParams(CombQueryDataObject);
                this.$refs.refSiteMax.changeParams(CombQueryDataObject);
                this.$refs.refWebType.changeParams(CombQueryDataObject);
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            //点击echart  跳转到相应的列表  刷新列表
            jumpToTableWithCombQuery(aggField,value )
            {
                let CombQueryDataObject={CombQuerys:{[aggField]: [value]}};
                this.tabFlag = 'ipAddressList';//跳转
                this.$refs.reftable.changeParams(CombQueryDataObject);
            }
        },
        mounted(){
            let source = this.$route.params.source;
            setTimeout(()=>{
                if(source && source === 'threatIntelligence'|| source === 'siteInfo'){
                    this.tabFlag = 'ipAddressList';//跳转
                    let CombQueryDataObject = this.$route.params.CombQueryDataObject;
                    this.$refs.reftable.changeParams(CombQueryDataObject);
                }
            },500);

        },
    };
</script>

<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import './../../../scene-demo/tables/components/table.less';
    .tabItem{
        height: calc(~"100vh + 200px");
    }
    .chart-row {

        .chart-container {
            background-clip: content-box;
            height: 220px;
            margin-bottom: 10px;
            background-color: rgba(255, 255, 255, 0.01);
        }

        .circle-container {
            height: 100%;

            .ivu-col{
                height: 100%;
            }
        }
    }
</style>
