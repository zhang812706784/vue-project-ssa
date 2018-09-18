<template>
    <Tabs v-model="tabFlag">

        <TabPane label="站点漏洞分析" name="siteAnalysis" class="tabItem">
            <Row :gutter="10" class="chart-row">
                <Col :span="12" >
                    <tp-ssa-echarts ref="refSiteRecord" :allParams="allParamsSiteRecord"></tp-ssa-echarts>
                </Col>

                <Col :span="12">
                    <tp-ssa-echarts ref="refDomainName" :allParams="allParamsDomainName"></tp-ssa-echarts>
                </Col>
            </Row>

            <Row :gutter="10" class="chart-row">
                <Col :span="12" >
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

            <Row :gutter="10" class="chart-row">
                <Col :span="12">
                    <tp-ssa-echarts ref="refWebType" :allParams="allParamsWebType" ></tp-ssa-echarts>
                </Col>

                <Col :span="12">
                    <tp-ssa-echarts ref="refLoopholeType" :allParams="allParamsLoopholeType" ></tp-ssa-echarts>
                </Col>
            </Row>
        </TabPane>

        <TabPane label="站点列表" name="siteList" class="tabItem">

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
        name: "siteAnalysis",
        components: {TpSsaSelectbtn, TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                tabFlag:'siteAnalysis',
                //筛选参数配置
                allParamsSelect:{
                    url: '/api/getbar',
                    index: 'ipweb_result',
                    type: 'web_info',
                    aggFieldlist:{
                        'webdemain':"域名",
                        'strIP':"网站IP",
                        'legalityInfo.legality':"备案统计",
                    }
                },
                //echart图配置参数
                allParamsSiteRecord: {
                    id: 'siteRecord',
                    type: "pie",
                    title: "站点备案分布",
                    url: '/api/getpie',
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
                        index: "ipweb_result",
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
                allParamsDomainName: {
                    id: 'domainName',
                    type: "pie",
                    title: "域名最多的公司Top10",
                    url: '/api/getpie',
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        aggField: "legalityInfo.webName",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("legalityInfo.webName",params.name);
                        }
                    }
                },
                allParamsSiteMax: {//crossBar
                    id: 'siteMax',
                    type: "crossBar",
                    title: "站点数最多的IP",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        aggField: "strIP",
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("strIP",params.name);
                        }
                    }
                },
                allParamsLoopholeMax: {
                    id: 'loopholeMax',
                    type: "bar",
                    title: "漏洞最多的网站",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        sort: {"loopholeAllCnt": "desc"},
                        showField: "loopholeAllCnt",
                        page: 1,
                        size: 10,
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("webdemain",params.name);
                        }
                    }
                },
                allParamsHighLoophole: {
                    id: 'highLoophole',
                    type: "bar",
                    title: "高危漏洞最多的网站",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        sort: {"highLevelCnt": "desc"},
                        showField: "highLevelCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("uuid",params.name);
                        }
                    }
                },
                allParamsPortExpose: {
                    id: 'portExpose',
                    type: "bar",
                    title: "端口暴露最多的站点",
                    url: '/api/getbar',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        sort: {"loopholePorCnt": "desc"},
                        showField: "loopholePorCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("webdemain",params.name);
                        }
                    }
                },
                allParamsWebType: {
                    id: 'webType',
                    type: "pie",
                    title: "按备案网站类型统计",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        queryObj:{"legalityInfo.legality":"true"},
                        aggField: "legalityInfo.websponsorNature",
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("legalityInfo.websponsorNature",params.name);
                        }
                    }
                },
                allParamsLoopholeType: {
                    id: 'loopholeType',
                    type: "pie",
                    title: "漏洞类型最多网站",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: "ipweb_result",
                        type: "web_info",
                        sort: {"loopholeTypeCnt": "desc"},
                        showField: "loopholeTypeCnt",
                        page: 1,
                        size: 10
                    },
                    event: {
                        click: params => {
                            /*查询的字段域 和 字段value */
                            this.jumpToTableWithCombQuery("webdemain",params.name);
                        }
                    }
                },
                //tableParams  为table参数配置
                tableParams: {
                    id: 'siteList',
                    index: true,
                    checkBox: false,
                    url: '/api/asset_physics/phy_border/ip_list',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "ipweb_result",
                        type: "web_info",
                        //combQuerys: combQuerys
                    },

                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
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
                                        return h('div', {
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
                                        return h('div', {
                                            domProps: {
                                                title: params.row._source.title
                                            }
                                        }, title+"...");
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
                        },
                        {
                            title: '漏洞数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeAllCnt);
                            }
                        },
                        {
                            title: '漏洞类型',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeTypeCnt);
                            }
                        },
                        {
                            title: '严重告警数量',
                            render: (h, params) => {
                                return h('div', params.row._source.highLevelCnt);
                            }
                        },
                        {
                            title: '开放端口数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholePorCnt);
                            }
                        },
                        {
                            title: '操作',
                            render: (h, params) => {
                                return h('a', {
                                    on: {
                                        click:()=>{
                                            this.$router.push({
                                                name: "siteListDetail",
                                                params: {
                                                    source: 'siteAnalysis',
                                                    CombQueryDataObject: this.getCombQueryDataObject(params)
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
            selectConfirmCallback(combQuerys){
                let CombQueryDataObject={};
                if(combQuerys)
                {
                    CombQueryDataObject={CombQuerys: combQuerys};
                }

                this.$refs.refSiteRecord.changeParams(CombQueryDataObject);
                this.$refs.refDomainName.changeParams(CombQueryDataObject);
                this.$refs.refSiteMax.changeParams(CombQueryDataObject);
                this.$refs.refLoopholeMax.changeParams(CombQueryDataObject);
                this.$refs.refHighLoophole.changeParams(CombQueryDataObject);
                this.$refs.refPortExpose.changeParams(CombQueryDataObject);
                this.$refs.refWebType.changeParams(CombQueryDataObject);
                this.$refs.refLoopholeType.changeParams(CombQueryDataObject);
                this.$refs.reftable.changeParams(CombQueryDataObject);
            },
            //点击echart  跳转到相应的列表  刷新列表
            jumpToTableWithCombQuery(aggField,value ) {
                let CombQueryDataObject={search:{[aggField]: value,}};
                this.tabFlag = 'siteList';//跳转
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
                if(source && source === 'countPandect'){
                    this.tabFlag = 'siteList';//跳转
                    let CombQueryDataObject = this.$route.params.CombQueryDataObject;
                    this.$refs.reftable.changeParams(CombQueryDataObject);
                }
            },300);
        },
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
            background-color: rgba(255,255,255,0.01);
        }
    }


</style>
