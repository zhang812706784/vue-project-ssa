<style lang="less">
    @import '../../../styles/common.less';
    @import 'intrusion_situation.less';
</style>
<template>
    <div class="instrusion">
        <Tabs value="IPSAnalysis">
            <TabPane label="入侵统计分析" name="IPSAnalysis">
                <Row :gutter="8">
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="attPortRef" :allParams="attPortParams" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="appTypeRef" :allParams="appTypeTop" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" style="height: 510px;">
                        <tp-ssa-echarts ref="IPSAnalysisMapRef" :allParams="IPSAnalysisMap" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="eventTypeRef" :allParams="eventTypeTop" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="protocolTopRef" :allParams="protocolTop" @on-click="testEvent"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackNumRef" :allParams="attackNum" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackedDstIpRef" :allParams="attackedDstIp" @on-click="testEvent"></tp-ssa-echarts>
                    </Col>
                </Row>
                <div style="position: absolute;top:-52px;right:20px;">
                    <DatePicker type="daterange" placeholder="请选择日期" style="width: 200px" @on-change="dateChange"></DatePicker>
                </div>
            </TabPane>
            <TabPane label="入侵感知日志" name="IPSPerceiveLog">
                <tp-table :all_params="IPSPerceiveLog"></tp-table>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "intrusion_situation",
        components: {TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '测试页面',
                timeout: 0,
                attPortParams: {
                //    id: 'attackedPort',
                    id: 'pic_port',
                    type: "pie",
                    title: "被攻击端口分布",
                    url: '/api/cr_sec/ips/dstport',
                    reload: 0,
                    data: {
                       /* begTime: '',
                        endTime: ''*/
                    }
                },
                eventTypeTop: {
                    // id: 'eventTypeTop10',
                    id: 'pic_event',
                    type: "pie",
                    title: "事件类型Top10分布",
                    url: '/api/cr_sec/ips/event_type',
                    reload: 0,
                    data: {}
                },
                appTypeTop: {
                    // id: 'appTypeTop10',
                    id: 'pic_appName',
                    type: "pie",
                    title: "应用类型Top10分布",
                    url: '/api/cr_sec/ips/app',
                    reload: 0,
                    data: {}
                },
                protocolTop: {
                    // id: 'protocolTop10',
                    id: 'pic_type',
                    type: "pie",
                    title: "7层协议Top10分布",
                    url: '/api/cr_sec/ips/protocol_type',
                    reload: 0,
                    data: {}
                },
                attackNum: {
                    //  id: 'attackTotalNum',
                    id: 'pic',
                    type: "line",
                    title: "攻击总数趋势图",
                    url: '/api/cr_sec/ips/total',
                    reload: 0,
                    data: {}
                },
                attackedDstIp: {
                    //  id: 'attackedDstIpHis',
                    id: 'pic_dst',
                    type: "line",
                    title: "被攻击目的IP历史趋势",
                    url: '/api/cr_sec/ips/dstip',
                    reload: 0,
                    data: {}
                },
                IPSAnalysisMap: {
                    //  id: 'attackedDstIpHis',
                    id: 'map',
                    type: "map",
                    title: "入侵感知地图",
                    url: '/api/getmap',
                    reload: 0,
                    data: {
                        CombQuery: {program: ["IPS"]},
                        maxLine: 50, /*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                        level1Aggs: "SrcIP", /*一级聚合字段*/
                        level2Aggs: "DstIP", /*一级聚合字段*/
                        level1_topN: 40, /*一级聚合topN*/
                        level2_topN: 40, /*二级聚合topN*/
                    }
                },
                IPSPerceiveLog: {
                 //   id :"IPSLogTable",
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/ips/log_list',
                    data:{
                        /*index: "ssa_envents*",
                        type: "nsec",
                        CombQuerys: {"program": ["ATTACK"]}*/
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
                            title: '事件类型',
                            key: 'EventType',
                            render: (h, params) => {
                                return h( 'div',params.row._source.EventType);
                            }
                        },
                        {
                            title: '事件名称',
                            key: 'EventName',
                            render: (h, params) => {
                                return h( 'div',params.row._source.EventName);
                            }
                        },
                        {
                            title: '攻击级别',
                            key: 'seclevel',
                            render: (h, params) => {
                                console.log(params.row._source.seclevel)
                                if (params.row._source.seclevel === "" || params.row._source.seclevel== null) {
                                    return h( 'div',"Normal");
                                } else {
                                    return h( 'div',params.row._source.seclevel.split(" ")[0]);
                                }
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
                            title: '出现次数',
                            key: 'EvtCount',
                            render: (h, params) => {
                                return h( 'div',params.row._source.EvtCount);
                            }
                        },
                        {
                            title: '时间',
                            key: 'GenTime',
                            render: (h, params) => {
                                return h( 'div',params.row._source.GenTime);
                            }
                        },
                        {
                            title: '动作',
                            key: 'Action',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Action);
                            }
                        }/*,
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
                        }*/
                    ]
                },
                testConfig: {
                    grid: {
                        left: '4%'
                    }
                }
            };
        },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            reloadChart () {
                console.warn(`============ 调用页面触发 重新加载 echarts ============`);

                this.timeout = this.timeout === 0 ? 20000 : 0;

                // this.ajax.bar.url = '/api/cr_sec/ips/dstport';

            },
            dateChange (date){
                let bTime = new Date(date[0]).getTime();
                let eTime = new Date(date[1]).getTime();
                this.$refs.attPortRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.appTypeRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.eventTypeRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.protocolTopRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.attackNumRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.attackedDstIpRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
            }
        },
        mounted () {
        }
    };
</script>

<style scoped>

</style>
