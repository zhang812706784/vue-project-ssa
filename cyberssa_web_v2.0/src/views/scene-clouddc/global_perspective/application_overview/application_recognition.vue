<template>
    <Tabs value="应用识别统计分析">
        <TabPane label="应用识别统计分析" name="应用识别统计分析">
            <Button class="buttonbottom" v-for="(item,index) in buttonList" v-on:click="fun(item,index)" :class="{ active: titleActive == index}">{{item}}</Button>
            <br>
            <Button :class="{ active: paramActive == 'apply'}" v-on:click="changeProgram('AppName','SrcIP',true,'应用排名TOP10','应用TOP5历史趋势图')" @click="activeButton('apply')">应用</Button>
            <Button :class="{ active: paramActive == 'SrcIP'}" v-on:click="changeProgram('SrcIP','AppName',false,'源IPTOP10','源IPTOP5历史趋势图')" @click="activeButton('SrcIP')">源IP</Button>
            <Button :class="{ active: paramActive == 'DstIP'}" v-on:click="changeProgram('DstIP','AppName',false,'目的IPTOP10','目的IPTOP5历史趋势图')" @click="activeButton('DstIP')">目的IP</Button>
            <br>
            <Row class="page-container" v-if="show1">
                <Col span="12" style="height: 240px">
                    <tp-ssa-echarts ref="allParams" :allParams="allParams" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
                <Col span="12" style="height: 240px">
                    <tp-ssa-echarts ref="allParams1" :allParams="allParams1" @on-click="testEvent"></tp-ssa-echarts>
                </Col>
            </Row>
            <tp_two_stage_drilling_plugin_app :all_params="twoStageDrillingParamsApp" ref="twoStageDrillingParamsRef"></tp_two_stage_drilling_plugin_app>
            <div style="position: absolute;top:-52px;right:20px;">
                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
            </div>
        </TabPane>
        <TabPane label="应用识别日志列表" name="name2">
            <tp-table ref="all_paramstable" :all_params="all_paramstable"></tp-table>
        </TabPane>
    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import tp_two_stage_drilling_plugin_app from "../../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-app";
    import app from "../../../../store/store-modules/store-app";
    export default {
        name: "application_recognition",
        components: {TpTable, TpSsaEcharts, tp_two_stage_drilling_plugin_app},
        data () {
            return {
                buttonList:[],
                show1:true,
                barRefs: '',
                msg: '应用识别',
                timeout: 20000,
                appGroup: "数据传输",
                titleActive:0,
                paramActive:'apply',
                begTime: (new Date().getTime()) - 10800000,
                endTime: new Date().getTime(),
                twoStageDrillingParamsApp:{},
                FirstDrillingType: 'AppName',
                SecondDrillingType: "SrcIP",
                fieldSet:{
                    AppName:'应用名',
                    SrcIP:'源IP',
                    DstIP:"目的IP"
                },
                firstBarTitle:"应用排名TOP10",
                trendTitle:'应用TOP5历史趋势图',
                allParams: {
                    id: 'appTypePie',
                    type: "pie",
                    title: "应用名称占比",
                    url: '/api/cr_app/identify/pie_chart',
                    reload: this.timeout,
                    data: {
                        begTime:null,
                        endTime:null,
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp',
                    }
                },
                allParams1: {
                    id: 'appTypeLines',
                    type: "line",
                    title: "应用名称Top5历史趋势",
                    url: '/api/cr_app/identify/trend_chart',
                    reload: this.timeout,
                    data: {
                        begTime:null,
                        endTime:null,
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp',
                        queryObj:''
                    }
                },
                all_paramstable:{},
                testConfig: {
                    grid: {
                        left: '4%'
                    }
                }
            };
        },
        created(){
            this.myCreated()
            this.addGroup()
        },
        methods: {
            myCreated () {
                this.twoStageDrillingParamsApp = {
                    //一级钻取字段和二级钻取字段
                    FirstDrillingType: this.FirstDrillingType,
                    SecondDrillingType: this.SecondDrillingType,
                    begTime: this.begTime,
                    endTime: this.endTime,
                    appGroup: this.appGroup,

                    //一级钻取柱状图参数
                    bar_elementID: 'appBar',
                    bar_title: "应用排名Top10",
                    bar_url: '/api/cr_app/identify/top_chart',
                    firstBarData: {
                        appGroup: this.appGroup,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: '',
                        size:5,
                    },

                    //一级钻取topN趋势图参数
                    trend_elementID: 'appLines',
                    trendTitle: "应用排名Top5历史趋势",
                    trendUrl: '/api/cr_app/identify/trend_chart',
                    firstLinesData: {
                        aggGroup: this.aggGroup,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: ''
                    },

                    //二级钻取table表格参数
                    SecondTableElementID: "realsecondtableundefined",
                    SecondTableURL: '/api/cr_app/identify/top_chart',
                    SecondTableListColumns: [
                        {
                            title: '序号',
                            type: 'index',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: this.fieldSet[this.FirstDrillingType],
                            key:  'selectFirstFiledValue',
                        },
                        {
                            title: this.fieldSet[this.SecondDrillingType],
                            key: 'key',
                        },
                        {
                            title: '次数',
                            key: 'doc_count',
                        }
                    ],
                    SecondTableData:{
                        aggGroup: this.aggGroup,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: ''
                    },

                    //二级钻取趋势图参数
                    SecondTrendElementID: "appDetailTrend",
                    SecondTrendTitle: "趋势图",
                    SecondTrendURL: '/api/cr_app/identify/top_detail_trend',
                    ScondLinesData: {
                        aggGroup: this.aggGroup,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.SecondDrillingType,
                        subAggsType: "value_count",
                        subAggsCol: "@timestamp",
                        selectKeys: "",
                    }
                };
                this.all_paramstable={
                    id: "table",
                    type: "table",
                    ajaxType: "get",
                    checkBox: true,
                    url: '/api/cr_app/identify/appidentify_list',
                    data: {
                        appGroup: this.appGroup,
                        begTime:this.begTime,
                        endTime:this.endTime,
                    },
                    add_btn: false,
                    // del_btn:true,
                    modify_btn: false,
                    cols: [
                        {
                            title: '应用名',
                            key: 'AppName',
                            render: (h, params) => {
                                return h('div', params.row._source.AppName);
                            }
                        },
                        {
                            title: '应用分类',
                            key: 'program',
                            render: (h, params) => {
                                return h('div', params.row._source.program);
                            }
                        },
                        {
                            title: '日志源',
                            key: 'host',
                            render: (h, params) => {
                                return h('div', params.row._source.host);
                            }
                        },
                        {
                            title: '日志生成时间',
                            key: 'GenTime',
                            render: (h, params) => {
                                return h('div', params.row._source.GenTime);
                            }
                        },
                        {
                            title: '用户名',
                            key: 'UserName',
                            render: (h, params) => {
                                return h('div', params.row._source.UserName);
                            }
                        },
                        {
                            title: '源IP',
                            key: 'SrcIP',
                            render: (h, params) => {
                                return h('div', params.row._source.SrcIP);
                            }
                        },
                        {
                            title: '目的IP',
                            key: 'DstIP',
                            render: (h, params) => {
                                return h('div', params.row._source.DstIP);
                            }
                        },
                        {
                            title: '应用协议',
                            key: 'Protocol',
                            render: (h, params) => {
                                return h('div', params.row._source.Protocol);
                            }
                        },
                        {
                            title: '探针名称',
                            key: 'd_name',
                            render: (h, params) => {
                                return h('div', params.row._source.d_name);
                            }
                        },
                        {
                            title: '源端口',
                            key: 'SrcPort',
                            render: (h, params) => {
                                return h('div', params.row._source.SrcPort);
                            }
                        },
                        {
                            title: '目的端口',
                            key: 'DstPort',
                            render: (h, params) => {
                                return h('div', params.row._source.DstPort);
                            }
                        },
                        {
                            title: '应用行为',
                            key: 'Action',
                            render: (h, params) => {
                                return h('div', params.row._source.Action);
                            }
                        }
                    ]
                };
            },
            changeProgram(firstField,secondField,val,firstBarTitle,trendTitle){
                this.show1=val;
                this.FirstDrillingType=firstField;
                this.SecondDrillingType=secondField;
                this.firstBarTitle=firstBarTitle;
                this.trendTitle=trendTitle;
                this.myCreated();
                this.$refs.twoStageDrillingParamsRef.changeParams({
                    firstBarTitle:this.firstBarTitle,
                    trendTitle:this.trendTitle,
                    cols:this.twoStageDrillingParamsApp.SecondTableListColumns,
                    firstBarData:this.twoStageDrillingParamsApp.firstBarData,
                    firstLinesData:this.twoStageDrillingParamsApp.firstLinesData,
                    SecondTableData:this.twoStageDrillingParamsApp.SecondTableData,
                    ScondLinesData:this.twoStageDrillingParamsApp.ScondLinesData,
                });
            },
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            reloadChart () {
                console.warn(`============ 调用页面触发 重新加载 echarts ============`);
            },
            changeDate (params) {
                var bTime = new Date(params[0]).getTime();
                var eTime = new Date(params[1]).getTime();
                this.begTime = bTime;
                this.endTime=eTime;
                this.$refs.allParams.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams1.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.twoStageDrillingParamsRef.changeDate({
                    begTime:this.begTime,
                    endTime:this.endTime
                });
            },
            addGroup(){
                let programArray=[];
                this.$http.get("/api/getpie",{
                    params: {
                        index: 'ssa_envents*',
                        type: 'nsec',
                        aggField: 'appGroup.keyword',
                        size: 20
                    }
                }).then(res => {
                    for(var i of res.data.rows){
                        programArray.push(i.key)
                    }
                 this.buttonList = programArray;
                });

            },
            fun(group,index){
                this.titleActive = index;
                this.appGroup = group;
                this.myCreated()
                if( this.show1 == true){
                    this.$refs.allParams.changeParams({
                        queryObj:{'appGroup.keyword': this.appGroup}
                    })
                    this.$refs.allParams1.changeParams({
                        queryObj:{'appGroup.keyword': this.appGroup}
                    })
                }
                this.$refs.twoStageDrillingParamsRef.changeParams({
                    firstBarTitle:this.firstBarTitle,
                    trendTitle:this.trendTitle,
                    cols:this.twoStageDrillingParamsApp.SecondTableListColumns,
                    firstBarData:this.twoStageDrillingParamsApp.firstBarData,
                    firstLinesData:this.twoStageDrillingParamsApp.firstLinesData,
                    SecondTableData:this.twoStageDrillingParamsApp.SecondTableData,
                    ScondLinesData:this.twoStageDrillingParamsApp.ScondLinesData,
                });
            },
            activeButton(param){
                this.paramActive = param;
            }
        },

        mounted () {
        }

    };


</script>

<style lang="less" scoped>
    .buttonbottom{
        margin-bottom:10px;
    }

</style>
