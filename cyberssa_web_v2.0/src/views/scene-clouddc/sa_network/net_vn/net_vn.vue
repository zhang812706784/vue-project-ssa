<!--Created by zmj on 2018/8/13-->
<template>
    <Tabs value="虚拟网络分析">
        <TabPane label="虚拟网络分析" name="虚拟网络分析">
            <Col class="vm-date">
                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate" class="vm-date1"></DatePicker>
            </Col>
            <!--class="page-container"-->
            <Row >
                <Col span="24">
                    <Row class="vms-row1">
                        <Col :span="12" style="height: 230px;">

                            <tp-ssa-echarts :allParams="vnIFNumTop" @on-click="testEvent"></tp-ssa-echarts>

                        </Col>
                        <Col :span="12" style="height: 230px;">

                            <tp-ssa-echarts :allParams="vnVMNumTop" @on-click="testEvent"></tp-ssa-echarts>

                        </Col>
                    </Row>
                    <Row class="vms-row1">
                        <Col :span="12" style="height: 230px;">
                            <tp-ssa-echarts :allParams="vnTrafficTop" @on-click="testEvent"></tp-ssa-echarts>
                        </Col>
                        <Col :span="12" style="height: 230px;">

                            <tp-ssa-echarts :allParams="vnTrafficTopTrend" @on-click="testEvent"></tp-ssa-echarts>

                        </Col>
                    </Row>
                    <Row class="vms-row1">


                        <Col :span="12" style="height: 230px;">

                            <tp-ssa-echarts :allParams="vnTrafficRateTop" @on-click="testEvent"></tp-ssa-echarts>

                        </Col>

                        <Col :span="12" style="height: 230px;">

                            <tp-ssa-echarts :allParams="vnTrafficTopRateTrend" @on-click="testEvent"></tp-ssa-echarts>

                        </Col>

                    </Row>

                </Col>

            </Row>

        </TabPane>

        <TabPane label="虚拟网络列表" name="虚拟网络列表">
               <Row>

                   <Col :span="12" style="height: 230px;">

                       <tp-ssa-echarts ref="vnSelectedTrafficTrendRef" :allParams="vnSelectedTrafficTrend" @on-click="testEvent"></tp-ssa-echarts>

                   </Col>
                   <Col :span="12" style="height: 230px;">

                       <tp-ssa-echarts ref="vnSelectedTrafficRateTrendRef" :allParams="vnSelectedTrafficRateTrend" @on-click="testEvent"></tp-ssa-echarts>

                   </Col>
               </Row>
            <tp-table :all_params="vnsTable" ></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    var uuId="";
    var tag = "";
    export default {
        name: "test-import-echarts",
        components: {TpSsaEcharts,TpTable},
        data () {
            return {
                barRefs: '',
                msg: '虚拟流量',
                timeout: 600,
                bTime: '',
                eTime: '',
                vnIFNumTop: {
                    id: 'vnIFNumTop',
                    type: "bar",
                    title: "虚拟网络中接口个数Top10",
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"Interfaces.InterfaceCount": "desc" },
                        "begTime":"",
                        "endTime":""
                    }
                },
                vnVMNumTop: {
                    id: 'vnVMNumTop',
                    type: "bar",
                    title: "虚拟网络中虚机个数Top10",
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"VMS.VMCount": "desc" },
                        "begTime":"",
                        "endTime":""
                    }
                },
                vnTrafficTop: {
                    id: 'vnTrafficTop',
                    type: "bar",
                    title: "虚拟网络流量Top10",
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"bitraffic": "desc" },
                        "begTime":"",
                        "endTime":""
                    }
                },
                vnTrafficTopTrend: {
                    id: 'vnTrafficTopTrend',
                    type: "line",
                    title: "虚拟网络流量Top10趋势",
                    url: '/api/cr_net/net_vn/vn_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"bitraffic": "desc" },
                        "begTime":"",
                        "endTime":"",
                        // "timeLong":timeLong
                    }
                },
                vnTrafficRateTop: {
                    id: 'vnTrafficRateTop',
                    type: "bar",
                    title: "虚拟网络流量速率Top10",
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"flow": "desc" },
                        "begTime":"",
                        "endTime":""
                    }
                },
                vnTrafficTopRateTrend: {
                    id: 'vnTrafficTopRateTrend',
                    type: "line",
                    title: "虚拟网络流量速率Top10趋势",
                    url: '/api/cr_net/net_vn/vn_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"flow": "desc" },
                        "begTime":"",
                        "endTime":"",
                        // "timeLong":timeLong
                    }
                },
                vnSelectedTrafficTrend: {
                    id: 'vnSelectedTrafficTrend',
                    type: "line",
                    title: "流量趋势",
                    url: '/api/cr_net/net_vn/vn_enforce_uuid_trend',
                    reload: 0,
                    data: {
                        "uuid": uuId,
                        "tag": tag,
                        "field":"bitraffic"
                    }
                },
                vnSelectedTrafficRateTrend: {
                    id: 'vnSelectedTrafficRateTrend',
                    type: "line",
                    title: "流量速率趋势",
                    url: '/api/cr_net/net_vn/vn_enforce_uuid_trend',
                    reload: 0,
                    data: {
                        "uuid": uuId,
                        "tag": tag,
                        "field":"flow"
                        // "timeLong":timeLong
                    }
                },

                vnsTable:{
                    id:'vnsTable',
                    type:"table",
                    ajaxType:"get",
                    checkBox: true,
                    url: '/api/cr_net/net_vn/vn_enforce_list',
                    data:{

                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false,
                    cols: [
                        {
                            title: '云盾',
                            key: 'enforce',
                            render:(h,params) => {
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
                                            title:params.row._source.enforce
                                        }
                                    }, params.row._source.enforce)
                                ]);

                                // return h('div',params.row._source.enforce);
                            }
                        },
                        {
                            title: 'VM名称',
                            key: 'name',
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
                                            title:params.row._source.name
                                        }
                                    }, params.row._source.name)
                                ]);

                                // return h('div',params.row._source.name);
                            }
                        },
                        {
                            title: 'uuid',
                            key: 'uuid',
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
                                            title:params.row._source.uuid
                                        }
                                    }, params.row._source.uuid)
                                ]);
                                // return h('div',params.row._source.uuid);

                            }
                        },
                        {
                            title: '接口个数',
                            key: 'InterfaceCount',
                            render: (h, params) => {
                                return h( 'div',params.row._source.Interfaces.InterfaceCount);

                            }
                        },
                        {
                            title: '接口列表',
                            key: 'Interfaces.vmifList',
                            render: (h, params) => {
                                var listVMSTmp = params.row._source.Interfaces.vmifList;
                                var ipString = "";

                                if (listVMSTmp.length) {

                                    var hoverBox = '';

                                    for (var index in listVMSTmp) {
                                        hoverBox += listVMSTmp[index].vmif;
                                        hoverBox += "/";
                                        hoverBox += listVMSTmp[index].ip_address + '   ';
                                    }

                                    ipString +=  hoverBox  + (listVMSTmp[0].vmif.length > 6 ? (listVMSTmp[0].vmif.slice(0, 6) + "...") : (listVMSTmp[0].vmif))  + listVMSTmp[0].ip_address ;

                                }

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
                                            title:hoverBox
                                        }
                                    }, ipString)
                                ]);

                                // return h('Tooltip', {
                                //     props: {
                                //         ellipsis: true,
                                //         content:`${hoverBox}`
                                //     },
                                // }, ipString);


                            }
                        },
                        {
                            title: '上行流(KB)',
                            key: 'traffic.in_bytes',
                            render: (h, params) => {
                                return h( 'div',Math.round(params.row._source.traffic.in_bytes/1024));

                            }
                        },
                        {
                            title: '下行流(KB)',
                            key: 'traffic.out_bytes',
                            render: (h, params) => {
                                return h( 'div',Math.round(params.row._source.traffic.out_bytes/1024));
                            }

                        },
                        {
                            title: '双向流(KB)',
                            key: 'bitraffic',
                            render: (h, params) => {
                                return h( 'div',Math.round(params.row.fields.bitraffic/1024));
                            }
                        },
                        {
                            title: '上行速率(KB/s)',
                            key: 'up_rate',
                            render: (h, params) => {
                                return h( 'div',Math.ceil(params.row.fields.up_rate/1024));
                            }
                        },
                        {
                            title: '下行速率(KB/s)',
                            key: 'down_rate',
                            render: (h, params) => {

                                return h('div', Math.ceil(params.row.fields.down_rate/1024));
                            }
                        },
                        {
                            title:"双向速率(KB/s)",
                            key:'flow',
                            render:(h,params) =>{
                                return h('div',Math.ceil((params.row.fields.flow/1024)))
                            }
                        },
                        {
                            title:"上行包速率(个/s)",
                            key:'up_prate',
                            render:(h,params) =>{
                                return h('div',Math.ceil((params.row.fields.up_prate/1024)))
                            }
                        },
                        {
                            title:"下行包速率(个/s)",
                            key:'down_prate',
                            render:(h,params) =>{
                                return h('div',Math.ceil((params.row.fields.down_prate/1024)))
                            }
                        },
                        {
                            title:"双向包速率(KB/s)",
                            key:'pflow',
                            render:(h,params) =>{
                                return h('div',Math.ceil((params.row.fields.pflow/1024)))
                            }
                        },
                        {
                            title:"时间戳",
                            key:'timestamp',
                            render:(h,params) =>{
                                var time = params.row._source["@timestamp"].slice(0,19).replace(/T/g,' ');

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
                                            title:time
                                        }
                                    }, time)
                                ]);
                                // return h('div',time)
                            }

                        },
                        {
                            title: '操作',
                            key: '操作',
                            width: 150,
                            align: 'center',
                            render: (h, params) => {
                                return h("Button",{
                                    props:{
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params);
                                            this.$refs.vnSelectedTrafficTrendRef.changeParams({
                                                uuid:params.row._source.uuid,
                                            });
                                            this.$refs.vnSelectedTrafficRateTrendRef.changeParams({
                                                uuid:params.row._source.uuid,
                                            });
                                        }
                                    }
                                },"详情")
                            }
                        }
                    ]
                }
            };
        },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            changeDate(params){

                var bTime = new Date(params[0]).getTime();
                var eTime = new Date(params[1]).getTime();
                this.$refs.vnVMNumTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnTrafficTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnTrafficTopTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnTrafficRateTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnTrafficTopRateTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnSelectedTrafficTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.vnSelectedTrafficRateTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });

            }


        },
        mounted () {
        }

    };


</script>

<style lang="less" scoped>

    .page-container {
        /*background-color: rgba(61, 157, 59, 0.4);*/

        .vms-row1 {
            /*height: 500px;*/

            .ivu-col {
                border: 1px solid #888888;
            }
        }

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
