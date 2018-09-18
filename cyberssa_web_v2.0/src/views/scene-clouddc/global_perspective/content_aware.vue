<template>
    <Tabs value="舆情感知统计">
        <TabPane label="舆情感知统计" name="舆情感知统计">
            <Button :class="{ active: activeFlag == 'keyword'}" v-on:click="changeProgram('Content','SrcIP','发布非法关键字排名Top10','发布非法关键字排名Top5历史趋势图')" @click="activeButton('keyword')">关键字</Button>
            <Button :class="{ active: activeFlag == 'webset' }" v-on:click="changeProgram('URL','SrcIP','发布非法关键字的网站排名Top10','发布非法关键字的网站排名Top5历史趋势图')" @click="activeButton('webset')">网站host</Button>
            <Button :class="{ active: activeFlag == 'user' }" v-on:click="changeProgram('SrcIP','SrcIP','发布非法关键字用户排名Top10','发布非法关键字用户排名Top5历史趋势图')" @click="activeButton('user')">用户</Button>
            <Button :class="{ active: activeFlag == 'probe' }" v-on:click="changeProgram('host','SrcIP','探针排名TOP10','探针排名TOP5历史趋势图')" @click="activeButton('probe')">探针名</Button>
            <tp_two_stage_drilling_plugin_app :all_params="twoStageDrillingParamsApp" ref="twoStageDrillingParamsRef"></tp_two_stage_drilling_plugin_app>
            <div style="position: absolute;top:-52px;right:20px;">
                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
            </div>
        </TabPane>
        <TabPane label="舆情感知列表" name="舆情感知列表">
            <tp-table :all_params="all_paramstable" ></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    import tp_two_stage_drilling_plugin_app from "../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-app";

    export default {
        name: "test-import-echarts",
        components: {TpTable, TpSsaEcharts,tp_two_stage_drilling_plugin_app},
        data () {
            return {
                barRefs: '',
                msg: '舆情感知',
                timeout: 2000,
                begTime: (new Date().getTime()) - 10800000,
                endTime: new Date().getTime(),
                activeFlag: 'keyword',
                fieldSet:{
                    Content:'关键字',
                    URL:'网站路径',
                    SrcIP:'源IP',
                    host:'探针'
                },
                firstBarTitle:"发布非法关键字排名Top10",
                trendTitle:'发布非法关键字排名Top5历史趋势图',
                FirstDrillingType: 'Content',
                SecondDrillingType: "SrcIP",
                twoStageDrillingParamsApp:{},
                all_paramstable:{
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/keywords/page',
                    data:{},
                    add_btn:false,
                    modify_btn:false,
                    cols: [
                        {
                            title: '应用行为',
                            key: 'program',
                            render: (h, params) => {
                                return h( 'div',params.row._source.program);
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
                            key: 'SrcIP',
                            render: (h, params) => {
                                return h( 'div',params.row._source.SrcIP);
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

                    //一级钻取柱状图参数
                    bar_elementID: 'pic_keyword',
                    bar_title: this.firstBarTitle,
                    bar_url: '/api/cr_app/control/top',
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
                    trend_elementID: 'pic_trendline',
                    trendTitle: this.trendTitle,
                    trendUrl: '/api/cr_app/control/trend',
                    firstLinesData: {
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.FirstDrillingType,
                        subAggsType: 'value_count',
                        subAggsCol: '@timestamp',
                        queryObj: ''
                    },
                    //二级钻取table表格参数
                    SecondTableElementID: "realsecondtable",
                    SecondTableURL: '/api/cr_app/control/top',
                    SecondTableListColumns: [
                        {
                            title: this.changeTitle(),
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
                        begTime: this.begTime,
                        endTime: this.endTime,
                        aggsCol: this.SecondDrillingType,
                        subAggsType: "value_count",
                        subAggsCol: "@timestamp",
                        selectKeys: "",
                    }
                };
            },
            changeProgram(firstField,secondField,firstBarTitle,trendTitle){
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
            activeButton(param) {
                this.activeFlag = param;
            },
            changeTitle (){
                if(this.fieldSet[this.FirstDrillingType] === '源IP'){
                    return '用户名'
                }else {
                    return this.fieldSet[this.FirstDrillingType]
                }
            }
        },

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
