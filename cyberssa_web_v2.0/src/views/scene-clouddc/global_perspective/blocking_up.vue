<template>
    <Tabs value="安全阻断分析">
        <TabPane label="安全阻断分析" name="安全阻断分析">
            <Tabs value="name1" type="card">
                <TabPane label="总报文" name="name1">
                    <Row>
                        <Col span="24" style="height: 80px;text-align: center;font-size: 30px;color: #fff;">
                            <span>总报文阻断数&nbsp;{{num}}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" style="height: 240px">
                            <tp-ssa-echarts ref="allParams" :allParams="allParams" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                    <div style="position: absolute;top:-48px;right:20px;">
                        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期" style="width: 200px" @on-change="changeDate"></DatePicker>
                    </div>
                </TabPane>
                <TabPane label="源主机名" name="name2">
                    <Row>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams1" :allParams="allParams1" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams2" :allParams="allParams2" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="丢包说明" name="name3">
                    <Row>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams3" :allParams="allParams3" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams4" :allParams="allParams4" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="源IP" name="name4">
                    <Row>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams5" :allParams="allParams5" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams6" :allParams="allParams6" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="目的IP" name="name5">
                    <Row>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams7" :allParams="allParams7" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams8" :allParams="allParams8" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="用户名" name="name6">
                    <Row>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams9" :allParams="allParams9" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col span="12" style="height: 240px">
                            <tp-ssa-echarts ref="allParams10" :allParams="allParams10" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane label="安全阻断日志" name="安全阻断日志">
            <tp-table :all_params="all_paramstable" ></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "test-import-echarts",
        components: {TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '总报文阻断',
                num:0,
                timeout: 2000,
                allParams: {
                    id: 'filCount',
                    type: "line",
                    title: "总报文阻断数趋势图",
                    url: '/api/cr_sec/filter/filter_history',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null
                    }
                },
                allParams1: {
                    id: 'hostName',
                    type: "bar",
                    title: "源主机排名TOP10",
                    url: '/api/cr_sec/filter/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:"host"
                    }
                },
                allParams2: {
                    id: 'hostTrend',
                    type: "line",
                    title: "源主机排名TOP10趋势图",
                    url: '/api/cr_sec/filter/top_trend',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:"host"
                    }
                },
                allParams3: {
                    id: 'packetIns',
                    type: "bar",
                    title: "丢包说明排名Top10",
                    url: '/api/cr_sec/filter/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'program'
                    }
                },
                allParams4: {
                    id: 'packetTrend',
                    type: "line",
                    title: "丢包说明排名Top10趋势图",
                    url: '/api/cr_sec/filter/top_trend',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'program'
                    }
                },
                allParams5: {
                    id: 'srcIPName',
                    type: "bar",
                    title: "源IP排名Top10",
                    url: '/api/cr_sec/filter/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'SrcIP'
                    }
                },
                allParams6: {
                    id: 'srcIPTrend',
                    type: "line",
                    title: "源IP排名Top10趋势图",
                    url: '/api/cr_sec/filter/top_trend',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'SrcIP'
                    }
                },
                allParams7: {
                    id: 'dstIPName',
                    type: "bar",
                    title: "目的IP排名Top10",
                    url: '/api/cr_sec/filter/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'DstIP'
                    }
                },
                allParams8: {
                    id: 'dstIPTrend',
                    type: "line",
                    title: "目的IP排名Top10趋势图",
                    url: '/api/cr_sec/filter/top_trend',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'DstIP'
                    }
                },
                allParams9: {
                    id: 'userName',
                    type: "bar",
                    title: "用户名排名TOP10",
                    url: '/api/cr_sec/filter/top_chart',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'UserName'
                    }
                },
                allParams10: {
                    id: 'userTrend',
                    type: "line",
                    title: "用户名排名TOP10趋势图",
                    url: '/api/cr_sec/filter/top_trend',
                    reload: this.timeout,
                    data: {
                        begTime: null,
                        endTime: null,
                        aggsCol:'UserName'
                    }
                },
                all_paramstable:{
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/filter/list',
                    data: {},
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
                            key: 'Action',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Action);
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
                            search:'host',
                            render: (h, params) => {
                                return h( 'div',params.row._source.host);
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
                            search:'DstPort',
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
                            search:'Protocol',
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
                this.$refs.allParams4.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams5.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams6.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams7.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams8.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams9.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.allParams10.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });

            }
        },
        mounted () {
            this.$http.get("/api/cr_sec/filter/drop_alltimes",
                {params:{
                        begTime:null,
                        endTime:null
                    }}).then(res => {
                this.num = res.data.total
            });
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
