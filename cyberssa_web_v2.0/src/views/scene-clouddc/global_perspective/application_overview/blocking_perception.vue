<template>
    <Tabs value="应用阻断统计分析">
        <TabPane label="应用阻断统计分析" name="应用阻断统计分析">
                    <Button :class="{ active: activeFlag == 'apply'}" v-on:click="changeProgram('AppName','SrcIP',true,'应用排名TOP10','应用TOP5历史趋势图')" @click="activeButton('apply')">应用</Button>
                    <Button :class="{ active: activeFlag == 'SrcIP'}" v-on:click="changeProgram('SrcIP','AppName',false,'源IPTOP10','源IPTOP5历史趋势图')" @click="activeButton('SrcIP')">源IP</Button>
                    <Button :class="{ active: activeFlag == 'DstIP'}" v-on:click="changeProgram('DstIP','AppName',false,'目的IPTOP10','目的IPTOP5历史趋势图')" @click="activeButton('DstIP')">目的IP</Button>
                    <Row class="page-container" v-if="show1">
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams" :allParams="allParams" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams1" :allParams="allParams1" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                    <Row v-if="show1">
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams2" :allParams="allParams2" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams3" :allParams="allParams3" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                    <tp_two_stage_drilling_plugin_app :all_params="twoStageDrillingParamsApp" ref="twoStageDrillingParamsRef"></tp_two_stage_drilling_plugin_app>
                    <div style="position: absolute;top:-52px;right:20px;">
                        <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
                    </div>
                </TabPane>
        <TabPane label="应用阻断日志列表" name="应用阻断日志列表">
            <tp-table :all_params="all_paramstable" ></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import tp_two_stage_drilling_plugin_app from "../../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-app";

    export default {
        name: "test-import-echarts",
        components: {TpTable, TpSsaEcharts,tp_two_stage_drilling_plugin_app},
        data () {
            return {
                show1:true,
                barRefs: '',
                msg: '应用阻断',
                timeout: 2000,
                modelSet: "APP_POLICY",
                begTime: (new Date().getTime()) - 10800000,
                endTime: new Date().getTime(),
                firstBarTitle:"应用排名TOP10",
                trendTitle:'应用TOP5历史趋势图',
                activeFlag:'apply',
                FirstDrillingType: 'AppName',
                SecondDrillingType: "SrcIP",
                twoStageDrillingParamsApp:{},
                allParams: {
                    id: 'appIdenPie',
                    type: "pie",
                    title: "应用控制占比",
                    url: '/api/cr_app/control/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime:null,
                        endTime:null,
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp'
                    }
                },
                allParams1: {
                    id: 'appIdenPassLine',
                    type: "line",
                    title: "应用控制历史趋势图",
                    url: '/api/cr_app/control/trend_chart',
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
                allParams2: {
                    id: 'appIdenBar',
                    type: "bar",
                    title: "应用阻断TOP10",
                    url: '/api/cr_app/control/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime:null,
                        endTime:null,
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp',
                        queryObj:{
                            "Action":'deny'
                        }
                    }
                },
                allParams3: {
                    id: 'appIdenLines',
                    type: "line",
                    title: "应用阻断Top5历史趋势图",
                    url: '/api/cr_app/control/trend_chart',
                    reload: this.timeout,
                    data: {
                        begTime:null,
                        endTime:null,
                        aggsCol:'AppName',
                        subAggsType:'value_count',
                        subAggsCol:'@timestamp',
                        queryObj:{
                            "Action":'deny'
                        }
                    }
                },
                // allParams4: {
                //     id: 'appPassBar',
                //     type: "bar",
                //     title: "应用通过Top10",
                //     url: '/api/cr_app/control/top_chart',
                //     reload: this.timeout,
                //     data: {
                //         begTime:null,
                //         endTime:null,
                //         aggsCol:'AppName',
                //         subAggsType:'value_count',
                //         subAggsCol:'@timestamp',
                //         queryObj:{
                //             "Action":'pass'
                //         }
                //     }
                // },
                // allParams5: {
                //     id: 'appPassLines',
                //     type: "line",
                //     title: "应用通过Top5历史趋势图",
                //     url: '/api/cr_app/control/trend_chart',
                //     reload: this.timeout,
                //     data: {
                //         begTime:null,
                //         endTime:null,
                //         aggsCol:'AppName',
                //         subAggsType:'value_count',
                //         subAggsCol:'@timestamp',
                //         queryObj:{
                //             "Action":'pass'
                //         }
                //     }
                // },
                all_paramstable:{
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_app/control/appcontrol_list',
                    data: {
                        program:"ALL",
                        begTime:(new Date().getTime()) - 10800000,
                        endTime:new Date().getTime()
                    },
                    add_btn:false,
                    // del_btn:true,
                    modify_btn:false,
                    cols: [
                        {
                            title: '应用名',
                            key: 'AppName',
                            render: (h, params) => {
                                return h( 'div',params.row._source.AppName);
                            }
                        },
                        {
                            title: '应用行为',
                            key: 'AppAction',
                            render: (h, params) => {
                                return h( 'div',params.row._source.AppAction);
                            }
                        },
                        {
                            title: '生成时间',
                            key: 'GenTime',
                            render: (h, params) => {
                                return h( 'div',params.row._source.GenTime);
                            }
                        },
                        {
                            title: '主机名',
                            key: 'host',
                            render: (h, params) => {
                                return h( 'div',params.row._source.host);
                            }
                        },
                        {
                            title: '用户名',
                            key: 'UserName',
                            render: (h, params) => {
                                return h( 'div',params.row._source.UserName);
                            }
                        },
                        {
                            title: '用户ID',
                            key: 'UserID',
                            render: (h, params) => {
                                return h( 'div',params.row._source.UserID);
                            }
                        },
                        {
                            title: '源IP',
                            key: 'SrcIP',
                            render: (h, params) => {
                                return h( 'div',params.row._source.SrcIP);
                            }
                        },
                        {
                            title: '目的IP',
                            key: 'DstIP',
                            render: (h, params) => {
                                return h( 'div',params.row._source.DstIP);
                            }
                        },
                        {
                            title: '源端口',
                            key: 'SrcPort',
                            render: (h, params) => {
                                return h( 'div',params.row._source.SrcPort);
                            }
                        },
                        {
                            title: '目的端口',
                            key: 'DstPort',
                            render: (h, params) => {
                                return h( 'div',params.row._source.DstPort);
                            }
                        },
                        {
                            title: '探针名称',
                            key: 'd_name',
                            render: (h, params) => {
                                return h( 'div',params.row._source.d_name);
                            }
                        },
                        {
                            title: '日志源',
                            key: 'host',
                            render: (h, params) => {
                                return h( 'div',params.row._source.host);
                            }
                        },
                        {
                            title: '协议',
                            key: 'Protocol',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Protocol);
                            }
                        },
                        {
                            title: '操作',
                            key: '操作',
                            width: 150,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.show(params.index)
                                            }
                                        }
                                    }, '详情'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.remove(params.index)
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ]
                },
                testConfig: {
                    grid: {
                        left: '4%'
                    }
                }
            };
        },
        // watch:{
        //     begintime(value){
        //         var obj={};
        //         for(let key in this.allParams3 ){
        //             obj[key]=this.allParams3[key];
        //             if(key=="data"){
        //                 obj[key]={
        //                     begTime:value,
        //                     endTime:this.endtime
        //                 }
        //             }
        //         }
        //         this.allParams3=obj;
        //         this.allParams3.reload=0;
        //     },
        //     endtime(value){
        //         var obj={};
        //         for(let key in this.allParams3 ){
        //             obj[key]=this.allParams3[key];
        //             if(key=="data"){
        //                 obj[key]={
        //                     begTime:this.begTime,
        //                     endTime:value
        //                 }
        //             }
        //         }
        //         this.allParams3=obj;
        //
        //     },
        //     allParams3(){
        //         console.log(1111);
        //     }
        // },
       created(){
         this.myCreated()
       },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            reloadChart () {
                console.warn(`============ 调用页面触发 重新加载 echarts ============`);
            },
            changeDate(params){
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
                this.$refs.allParams2.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams3.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.twoStageDrillingParamsRef.changeDate({
                    begTime:this.begTime,
                    endTime:this.endTime
                });

            },
            myCreated () {
                this.twoStageDrillingParamsApp = {
                    //一级钻取字段和二级钻取字段
                    FirstDrillingType: this.FirstDrillingType,
                    SecondDrillingType: this.SecondDrillingType,
                    firstBarTitle : this.firstBarTitle,
                    trendTitle:this.trendTitle,
                    begTime: this.begTime,
                    endTime: this.endTime,
                    program: this.modelSet,

                    //一级钻取柱状图参数
                    bar_elementID: 'appPassBar',
                    bar_title: this.firstBarTitle,
                    bar_url: '/api/cr_app/control/top_chart',
                    firstBarData: {
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: '',
                        size:5,
                    },

                    //一级钻取topN趋势图参数
                    trend_elementID: 'appPassLines',
                    trendTitle: "应用排名Top5历史趋势",
                    trendUrl: '/api/cr_app/control/trend_chart',
                    firstLinesData: {
                        program: this.modelSet,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: ''
                    },


                    //二级钻取table表格参数
                    SecondTableElementID: "realsecondtable",
                    SecondTableURL: '/api/cr_app/control/top_chart',
                    SecondTableListColumns: [
                        {
                            title: '序号',
                            type: 'index',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: this.FirstDrillingType,
                            key:  'selectFirstFiledValue',
                        },
                        {
                            title: this.SecondDrillingType,
                            key: 'key',
                        },
                        {
                            title: '次数',
                            key: 'doc_count',
                        }
                    ],
                    SecondTableData:{
                        program: this.modelSet,
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: '',
                        size:5,
                    },

                    //二级钻取趋势图参数
                    SecondTrendElementID: "appDetailTrend",
                    SecondTrendTitle: "趋势图",
                    SecondTrendURL: '/api/cr_app/identify/top_detail_trend',
                    ScondLinesData: {
                        program: this.modelSet,
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
                        program: this.modelSet,
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
                this.firstBarTitle=firstBarTitle
                this.trendTitle=trendTitle
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
            activeButton(param){
                this.activeFlag = param;
            }
        },
        mounted () {
        }

    };


</script>

<style lang="less" scoped>

    .page-container {
        /*background-color: rgba(61, 157, 59, 0.4);*/

        .vms-row1 {
            height: 500px;

            .ivu-col {
                border: 1px solid #888888;
            }
        }

    }

</style>
