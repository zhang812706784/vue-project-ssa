<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div class="abnormal_scan">
        <Tabs value="scanLogListTitle">
            <TabPane label="扫描日志列表" name="scanLogListTitle">
                <tp-table :all_params="scanLogList"></tp-table>
            </TabPane>
            <TabPane label="扫描统计分析" name="scanAnalysis">
                <Row :gutter="8">
                    <Col span="24" style="text-align: center; color:#fff;font-size: 15px;height:80px;">
                        扫描日志次数<span style="margin-left:10px;font-size: 30px;">{{scanNum}}</span>
                    </Col>
                    <Col span="24" style="height: 400px;">
                        <tp-ssa-echarts ref="dateScanTrend" :allParams="scanTrend"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" style="height: 240px;margin-top:10px;">
                        <tp-ssa-echarts ref="dateSourceIPPie" :allParams="sourceIPPie"></tp-ssa-echarts>
                    </Col>
                    <Col span="12" style="height: 240px;margin-top:10px;">
                        <tp-ssa-echarts ref="dateSourceIPTrend" :allParams="sourceIPTrend"></tp-ssa-echarts>
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
        name: "abnormal_scanning",
        components: {TpTable, TpSsaEcharts},
        data() {
            return {
                scanNum: 0,
                begTime:"",
                endTime:"",
                scanTrend: {
                 //   id: 'totalScanTrend',
                    id: 'scanTrend',
                    type: "line",
                    title: "扫描总趋势图",
                    url: '/api/cr_sec/scan/history_trend',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                        /*begTime: '',
                        endTime: ''*/
                    }
                },
                sourceIPPie: {
                    //   id: 'sourceIPPie',
                    id: 'pic',
                    type: "pie",
                    title: "源IP类型分布饼图",
                    url: '/api/cr_sec/scan/scan_srcip',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                       /* begTime: '',
                        endTime: ''*/
                    }
                },
                sourceIPTrend: {
                    //   id: 'sourceIPLine',
                    id: 'pic_line',
                    type: "line",
                    title: "源IP类型分布趋势图",
                    url: '/api/cr_sec/scan/scan_srcip_trend',
                    reload: 0,
                    data: {
                        queryObj: Util.externSearchDist,
                        /*begTime: '',
                        endTime: ''*/
                    }
                },
                scanLogList: {
                 //   id :"scanLogTable",
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/cr_sec/scan/scan_list',
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
                        title: '主机',
                        key: 'host',
                        render: (h, params) => {
                            return h( 'div',params.row._source.host);
                            }
                        },
                        {
                            title: '内置接口',
                            key: 'InInterface',
                            render: (h, params) => {
                                return h( 'div',params.row._source.InInterface);
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
                            title: '日志源',
                            key: 'host',
                            render: (h, params) => {
                                return h( 'div',params.row._source.host);
                            }
                        },
                        {
                            title: '严重性',
                            key: 'severity_label',
                            render: (h, params) => {
                                return h( 'div',params.row._source.severity_label);
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
                            title: '类型',
                            key: 'type',
                            render: (h, params) => {
                                return h( 'div',params.row._source.type);
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
                        /*,
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
                        }*/]
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
                this.$refs.dateScanTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.dateSourceIPPie.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.dateSourceIPTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.protocolTopRef.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
            },
            getScanTotal (){
                this.$http.get('/api/cr_sec/scan/scan_alltimes',{
                    params: {
                        begTime: this.begTime,
                        endTime: this.endTime,
                        queryObj: Util.externSearchDist,
                    }
                }).then(res => {
                    // 设置扫描日志次数
                    this.scanNum = res.data.total;
                });
            }
        },
        mounted () {
            this.getScanTotal();
        }
    };
</script>

<style scoped>

</style>
