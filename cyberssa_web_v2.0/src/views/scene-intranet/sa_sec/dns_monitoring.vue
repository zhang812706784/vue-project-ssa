<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div class="DNS_monitor">
        <Tabs value="DNSSearchListTitle">
            <TabPane label="DNS查询列表" name="DNSSearchListTitle">
                <tp-table :all_params="DNSSearchList"></tp-table>
            </TabPane>
            <TabPane label="DNS统计分析" name="DNSAnalysis">
                <Row :gutter="8">
                    <Col span="24" style="text-align: center; color:#fff;font-size: 15px;height:80px;">
                        安全分数<span style="margin-left:10px;font-size: 30px;">{{DNSNum}}</span>
                    </Col>
                    <Col span="24" style="height: 400px;">
                        <tp-ssa-echarts ref="dateDNSTrend" :allParams="DNSTrend"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" style="height: 240px;margin-top:10px;">
                        <tp-ssa-echarts ref="dateDomainType" :allParams="domainTypeScale"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" style="height: 240px;margin-top:10px;">
                        <tp-ssa-echarts ref="dateSearchDomain" :allParams="searchDomainTrend"></tp-ssa-echarts>
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
        name: "dns_monitoring",
        components: {TpTable, TpSsaEcharts},
        data() {
            return {
                DNSNum: 0,
                begTime:"",
                endTime:"",
                DNSTrend: {
                  //  id: 'totalDNSTrend',
                    id: 'dnsTrend',
                    type: "line",
                    title: "DNS总趋势图",
                    url: '/api/cr_sec/dns/history_trend',
                    reload: 0,
                    data: {
                        begTime: '',
                        endTime: '',
                        queryObj: Util.externSearchDist,
                    }
                },
                domainTypeScale: {
                    id: 'pic',
                  //  id: 'domainTypePie',
                    type: "pie",
                    title: "域名类型占比",
                    url: '/api/cr_sec/dns/pie',
                    reload: 0,
                    data: {
                         begTime: '',
                         endTime: '',
                         fieldName:"DEFENSE",
                         filedKeyword: "domain",
                        queryObj: Util.externSearchDist,
                    }
                },
                searchDomainTrend: {
                    id: 'att_dst',
                  //  id: 'searchDomainLine',
                    type: "line",
                    title: "被查询域名趋势图",
                    url: '/api/cr_sec/dns/trend',
                    reload: 0,
                    data: {
                        begTime: '',
                        endTime: '',
                        fieldName: "DEFENSE",
                        filedKeyword: "domain",
                        queryObj: Util.externSearchDist,
                    }
                },
                DNSSearchList: {
                   // id :"DNSSearchTable",
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/dns/list',
                    data:{
                        fieldName: "DEFENSE",
                        search:Util.externSearchDist,
                    },
                    add_btn:false,
                    // del_btn:true,
                    modify_btn:false,
                    cols: [{
                            title: '主机名',
                            key: 'host',
                            render: (h, params) => {
                                return h( 'div',params.row.host);
                            }
                        }, {
                            title: '源IP',
                            key: 'InInterface',
                            render: (h, params) => {
                                return h( 'div',params.row.SrcIP);
                            }
                        }, {
                            title: '目的IP',
                            key: 'SrcIP',
                            render: (h, params) => {
                                return h( 'div',params.row.DstIP);
                            }
                        }, {
                            title: '协议',
                            key: 'host',
                            render: (h, params) => {
                                return h( 'div',params.row.Protocol);
                            }
                        }, {
                            title: '严重等级',
                            key: 'severity_label',
                            render: (h, params) => {
                                return h( 'div',params.row.severity);
                            }
                        }, {
                            title: '严重性',
                            key: 'GenTime',
                            render: (h, params) => {
                                return h( 'div',params.row.severity_label);
                            }
                        }, {
                            title: '日志源',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row.host);
                            }
                        }, {
                            title: '类型',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row.type);
                            }
                        },
                        {
                            title: '时间',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row.GenTime);
                            }
                        }, {
                            title: '动作',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row.Action);
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
                                                        CombQueryDataObject: params.row.DstIP
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
                                                        CombQueryDataObject:  params.row.SrcIP
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
                                                            SrcIP:params.row.SrcIP,
                                                            DstIP:params.row.DstIP
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
            }
        },

        methods: {
            dateChange (date){
                let bTime = new Date(date[0]).getTime();
                let eTime = new Date(date[1]).getTime();
                this.begTime = bTime;
                this.endTime = eTime;
                this.$refs.dateDNSTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.dateDomainType.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.dateSearchDomain.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
            },
            getSafetyScore (){
                this.$http.get('/api/getsecscore',{
                    params: {
                        CombQuery: {program: ["DEFENSE"]},
                        begTime: this.begTime,
                        endTime: this.endTime,
                        queryObj: Util.externSearchDist,
                    }
                }).then(res => {
                    // 设置安全分数
                    this.DNSNum = 100 - res.data.rows.score;
                    if (!res.data.rows.score) this.DNSNum = 0;
                });
            }
        },
        mounted () {
            this.getSafetyScore();
        }
    };
</script>

<style scoped>

</style>
