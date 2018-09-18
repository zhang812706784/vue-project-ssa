<style lang="less">
    @import '../../../styles/common.less';
    @import '../../scene-clouddc/global_perspective/intrusion_situation.less';
</style>
<template>
    <div class="instrusion">
        <Tabs v-model="tabFlag">
            <TabPane label="入侵感知日志" name="IPSPerceiveLog">
                <Row >
                    <Col span="12"class="pieHeight">
                        <tp-ssa-echarts ref="attackNumRef1" :allParams="attackNum" ></tp-ssa-echarts>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="eventTypeRef1" :allParams="eventTypeTop"></tp-ssa-echarts>
                    </Col>
                </Row>

                <!--<tp-ssa-button :allParams="buttonTest"></tp-ssa-button>-->

                <Row>
                    <Button v-for="(item,key) in eventList" v-on:click="changeProgram(key)" >{{key}}({{item}})</Button>
                </Row>

                <Row>
                    <tp-table ref="IPSPerceiveLogRef" :all_params="IPSPerceiveLog"></tp-table>
                </Row>
            </TabPane>
            <TabPane label="入侵统计分析" name="IPSAnalysis">
                <Row :gutter="8">
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="attPortRef" :allParams="attPortParams" ></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="appTypeRef" :allParams="appTypeTop"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" style="height: 510px;">
                        <tp-ssa-echarts ref="IPSAnalysisMapRef" :allParams="IPSAnalysisMap"></tp-ssa-echarts>
                    </Col>
                    <Col span="6">
                        <Row>
                            <Col span="24" class="pieHeight">
                                <tp-ssa-echarts ref="eventTypeRef" :allParams="eventTypeTop1"></tp-ssa-echarts>
                            </Col>
                            <Col span="24" class="pieHeight marginTop">
                                <tp-ssa-echarts ref="protocolTopRef" :allParams="protocolTop"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackNumRef" :allParams="attackNum1"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" class="pieHeight">
                        <tp-ssa-echarts ref="attackedDstIpRef" :allParams="attackedDstIp"></tp-ssa-echarts>
                    </Col>
                </Row>
                <div style="position: absolute;top:-52px;right:20px;">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
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
    import Row from "iview/src/components/grid/row";
    import Button from "iview/src/components/button/button";
    import TpSsaButton from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-button";
    export default {
        name: "intrusion_situation",
        components: {TpSsaButton, Button, Row, TpTable, TpSsaEcharts},
        data () {
            return {
                barRefs: '',
                msg: '测试页面',
                timeout: 0,
                searchFiled:"",
                tabFlag:"IPSPerceiveLog",
                eventTypeCount:[],
                eventTypeTotal:null,
                eventList:{"全部":0},
                attPortParams: {
                //    id: 'attackedPort',
                    id: 'pic_port',
                    type: "pie",
                    title: "被攻击端口占比",
                    url: '/api/cr_sec/ips/dstport',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                       /* begTime: '',
                        endTime: ''*/
                    },
                    config:{
                        tooltip : {
                            formatter : "{b} : {c} ({d}%)"
                        }
                    }
                },
                eventTypeTop: {
                    // id: 'eventTypeTop10',
                    id: 'pic_event',
                    type: "pie",
                    title: "攻击类型占比",
                    url: '/api/cr_sec/ips/event_type',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    },

                    config: {
                        tooltip : {
                            formatter: "{b} : {c} ({d}%)"
                        },
                    },

                },
                eventTypeTop1: {
                    // id: 'eventTypeTop10',
                    id: 'pic_event1',
                    type: "pie",
                    title: "事件类型Top10分布",
                    url: '/api/cr_sec/ips/event_type',
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                appTypeTop: {
                    // id: 'appTypeTop10',
                    id: 'pic_appName',
                    type: "pie",
                    title: "应用类型Top10分布",
                    url: '/api/cr_sec/ips/app',
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                protocolTop: {
                    // id: 'protocolTop10',
                    id: 'pic_type',
                    type: "pie",
                    title: "7层协议Top10分布",
                    url: '/api/cr_sec/ips/protocol_type',
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                attackNum: {
                    //  id: 'attackTotalNum',
                    id: 'pic',
                    type: "line",
                    title: "攻击总数趋势图",
                    url: '/api/cr_sec/ips/total',
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                attackNum1: {
                    //  id: 'attackTotalNum',
                    id: 'pic1',
                    type: "line",
                    title: "攻击趋势图",
                    url: '/api/cr_sec/ips/total',
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                attackedDstIp: {
                    //  id: 'attackedDstIpHis',
                    id: 'pic_dst',
                    type: "line",
                    title: "被攻击目的IP历史趋势",
                    url: '/api/cr_sec/ips/dstip',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                    }
                },
                IPSAnalysisMap: {
                    //  id: 'attackedDstIpHis',
                    id: 'map',
                    type: "map",
                    title: "入侵感知地图",
                    url: '/api/getmap',
                    reload: 0,
                    data: {
                        CombQuery: {program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"]},
                        maxLine: 50, /*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                        level1Aggs: "SrcIP", /*一级聚合字段*/
                        level2Aggs: "DstIP", /*一级聚合字段*/
                        level1_topN: 40, /*一级聚合topN*/
                        level2_topN: 40, /*二级聚合topN*/
                        queryObj: Util.externSearchDist,
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

                        search: Util.externSearchDist,
                        CombQuerys:{
                            program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                        },

                    },
                    add_btn:false,
                    modify_btn:false,
                    cols: [
                        {
                            title: '事件类型',
                            key: 'EventType',
                            render: (h, params) => {
                                return h('div', [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        domProps: {
                                            title:params.row._source.EventType
                                        }
                                    }, params.row._source.EventType)
                                ]);
                            }
                        },
                        {
                            title: '事件名称',
                            key: 'EventName',
                            render: (h, params) => {

                                return h('div', [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        domProps: {
                                            title:params.row._source.EventName
                                        }
                                    }, params.row._source.EventName)
                                ]);
                            }
                        },
                        {
                            title: '攻击级别',
                            key: 'seclevel',
                            render: (h, params) => {
                                console.log(params.row._source.seclevel);
                                if (params.row._source.seclevel === "" || params.row._source.seclevel== null) {
                                    return h( 'div',"低");
                                } else {
                                    let level = params.row._source.seclevel.split(" ")[0];
                                    if (level === 'Minor'){
                                        return h( 'div',"低");
                                    } else if (level === 'Normal') {
                                        return h( 'div',"中");
                                    }else {
                                        return h( 'div','高');
                                    }
                                }
                            }
                        },
                        {
                            title: '源IP',
                            key: 'SrcIP',
                            render: (h, params) => {

                                let sPosition;
                                if (params.row._source.sPosition === "局域网") {
                                    sPosition = params.row._source.sIsp
                                }else{
                                    sPosition = params.row._source.sPosition
                                }

                                let title = params.row._source.SrcIP + '('+ sPosition+')';

                                return h('div', [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        domProps: {
                                            title:title
                                        }
                                    }, title)
                                ]);
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
                            title: '攻击时间',
                            key: 'GenTime',
                            render: (h, params) => {

                                return h('div', [
                                    h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        domProps: {
                                            title:params.row._source.GenTime
                                        }
                                    }, params.row._source.GenTime)
                                ]);
                            }
                        },
                        {
                            title: '攻击次数',
                            key: 'EvtCount',
                            render: (h, params) => {
                                return h( 'div',params.row._source.EvtCount);
                            }
                        },
                        {
                            title: '防火墙动作',
                            key: 'Action',
                            render: (h, params) => {
                                if (params.row._source.Action === 'deny') {
                                    return h( 'div',"丢弃");
                                }else{
                                    return h( 'div',"通过");
                                }
                            }
                        },
                        {
                            title: '操作',
                            key: '操作',
                            width: 250,
                            align: 'center',
                            render: (h, params) => {
                                return h('div',[
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
                                                        CombQueryDataObject: {
                                                            DstIP:params.row._source.DstIP
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }, '目标画像'),
                                    h('a', {
                                        style: {
                                            marginRight: '10px',
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: "sec_hacker",
                                                    params: {
                                                        source: 'index_intrusion',
                                                        CombQueryDataObject: {
                                                            SrcIP:params.row._source.SrcIP
                                                        }
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

            changeProgram(searchField){

                if (searchField === "全部"){

                    this.$refs.IPSPerceiveLogRef.changeParams({
                        search:{
                        },
                    });
                } else{
                    this.$refs.IPSPerceiveLogRef.changeParams({
                        search:{
                            EventType:searchField
                        },
                    });
                }

            },

            changeDate (date){
                let bTime = new Date(date[0]).getTime();
                let eTime = new Date(date[1]).getTime();

                this.$refs.attPortRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.IPSPerceiveLogRef.changeParams({
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
                this.$refs.eventTypeRef1.changeParams({
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
                this.$refs.attackNumRef1.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.attackedDstIpRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
            },

        },
        mounted () {

            this.$http.get("/api/cr_sec/ips/event_type",{
                params:{
                    queryObj: Util.externSearchDist,
                }

            }).then(res => {
                this.eventList = {"全部":0};
                for(let index in res.data.rows)
                {
                    let item=res.data.rows[index];
                    this.eventList[item.key]=item.doc_count;
                }
                this.eventList["全部"]=res.data.doc_count;
            });

            let jumpFiled = this.$route.params.jumpFiled;
            this.tabFlag = jumpFiled;

        }
    };
</script>

