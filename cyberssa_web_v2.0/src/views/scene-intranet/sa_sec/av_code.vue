<style lang="less">
    @import '../../../styles/common.less';
    @import '../../scene-clouddc/global_perspective/intrusion_situation.less';
</style>
<template>
    <div class="AVCode">
        <Tabs v-model="tabFlag">
            <TabPane label="病毒感知日志" name="AVPerceptionLogTitle">
                <tp-table :all_params="AVPerceptionLog"></tp-table>
            </TabPane>
            <TabPane label="病毒防护分析" name="avAnalysis">
                <Row :gutter="8">
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="av_attPortRef" :allParams="av_attPortParams" @on-click=""></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="av_appTypeRef" :allParams="av_appTypeTop" @on-click=""></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" style="height: 510px;">
                        <tp-ssa-echarts ref="av_perceiveMapeRef" :allParams="av_perceiveMap" @on-click=""></tp-ssa-echarts>
                    </Col>
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="avNameRef" :allParams="avNameDistri" @on-click=""></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="protocolTopRef" :allParams="protocol7Top" @on-click=""></tp-ssa-echarts>
                            </Col>
                        </Row>

                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackNumRef" :allParams="avEventTotal" @on-click=""></tp-ssa-echarts>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackedDstIpRef" :allParams="attackedDstIpTop10" @on-click=""></tp-ssa-echarts>
                    </Col>
                </Row>
                <div style="position: absolute;top:-52px;right:20px;">
                    <DatePicker type="daterange" placeholder="请选择日期" style="width: 200px" @on-change="dateChange"></DatePicker>
                </div>
            </TabPane>

        </Tabs>


    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import Util from '../../../libs/util';
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "av_code",
        components: {TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                timeout: 0,
                tabFlag:'AVPerceptionLogTitle',
                av_attPortParams: {
                    //    id: 'av_attackedPort',
                    id: 'pic_port',
                    type: "pie",
                    title: "被攻击端口分布",
                    url: '/api/cr_sec/virus/dstport',
                    reload: 0,
                    data: {
                        begTime: '',
                        endTime: '',
                        queryObj: Util.externSearchDist,
                    }
                },
                avNameDistri: {
                    // id: 'eventTypeTop10',
                    id: 'pic_name',
                    type: "pie",
                    title: "病毒名称分布",
                    url: '/api/cr_sec/virus/name',
                    reload: 0,
                    data: {
                        begTime: '',
                        endTime: '',
                        queryObj: Util.externSearchDist,
                    }
                },
                av_appTypeTop: {
                    // id: 'av_appTypeTop10',
                    id: 'appType',
                    type: "pie",
                    title: "应用类型Top10",
                    url: '/api/cr_sec/virus/app',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                protocol7Top: {
                    // id: 'protocolTop10',
                    id: 'pic_type',
                    type: "pie",
                    title: "7层协议分布",
                    url: '/api/cr_sec/virus/protocoltype',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                avEventTotal: {
                    //  id: 'attackTotalNum',
                    id: 'pic',
                    type: "line",
                    title: "病毒事件总趋势",
                    url: '/api/cr_sec/virus/total',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                attackedDstIpTop10: {
                    //  id: 'attackedDstIpHis',
                    id: 'pic_dst',
                    type: "bar",
                    title: "被攻击目的IPtop10",
                    url: '/api/cr_sec/virus/dstip',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                av_perceiveMap: {
                    //  id: 'attackedDstIpHis',
                    id: 'map',
                    type: "map",
                    title: "病毒感知地图",
                    url: '/api/getmap',
                    reload: 0,
                    data: {
                        CombQuery:{program:["AV"]},
                        search:Util.externSearchDist,
                        maxLine:50,/*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                        level1Aggs: "SrcIP",/*一级聚合字段*/
                        level2Aggs: "DstIP",/*一级聚合字段*/
                        level1_topN: 40, /*一级聚合topN*/
                        level2_topN: 40, /*二级聚合topN*/
                    }
                },
                AVPerceptionLog: {
                 //   id :"AVLogTable",
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/virus/log_list',
                    data:{

                        /*index: "ssa_envents*",
                        type: "nsec",
                        CombQuerys: {"program": ["ATTACK"]}*/
                        search:Util.externSearchDist,
                    },
                    add_btn:false,
                    // del_btn:true,
                    modify_btn:false,
                    cols: [
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
                            key: 'seclevel',
                            render: (h, params) => {
                                return h( 'div',params.row._source.DstPort);
                            }
                        },
                        {
                            title: '病毒名称',
                            key: 'VirusName',
                            render: (h, params) => {
                                return h( 'div',params.row._source.VirusName);
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
                            title: '类型',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row._source.type);
                            }
                        },
                        {
                            title: '告警',
                            key: 'severity_label',
                            render: (h, params) => {
                                return h( 'div',params.row._source.severity_label);
                            }
                        },
                        {
                            title: '告警等级',
                            key: 'severity',
                            render: (h, params) => {
                                return h( 'div',params.row._source.severity);
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
                        },
                        {
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
                this.$refs.av_attPortRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.av_appTypeTop.changeParams({
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

            let jumpFiled = this.$route.params.jumpFiled;
            this.tabFlag = jumpFiled;
        }
    };
</script>

<style scoped>

</style>
