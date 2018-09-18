<template>
        <Tabs v-model="tabFlag">
            <TabPane label="异常流量日志" name="异常流量日志">
                <tp-table ref="all_paramsTableRef" :all_params="all_paramsTable" ></tp-table>
            </TabPane>
            <TabPane label="异常流量分析" name="异常流量分析">
                <Row class="page-container" style="height: 449px">
                    <Col span="16" style="height: 449px">
                        <tp-ssa-echarts ref="allParamsMap" :allParams="allParamsMap" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                    <Col span="8">
                        <Row>
                            <Col :span="24" style="height: 240px;">
                                <tp-ssa-echarts ref="allParamsPie" :allParams="allParamsPie" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                        </Row>
                        <Row>
                            <Col :span="24" style="height: 240px;">
                                <tp-ssa-echarts ref="allParamsFirstLine" :allParams="allParamsFirstLine" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" style="height: 240px">
                        <tp-ssa-echarts ref="allParamsBar" :allParams="allParamsBar" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" style="height: 240px">
                        <tp-ssa-echarts ref="allParamsSecondLine" :allParams="allParamsSecondLine" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                </Row>
                <div style="position: absolute;top:-52px;right:20px;">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
                </div>
            </TabPane>


        </Tabs>
</template>

<script type="es6">
    import Util from '../../../libs/util';
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";

    export default {
        name: "test-import-echarts",
        components: {TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '异常流量',
                timeout: 2000,
                tabFlag:"异常流量日志",
                bTime:null,
                eTime:null,
                allParamsPie: {
                    id: 'pic_type',
                    type: "pie",
                    title: "协议类型分布",
                    url: '/api/cr_sec/anomalies/pie_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        pie_type:'protocol',
                        queryObj: Util.externSearchDist,
                    }
                },
                allParamsSecondLine: {
                    id: 'pic_dstIp',
                    type: "line",
                    title: "被攻击目的IP趋势图",
                    url: '/api/cr_sec/anomalies/top_attack_trend',
                    reload: this.timeout,
                    data: {
                        queryObj: Util.externSearchDist,
                        begTime: null,
                        endTime: null
                    }
                },
                allParamsBar: {
                    id: 'pic_flowType',
                    type: "bar",
                    title: "异常流量类型",
                    url: '/api/cr_sec/anomalies/pie_chart',
                    reload: this.timeout,
                    data: {
                        queryObj: Util.externSearchDist,
                        begTime: null,
                        endTime: null,
                        pie_type:'type'
                    }
                },
                allParamsFirstLine: {
                    id: 'pic_count',
                    type: "line",
                    title: "被攻击总数趋势图",
                    url: '/api/cr_sec/anomalies/attack_trend',
                    reload: this.timeout,
                    data: {
                        queryObj: Util.externSearchDist,
                        begTime: null,
                        endTime: null
                    }
                },
                all_paramsTable:{
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/anomalies/anomalies_list',
                    data:{
                        index: "ssa_envents*",
                        type: "nsec",
                        CombQuerys: {"program": ["ATTACK"]},
                        search:Util.externSearchDist
                    },
                    add_btn:false,
                    // del_btn:true,
                    modify_btn:false,
                    cols: [
                        {
                            title: '攻击事件',
                            key: 'Content',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Content);
                            }
                        },
                        {
                            title: '属性',
                            render: (h, params) => {
                                return h( 'div',params.row._source.threatType);
                            }
                        },
                        {
                            title: '源IP',
                            render: (h, params) => {
                                return h( 'div',params.row._source.SrcIP);
                            }
                        },
                        {
                            title: '源位置',
                            render: (h, params) => {
                                return h( 'div',params.row._source.sPosition);
                            }
                        },
                        {
                            title: '目的IP',
                            render: (h, params) => {
                                return h( 'div',params.row._source.DstIP);
                            }
                        },
                        {
                            title: '目位置',
                            render: (h, params) => {
                                return h( 'div',params.row._source.dPosition);
                            }
                        },
                        {
                            title: '应用协议',
                            key: 'Protocol',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Protocol);
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
                            title: '攻击类型',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row._source.type);
                            }
                        },
                        {
                            title: '日志生成时间',
                            key: 'GenTime',
                            render: (h, params) => {
                                return h( 'div',params.row._source.GenTime);
                            }
                        },
                        {
                            title: '事件ID',
                            key: 'EventID',
                            render: (h, params) => {
                                return h( 'div',params.row._source.EventID);
                            }
                        },   {
                            title: '操作',
                            key: '操作',
                            width: 250,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('a', {
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: "sec_target",
                                                    params: {
                                                        source: 'index_intrusion',
                                                        CombQueryDataObject: params.row._source.DstIP
                                                    }

                                                });
                                            }
                                        }
                                    }, '目标画像'),
                                    h('a', {
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: "sec_hacker",
                                                    params: {
                                                        source: 'index_intrusion',
                                                        CombQueryDataObject:  params.row._source.SrcIP
                                                    }
                                                });
                                            }
                                        }
                                    }, '黑客画像'),
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: "sec_traceback",
                                                    params: {
                                                        source: 'index_intrusion',
                                                        CombQueryDataObject: {
                                                            SrcIP:params.row._source.SrcIP,
                                                            DstIP:params.row._source.DstIP
                                                        }
                                                    }

                                                });
                                            }
                                        }
                                    }, '入侵回溯')
                                ]);
                            }
                        }
                    ]
                },
                allParamsMap:{
                    id: 'map',
                    type: "map",
                    title: "异常流量感知地图",
                    url: '/api/getmap',
                    reload: this.timeout,
                    data: {
                        CombQuery:{program:["ATTACK","SCAN","FLOOD","DDOS"]},
                        queryObj: Util.externSearchDist,
                        maxLine:50,/*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                        level1Aggs: "SrcIP",/*一级聚合字段*/
                        level2Aggs: "DstIP",/*一级聚合字段*/
                        level1_topN: 10, /*一级聚合topN*/
                        level2_topN: 10, /*二级聚合topN*/
                        begTime:null,
                        endTime:null
                    }
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
        //         for(let key in this.allParamsSecondLine ){
        //             obj[key]=this.allParamsSecondLine[key];
        //             if(key=="data"){
        //                 obj[key]={
        //                     begTime:value,
        //                     endTime:this.endtime
        //                 }
        //             }
        //         }
        //         this.allParamsSecondLine=obj;
        //         this.allParamsSecondLine.reload=0;
        //     },
        //     endtime(value){
        //         var obj={};
        //         for(let key in this.allParamsSecondLine ){
        //             obj[key]=this.allParamsSecondLine[key];
        //             if(key=="data"){
        //                 obj[key]={
        //                     begTime:this.begTime,
        //                     endTime:value
        //                 }
        //             }
        //         }
        //         this.allParamsSecondLine=obj;
        //
        //     },
        //     allParamsSecondLine(){
        //         console.log(1111);
        //     }
        // },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            reloadChart () {
                console.warn(`============ 调用页面触发 重新加载 echarts ============`);

                //this.timeout = this.timeout === 0 ? 20000 : 0;

                // this.ajax.bar.url = '/api/cr_sec/ips/dstport';

            },
            changeDate(params){
                this.bTime = new Date(params[0]).getTime();
                this.eTime = new Date(params[1]).getTime();
                this.$refs.allParamsPie.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.allParamsFirstLine.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.allParamsBar.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.allParamsSecondLine.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.allParamsMap.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.all_paramsTableRef.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });

            }
        },
        mounted () {

            let jumpFiled = this.$route.params.jumpFiled;
            this.tabFlag = jumpFiled;
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
