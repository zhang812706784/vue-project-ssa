<!--Created by zmj on 2018/8/14-->
<template>
    <Tabs value="接口流量分析">
        <TabPane label="接口流量分析" name="接口流量分析">
            <Col class="vm-date">
                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"
                            @on-change="changeDate" class="vm-date1">

                </DatePicker>
            </Col>
            <!--class="page-container"-->
            <Row>
                <Col span="24">
                    <Row class="vms-row1">
                        <Col :span="12" style="height: 230px;">
                            <!--接口流量Top10-->
                            <tp-ssa-echarts :allParams="ifTrafficTop" ></tp-ssa-echarts>
                        </Col>
                        <Col :span="12" style="height: 230px;">
                            <!--接口流量Top10趋势图-->
                            <tp-ssa-echarts :allParams="ifTrafficTopTrend" ></tp-ssa-echarts>
                        </Col>
                    </Row>
                    <Row class="vms-row1">
                        <Col :span="12" style="height: 230px;">

                            <!--接口速率Top10-->
                            <tp-ssa-echarts :allParams="ifTrafficRateTop" ></tp-ssa-echarts>

                        </Col>
                        <Col :span="12" style="height: 230px;">

                            <!--接口速率Top10趋势图-->
                            <tp-ssa-echarts :allParams="ifTrafficRateTopTrend" ></tp-ssa-echarts>

                        </Col>
                    </Row>
                </Col>
            </Row>
        </TabPane>

        <TabPane label="上行口流量分析" name="上行口流量分析">
            <Row>
                <Col :span="12" style="height: 230px;">
                    <!--速率趋势图-->
                    <tp-ssa-echarts ref="ifSelectedTrafficRateTrendRef" :allParams="ifSelectedTrafficRateTrend" ></tp-ssa-echarts>
                </Col>
                <Col :span="12" style="height: 230px;">

                    <!--流量趋势图-->
                    <tp-ssa-echarts ref="ifSelectedTrafficTrendRef" :allParams="ifSelectedTrafficTrend"></tp-ssa-echarts>
                </Col>
            </Row>

            <tp-table  :all_params="ifsTable"></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    var uuId = "";
    var tag = "";
    let temp1={
        template:"<p>1111</p>"
    }
    export default {
        name: "test-import-echarts",
        components: {TpSsaEcharts, TpTable},
        data() {
            return {
                barRefs: '',
                msg: '虚拟流量',
                timeout: 600,
                bTime: '',
                eTime: '',
                ifTrafficTop: {
                    id: 'ifTrafficTop',
                    type: "bar",
                    title: "接口流量Top10",
                    url: '/api/cr_net/net_if/if_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"bitraffic": "desc"}
                    }
                },
                ifTrafficTopTrend: {
                    id: 'ifTrafficTopTrend',
                    type: "line",
                    title: "接口流量Top10趋势图",
                    url: '/api/cr_net/net_if/if_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"bitraffic": "desc"}
                    }
                },
                ifTrafficRateTop: {
                    id: 'ifTrafficRateTop',
                    type: "bar",
                    title: "接口速率Top10",
                    url: '/api/cr_net/net_if/if_enforce_list',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"flow": "desc"}
                    }
                },
                ifTrafficRateTopTrend: {
                    id: 'ifTrafficRateTopTrend',
                    type: "line",
                    title: "接口速率Top10趋势图",
                    url: '/api/cr_net/net_if/if_enforce_top_trend',
                    reload: 0,
                    data: {
                        "page": 1,
                        "size": 10,
                        "sort": {"flow": "desc"}
                    }
                },
                ifSelectedTrafficRateTrend: {
                    id: 'ifSelectedTrafficRateTrend',
                    type: "line",
                    title: "速率趋势图",
                    url: '/api/cr_net/net_if/if_enforce_uuid_trend',
                    reload: 0,
                    data: {
                        "uuid": uuId,
                        "tag": tag,
                        "field": "flow"
                    }
                },
                ifSelectedTrafficTrend: {
                    id: 'ifSelectedTrafficTrend',
                    type: "line",
                    title: "流量趋势图",
                    url: '/api/cr_net/net_if/if_enforce_uuid_trend',
                    reload: 0,
                    data: {
                        "uuid": uuId,
                        "tag": tag,
                        "field": "bitraffic"
                    }
                },
                ifsTable: {
                    id: 'ifsTable',
                    type: "table",
                    ajaxType: "get",
                    checkBox: true,
                    url: '/api/cr_net/net_if/if_enforce_list',
                    data: {},
                    add_btn: false,
                    del_btn: false,
                    modify_btn: false,
                    cols: [
                        {
                            title: '云盾',
                            key: 'enforce',
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
                                            title:params.row._source.enforce
                                        }
                                    }, params.row._source.enforce)
                                ]);

                                // return h('div', params.row._source.enforce);
                            }
                        },
                        {
                            title: 'VM名称',
                            key: 'name',
                            width: 80,
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

                            }
                        },
                        {
                            title:'虚机/接口列表',
                            render:(h,params) =>{
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
                                            title:params.row._source.vm_name + "/"+params.row._source.mac_address
                                        }
                                    }, params.row._source.vm_name+ "/"+params.row._source.mac_address)
                                ]);

                            }
                        },
                        {
                            title:'IP地址',
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
                                            title:params.row._source.ip_address
                                        }
                                    },params.row._source.ip_address)
                                ]);
                                // return h('div',params.row._source.ip_address);
                            }
                        },
                        // {
                        //     title:'网关',
                        //     render:(h,params)=>{
                        //         debugger;
                        //         return h(params.row._source.gateway);
                        //     }
                        // },
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

                                // return h('div', params.row._source.uuid);


                            }
                        },
                        {
                            title: '上行流(KB)',
                            key: 'traffic.in_bytes',
                            render: (h, params) => {
                                return h('div', Math.round(params.row._source.traffic.in_bytes / 1024));

                            }
                        },
                        {
                            title: '下行流(KB)',
                            key: 'traffic.out_bytes',
                            render: (h, params) => {
                                return h('div', Math.round(params.row._source.traffic.out_bytes / 1024));
                            }

                        },
                        {
                            title: '双向流(KB)',
                            key: 'bitraffic',
                            render: (h, params) => {
                                return h('div', Math.round(params.row.fields.bitraffic / 1024));
                            }
                        },
                        {
                            title: '上行速率(KB/s)',
                            key: 'up_rate',
                            render: (h, params) => {
                                return h('div', Math.ceil(params.row.fields.up_rate / 1024));
                            }
                        },
                        {
                            title: '下行速率(KB/s)',
                            key: 'down_rate',
                            render: (h, params) => {

                                return h('div', Math.ceil(params.row.fields.down_rate / 1024));
                            }
                        },
                        {
                            title: "双向速率(KB/s)",
                            key: 'flow',
                            render: (h, params) => {
                                return h('div', Math.ceil((params.row.fields.flow / 1024)))
                            }
                        },
                        {
                            title: "上行包速率(个/s)",
                            key: 'up_prate',
                            render: (h, params) => {
                                return h('div', Math.ceil((params.row.fields.up_prate / 1024)))
                            }
                        },
                        {
                            title: "下行包速率(个/s)",
                            key: 'down_prate',
                            render: (h, params) => {
                                return h('div', Math.ceil((params.row.fields.down_prate / 1024)))
                            }
                        },
                        {
                            title: "双向包速率(KB/s)",
                            key: 'pflow',
                            render: (h, params) => {
                                return h('div', Math.ceil((params.row.fields.pflow / 1024)))
                            }
                        },
                        {
                            title: "时间戳",
                            key: 'timestamp',
                            render: (h, params) => {
                                var time = params.row._source["@timestamp"].slice(0, 19).replace(/T/g, ' ');

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
                                // return h('div', time)
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
                                            this.$refs.ifSelectedTrafficRateTrendRef.changeParams({
                                                uuid:params.row._source.uuid,
                                            });
                                            this.$refs.ifSelectedTrafficTrendRef.changeParams({
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
            testEvent(params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            changeDate(params) {

                var bTime = new Date(params[0]).getTime();
                var eTime = new Date(params[1]).getTime();
                this.$refs.ifTrafficTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifTrafficTopTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifTrafficRateTop.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifTrafficRateTopTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifSelectedTrafficRateTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifSelectedTrafficTrend.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });
                this.$refs.ifsTable.changeParams({
                    begTime: bTime,
                    endTime: eTime
                });

            }
        },
        mounted() {
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

    .ivu-tabs-tabpane > .vm-date {
        float: right;
        top: -50px;

    }
</style>
<style lang="less">
    .ivu-tabs-tabpane > .vm-date .ivu-input-wrapper > .ivu-input {
        background: transparent;
    }

    .ivu-tabs-tabpane > .vm-date .ivu-input-wrapper .ivu-input-icon {
        color: #b94a48;
    }
</style>
