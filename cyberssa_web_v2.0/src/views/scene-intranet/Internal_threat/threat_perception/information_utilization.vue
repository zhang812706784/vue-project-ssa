<template>
    <div>
        <Row type="flex" justify="end">
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期" style="width: 200px" @on-change="changeDate"></DatePicker>
        </Row>
        <Row style="height: 200px;font-size: 30px;text-align: center">
            <Row type="flex" justify="space-around">
                <Col span="5" style="height: 100px;color: #fff">
                    <img src="../../../../../static/images/clouddc-topology/攻击.png"/><p>{{Srcnum}}</p>
                </Col>
                <Col span="3" style="height: 80px">
                    <img src="../../../../../static/images/clouddc-topology/箭头.gif"/>
                </Col>
                <Col span="4" style="height: 80px;color: #fff">
                    <img src="../../../../../static/images/clouddc-topology/服务器.png"/><p>{{Servernum}}</p>
                </Col>
                <Col span="4" style="height: 80px">
                    <img src="../../../../../static/images/clouddc-topology/箭头.gif"/>
                </Col>
                <Col span="4" style="height: 80px;color: #fff">
                    <img src="../../../../../static/images/clouddc-topology/受攻击.png"/><p>{{Dstnum}}</p>
                </Col>
            </Row>
            <p style="font-size: 20px;margin-top: 50px;">存在信息利用攻击行为的主机<span class="num">{{Srcnum}}</span>个，其中服务器<span class="num">{{Servernum}}</span>个，遭受数据驱动攻击行为的服务器<span class="num">{{Dstnum}}</span>个</p>
        </Row>
        <Row>
            <Col span="12" style="height: 300px">
                <tp-ssa-echarts ref="lineparams" :allParams="lineparams"></tp-ssa-echarts>
            </Col>
            <Col span="12" style="height: 300px">
                <tp-ssa-echarts ref="barparams" :allParams="barparams"></tp-ssa-echarts>
            </Col>
        </Row>
        <Row>
            <Button v-for="(item,key) in eventList" v-on:click="changeProgram(key)" >{{key}}({{item}})</Button>
        </Row>
        <Row style="height: 600px">
            <tp-table ref="optionLog" :all_params="optionLog"></tp-table>
        </Row>
    </div>
</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "information_utilization",
        components: {TpTable, TpSsaEcharts},
        data(){
            return{
                Srcnum:0,
                Dstnum:0,
                Servernum:0,
                bTime:null,
                eTime:null,
                eventList:{"全部":0},
                lineparams:{
                    id: 'lineparams',
                    type: "line",
                    title: "信息利用攻击行为趋势",
                    url: '/api/getlinesHistory',
                    reload: 0,
                    data: {
                        index: 'ssa_envents*',
                        type: 'nsec',
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        begTime: null,
                        endTime: null
                    }
                },
                barparams:{
                    id: 'barparams',
                    type: "bar",
                    title: "攻击源TOP5",
                    url: '/api/getpie',
                    reload: 0,
                    data: {
                        index: 'ssa_envents*',
                        type: 'nsec',
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        aggField:'SrcIP',
                        begTime: null,
                        endTime: null,
                        size: 5
                    },
                    config:{
                        xAxis:[{
                            axisLabel:{
                                rotate:0
                            }
                        }]
                    }
                },

                optionLog:{
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/ssa_table',
                    data:{
                        index: "ssa_envents*",
                        type: "nsec",
                        CombQuerysNot:{"threatType":["外部"]},
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        begTime: null,
                        endTime: null
                    },
                    add_btn:false,
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
                            title: '日志类型',
                            key: 'logtype',
                            render: (h, params) => {
                                return h( 'div',params.row._source.logtype);
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
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
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
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
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
                }
            }
        },
        mounted(){
               this.getNumber()
        },
        methods:{
            changeProgram(searchField){

                if (searchField === "全部"){

                    this.$refs.optionLog.changeParams({
                        search:{
                        },
                    });
                } else{
                    this.$refs.optionLog.changeParams({
                        search:{
                            EventType:searchField
                        },
                    });
                }

            },
            changeDate(params){
                this.bTime = new Date(params[0]).getTime();
                this.eTime = new Date(params[1]).getTime();
                this.$refs.lineparams.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.barparams.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.$refs.optionLog.changeParams({
                    begTime: this.bTime,
                    endTime: this.eTime
                });
                this.getNumber()
            },
            getNumber(){
                this.$http.get("/api/getpie",{
                    params:{
                        index: "ssa_envents*",
                        type: "nsec",
                        aggField:"SrcIP",
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        size:10000,
                        begTime: this.bTime,
                        endTime: this.eTime
                    }
                }).then(res => {
                    this.Srcnum=res.data.rows.length
                });
                this.$http.get("/api/getpie",{
                    params:{
                        index: "ssa_envents*",
                        type: "nsec",
                        aggField:"SrcIP",
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"],
                            "Srctype":["服务器"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        size:10000,
                        begTime: this.bTime,
                        endTime: this.eTime
                    }
                }).then(res => {
                    this.Servernum=res.data.rows.length
                });
                this.$http.get("/api/getpie",{
                    params:{
                        index: "ssa_envents*",
                        type: "nsec",
                        aggField:"DstIP",
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        begTime: this.bTime,
                        endTime: this.eTime,
                        size:10000
                    }
                }).then(res => {
                    this.Dstnum=res.data.rows.length
                });
                this.$http.get("/api/getpie",{
                    params:{
                        index: "ssa_envents*",
                        type: "nsec",
                        aggField:"EventType",
                        CombQuery:{
                            'logtype':['LOG_DAF'],
                            "threatType":["内部"]
                        },
                        // 'EventType':['协议分析','潜在风险','缓冲溢出攻击','跨站脚本攻击'],
                        begTime: this.bTime,
                        endTime: this.eTime
                    }
                }).then(res => {
                    this.eventList={"全部":0};
                    for(let index in res.data.rows)
                    {
                        let item=res.data.rows[index];
                        this.eventList[item.key]=item.doc_count;
                    }
                    this.eventList["全部"]=res.data.doc_count;
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .num{
        color: #E23938;
    }
</style>
