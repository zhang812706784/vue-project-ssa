<template>
    <Tabs v-model="tabFlag">

        <TabPane label="站点漏洞分析" name="siteInfo" class="tabItem">
            <Row :gutter="10" class="chart-row">
                <Col span="12" class="chart-container">

                    <Row class="circle-container">
                        <Col span="5"></Col>
                        <Col span="5">
                            <tp-ssa-echarts :allParams="circle1"></tp-ssa-echarts>
                        </Col>
                        <Col span="5">
                            <tp-ssa-echarts :allParams="circle2"></tp-ssa-echarts>
                        </Col>
                        <Col span="5">
                            <tp-ssa-echarts :allParams="circle3"></tp-ssa-echarts>
                        </Col >
                        <Col span="4"></Col>

                    </Row>

                </Col>

                <Col span="12" class="chart-container">

                    <tp-ssa-echarts ref="refDomainName" :allParams="allParamsDomainName"></tp-ssa-echarts>

                </Col>

            </Row>

            <Row :gutter="10" class="chart-row">
                <Col span="12" class="chart-container">

                    <tp-ssa-echarts ref="refSiteMax" :allParams="allParamsSiteMax"></tp-ssa-echarts>

                </Col>

                <Col span="12" class="chart-container">

                    <tp-ssa-echarts ref="refIpCollection" :allParams="allParamsIpCollection" ></tp-ssa-echarts>

                </Col>
            </Row>

            <Row :gutter="10" class="chart-row">
                <Col span="12" class="chart-container">

                    <tp-ssa-echarts ref="refUnitProperties" :allParams="allParamsUnitProperties" ></tp-ssa-echarts>

                </Col>

                <Col span="12" class="chart-container">

                    <tp-ssa-echarts ref="refSiteRcord" :allParams="allParamsSiteRcord" ></tp-ssa-echarts>

                </Col>
            </Row>
        </TabPane>

        <TabPane label="站点列表" name="siteInfoList" class="tabItem">

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
        name: "siteInfo",
        components: {TpSsaSelectbtn, TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                tabFlag: 'siteInfo',
                //筛选参数配置
                allParamsSelect: {
                    url: '/api/getbar',
                    index: 'ipweb_db',
                    type: 'web_info',
                    aggFieldlist: {
                        'webdemain': "域名",
                        'strIP': "网站IP",
                    }
                },
                //echart图配置参数
                circle1: {
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
                circle2: {
                    id: 'siteRecord',
                        type: "circle",
                        title: "站点备案数",
                        url: '/api/ssa_table',
                        data: {
                        index: "ipweb_db",
                            type:  "web_info",
                            queryObj:{'legalityInfo.legality':"true"},
                        page:1,
                            size:10
                    }
                },
                circle3: {
                    id: 'siteNoRecord',
                        type: "circle",
                        title: "库中未备案数",
                        url: '/api/ssa_table',
                        data: {
                        index: "ipweb_db",
                            type:  "web_info",
                            queryObj:{'legalityInfo.legality':"false"},
                        page:1,
                            size:10
                    }
                },
                allParamsDomainName: {
                    id: 'domainName',
                        type: "pie",
                        title: "公司域名归属信息TOP10",
                        url: '/api/getpie',
                        data: {
                            index: "ipweb_db",
                            type: "web_info",
                            aggField: "legalityInfo.webName",
                            size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("legalityInfo.webName",params.name);
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
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("strIP",params.name);
                        }
                    }
                },
                allParamsIpCollection: {//跳转到  IP地址信息库  IP列表
                    id: 'ipCollection',
                        type: "pie",
                        title: "IP集中区域分布",
                        url: '/api/getpie',
                        reload: 0,
                        data: {
                        index: "ipweb_db",
                            type: "ip_geo_info",
                            aggField: "ip_position",
                            size: 10
                    },
                    event: {
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["ip_position"]: [params.name]}};
                            this.$router.push({
                                name: "ipAddrressPage_index",
                                params: {
                                    source: 'siteInfo',
                                    CombQueryDataObject: CombQueryDataObject
                                }
                            })
                        }
                    }
                },
                allParamsUnitProperties: {
                    id: 'unitProperties',
                        type: "bar",
                        title: "单位性质分布",
                        url: '/api/getbar',
                        reload: 0,
                        data: {
                            index: "ipweb_db",
                            type: "web_info",
                            aggField: "legalityInfo.websponsorNature",
                            size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("legalityInfo.websponsorNature",params.name);
                        }
                    }
                },
                allParamsSiteRcord: {
                    id: 'siteRcord',
                    type: "pie",
                    title: "站点备案分布",
                    url: '/api/getpie',
                    reload: 0,
                    config: {
                        label:{
                            formatter:function (params) {
                                if(params.data.name==="false"){
                                    return '未备案'
                                }else {
                                    return '已备案'
                                }
                            }
                        }
                    },
                    data: {
                        index: "ipweb_db",
                        type: "web_info",
                        aggField: "legalityInfo.legality",
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("legalityInfo.legality",params.name);
                        }
                    }
                },
                //tableParams  为table参数配置
                tableParams: {
                    id: 'siteList',
                    index: true,
                    checkBox: false,
                    url: '/api/asset_physics/phy_border/ip_list',
                    type: 'table',
                    ajaxType: 'get',
                    data: {
                        index: "ipweb_db",
                        type: "web_info",
                        //combQuerys: combQuerys
                    },
                    add_btn: false,
                    del_btn: false,
                    modify_btn: false,
                    cols: [
                        {
                            title: '域名',
                            search: 'webdemain',
                            render: (h, params) => {
                                return h('div', params.row._source.webdemain);
                            }
                        },
                        {
                            title: '网站IP地址',
                            search: 'strIP',
                            render: (h, params) => {
                                return h('div', params.row._source.strIP);
                            }
                        },
                        {
                            title: '公司名称',
                            search: 'legalityInfo.webName',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.webName === "" || params.row._source.legalityInfo.webName == null) {
                                    return h('div', '(无)');
                                } else {
                                    if (params.row._source.legalityInfo.webName.length > 3) {
                                        let webName = params.row._source.legalityInfo.webName.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.webName
                                            }
                                        }, webName + '...');
                                    } else {
                                    return h('div', params.row._source.legalityInfo.webName);
                                    }
                                }

                            }
                        },
                        {
                            title: '网站首页',
                            render: (h, params) => {
                                return h('div', params.row._source.webdemain);
                            }
                        },
                        {
                            title: '网站标题',
                            render: (h, params) => {
                                if (params.row._source.title === "" || params.row._source.title == null) {
                                    return h('div', '(无)');
                                } else if (params.row._source.title === "_none_access" || params.row._source.title === "_none_title" || params.row._source.title === "Not Found") {
                                    return h('div', '(无)');
                                } else if (params.row._source.title.indexOf("Error") === "-1") {
                                    return h('div', '(无)');
                                }
                                else {
                                    if (params.row._source.title.length > 3) {
                                        let title = params.row._source.title.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.title
                                            }
                                        }, title + '...');
                                    } else {
                                    return h('div', params.row._source.title);
                                    }
                                }
                            }
                        },
                        {
                            title: '备案',
                            search: 'legalityInfo.legality',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.webrecords === "" || params.row._source.legalityInfo.webrecords == null) {
                                    return h('div', '未备案')
                                } else {
                                    if (params.row._source.legalityInfo.webrecords.length > 3) {
                                        let webrecords = params.row._source.legalityInfo.webrecords.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.webrecords
                                            }
                                        }, webrecords + '...')
                                    } else {
                                    return h('div', params.row._source.legalityInfo.webrecords);
                                    }
                                }
                            }
                        },
                        {
                            title: '主办单位',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.websponsor === "" || params.row._source.legalityInfo.websponsor == null) {
                                    return h('div', '(无)');
                                } else {
                                    if (params.row._source.legalityInfo.websponsor.length > 3) {
                                        let websponsor = params.row._source.legalityInfo.websponsor.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.websponsor
                                            }
                                        }, websponsor + '...')
                                    } else {
                                    return h('div', params.row._source.legalityInfo.websponsor);
                                    }
                                }
                            }
                        },
                        {
                            title: '单位性质',
                            search: 'legalityInfo.websponsorNature',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.websponsorNature === "" || params.row._source.legalityInfo.websponsorNature == null) {
                                    return h('div', '(无)');
                                } else {
                                    return h('div', params.row._source.legalityInfo.websponsorNature)
                                }
                            }
                        }
                    ]
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

                this.$refs.refDomainName.changeParams(CombQueryDataObject);
                this.$refs.refSiteMax.changeParams(CombQueryDataObject);
                this.$refs.refIpCollection.changeParams(CombQueryDataObject);
                this.$refs.refUnitProperties.changeParams(CombQueryDataObject);
                this.$refs.refSiteRcord.changeParams(CombQueryDataObject);
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            //点击echart  跳转到相应的列表  刷新列表
            jumpToTableWithCombQuery(aggField,value ) {

                let CombQueryDataObject={search:{[aggField]: value}};
                this.tabFlag = 'siteInfoList';//跳转
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            getCombQueryDataObject(params){
                let data=params.row._source;
                let CombQueryDataObject={
                    domain : data.webdemain,
                    strIP:data.strIP,
                    companyName:data.legalityInfo.webName,
                    webdemain:data.webdemain,
                    title:data.title,
                    webRecords:data.legalityInfo.webrecords,
                    websponsor:data.legalityInfo.websponsor,
                    websponsorNature:data.legalityInfo.websponsorNature,

                    loopholeAllCnt: data.loopholeAllCnt,
                    loopholeTypeCnt: data.loopholeTypeCnt,
                    highLevelCnt: data.highLevelCnt,
                    loopholePorCnt: data.loopholePorCnt
                };
                if (data.legalityInfo.webName === "" || data.legalityInfo.webName == null) {
                    CombQueryDataObject.companyName= '(无)'
                }
                if (data.title === "" || data.title == null) {
                    CombQueryDataObject.title= '(无)'
                } else if (data.title === "_none_access" || data.title === "_none_title" || data.title === "Not Found") {
                    CombQueryDataObject.title= '(无)'
                } else if (data.title.indexOf("Error") === "-1") {
                    CombQueryDataObject.title= '(无)'
                }
                if (data.legalityInfo.webrecords === "" || data.legalityInfo.webrecords == null) {
                    CombQueryDataObject.webRecords= '未备案'
                }
                if(data.legalityInfo.websponsor === "" || data.legalityInfo.websponsor == null){
                    CombQueryDataObject.websponsor= '(无)'
                }
                if(data.legalityInfo.websponsorNature  === "" || data.legalityInfo.websponsorNature == null){
                    CombQueryDataObject.websponsorNature= '(无)'
                }
                return  CombQueryDataObject;
            }
        },
        mounted(){
            let source = this.$route.params.source;
            setTimeout(()=>{
                if(source && source === 'ipAddress'){
                    this.tabFlag = 'siteInfoList';//跳转
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
