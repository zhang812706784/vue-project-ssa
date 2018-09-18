<!--Created by zmj on 2018/8/14-->
<template>

    <Row class="page-container">
        <!--第一列-->
        <Col :span="6" class="mainPageHigh">
            <!--虚拟网络流量趋势-->
            <Row>
                <!-- example bar -->
                <Col :span="24" style="height: 310px">
                    <tp-ssa-echarts :allParams="virtualNet"></tp-ssa-echarts>
                </Col>

            </Row>

            <!--虚拟网络流量top10-->
            <Row>
                <!-- example pie -->
                <Col :span="24" style="height: 249px">
                    <tp-ssa-echarts :allParams="virtualNetRate"></tp-ssa-echarts>
                </Col>

            </Row>
            <!--虚拟流量趋势top5-->
            <Row>
                <!-- example line -->
                <Col :span="24" style="height: 243px">
                    <tp-ssa-echarts :allParams="virtualServerRate"></tp-ssa-echarts>
                </Col>


            </Row>
        </Col>
        <!--第二列-->
        <Col :span="12" class="mainPageHigh">
            <!--第一行  虚拟网络  虚机   接口-->
            <Row>

                <!--虚拟网络-->
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        虚拟网络
                    </p>
                    <div>
                        <span style="font-size: 40px">{{vnsCount}}个</span>
                    </div>
                </Col>
                <!--虚机-->
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        虚机
                    </p>

                    <div>
                        <span style="font-size: 40px">{{vmsCount}}个</span>
                    </div>
                </Col>
                <!--接口-->
                <Col span="8" style="height: 150px;text-align: center">
                    <p style="color: #fff; font-size: 16px;">
                        接口
                    </p>
                    <div>
                        <span style="font-size: 40px">{{ifsCount}}个</span>
                    </div>
                </Col>
            </Row>
            <!--第二行 拓扑图-->
            <Row >
                <!--拓扑图-->
                <Col :span="24" style="height: 417px">
                        <tp-ssa-topology :allParams="topologyParams"></tp-ssa-topology>
                </Col>
            </Row>
            <!--第三行 -->
            <Row>
                <!--虚拟流量top10-->
                <Col :span="12" style="height: 243px">

                    <tp-ssa-echarts :allParams="vmTrafficTop" @on-click="testEvent"></tp-ssa-echarts>

                </Col>
                <!--应用流量top10-->
                <Col :span="12" style="height: 243px">
                    <tp-ssa-echarts :allParams="appRate" @on-click="testEvent"></tp-ssa-echarts>
                </Col>

            </Row>
        </Col>
        <!--第三列-->
        <Col :span="6" class="mainPageHigh">
            <!--第一行 最新日志-->
            <Row style="height: 310px">
                <!-- example map -->
                <tp-ssa-log :allParams="newLog"></tp-ssa-log>

            </Row>
            <!--第二行 IP流量top10-->
            <Row>
                <Col :span="24" style="height: 249px">
                    <tp-ssa-echarts :allParams="IPRate"></tp-ssa-echarts>
                </Col>

            </Row>
            <!--第三行 用户流量趋势top5-->
            <Row>
                <Col :span="24" style="height: 243px">
                    <tp-ssa-echarts :allParams="userRate"></tp-ssa-echarts>
                </Col>
            </Row>
        </Col>

    </Row>

</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    import TpSsaTopology from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-topology";
    import TpSsaLog from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-log";
    export default {
        name: "test-import-echarts",
        components: {TpSsaLog, TpSsaTopology, TpSsaEcharts, TpTable},
        data() {
            return {
                barRefs: '',
                msg: '虚拟流量',
                timeout: 600,
                vnsCount: 0,
                vmsCount: 0,
                ifsCount: 0,
                bTime: '',
                eTime: '',
                newLog:{
                    id:'newLog',
                    url:'/api/getlastlog',
                    title: "最新日志",
                    offline_attr: '最新流量感知日志_mainPage',
                    logList:[],
                    data:{
                        CombQuery:{program:["FLOW"]},
                        page:1,
                        size:10
                    },

                },
                topologyParams:{
                    url: '/api/cr_net/net_if/net_pology',
                },
                virtualNet: {
                    id: 'virtualNet',
                    type: "line",
                    title: "虚拟网络流量趋势",
                    url: '/api/cr_net/net_vn/vn_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 5,
                        "sort": {
                            "bitraffic": "desc"
                        },
                        "timeLong": "12h",
                        "begTime": "",
                        "endTime": ""
                    }
                },
                virtualNetRate: {
                    id: 'virtualNetRate',
                    type: "bar",
                    title: "虚拟网络流量top10",
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"flow": "desc"},
                        "begTime": "",
                        "endTime": ""
                    }
                },
                virtualServerRate: {
                    id: 'virtualServerRate',
                    type: "line",
                    title: "虚机流量趋势top5",
                    url: '/api/cr_net/net_vm/vm_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 5,
                        "sort": {
                            "bitraffic": "desc"
                        },
                        "timeLong": "12h",
                        "begTime": "",
                        "endTime": ""
                    }
                },
                IPRate: {
                    id: 'IPRate',
                    type: "bar",
                    title: "IP流量top10",
                    url: '/api/cr_net/net/flow_top_chart',
                    reload: 0,
                    data: {
                        flowType: 'UserIp',
                        direction: 'flow',
                        "begTime": "",
                        "endTime": ""
                    }
                },
                userRate: {
                    id: 'userRate',
                    type: "line",
                    title: "用户流量趋势top5",
                    url: '/api/cr_net/net/flow_top_trend',
                    reload: 0,
                    data: {
                        flowType: 'UserName',
                        direction: 'up',
                        begTime: "",
                        endTime: "",
                        "timeLong": "12h"
                    }
                },
                vmTrafficTop: {
                    id: 'vmTrafficTop',
                    type: "bar",
                    title: "虚拟流量Top10",
                    url: '/api/cr_net/net_vm/vm_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"bitraffic": "desc"},
                        "begTime": "",
                        "endTime": ""
                    }
                },
                appRate: {
                    id: 'appRate',
                    type: "bar",
                    title: "应用流量top10",
                    url: '/api/cr_net/net/flow_top_chart',
                    reload: 0,
                    data: {
                        flowType: 'AppName',
                        direction: 'flow',
                        begTime: "",
                        endTime: ""
                    }
                },
            };
        },
        methods: {
            testEvent(params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            changeDate(params) {
                var bTime = new Date(params[0]).getTime();
                var eTime = new Date(params[1]).getTime();
                this.$refs.virtualNet.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.virtualNetRate.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.virtualServerRate.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.IPRate.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.userRate.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vmTrafficTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.appRate.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });

            },

            dataReckon(data) {
                data = Number(data);
                if (data > 10000) {
                    data = (data / 10000).toFixed(1) + 'w'
                }
                return data
            },

        },

        mounted() {
            this.$http.get("/api/cr_net/net_screen/count").then(res => {
                this.vnsCount = this.dataReckon(res.data.rows.vns)
            });
            this.$http.get("/api/cr_net/net_screen/count").then(res => {
                this.vmsCount = this.dataReckon(res.data.rows.vms)
            });
            this.$http.get("/api/cr_net/net_screen/count").then(res => {
                this.ifsCount = this.dataReckon(res.data.rows.ifs)
            });

            // this.$http.get("/api/getlastlog",
            //     {
            //         params: {
            //             title: "最新流量感知日志",
            //             offline_attr: '#newLog-最新流量感知日志_mainPage',
            //             CombQuery:{program:["FLOW"]},
            //             page:1,
            //             size:10
            //         }
            //     }
            // ).then(res => {
            //     console.log("123");
            //     let result = res.data.rows;
            //     let length = result.length >4 ? 4:result.length;
            //         for (let i = 0; i < length; i++) {
            //             if (parseInt(result[i].severity) < 2){
            //                 result[i].severity = '【低】'
            //             }else if(2 <= parseInt(result[i].severity) <4 ){
            //                 result[i].severity = '【中】'
            //             }else {
            //                 result[i].severity = '【高】'
            //             }
            //             this.logList.push(result[i]);
            //         }
            // })
        }

    };


</script>

<style scoped>

    .mainPageHigh {
        height: 100%;
    }
    .ivu-tabs-tabpane >.vm-date {
        float:right;
        top: -50px;

    }
</style>
<style lang="less" >
    .ivu-tabs-tabpane >.vm-date .ivu-input-wrapper > .ivu-input{
        background: transparent;
    }
    .ivu-tabs-tabpane >.vm-date .ivu-input-wrapper .ivu-input-icon{
        color: #b94a48;
    }

</style>
