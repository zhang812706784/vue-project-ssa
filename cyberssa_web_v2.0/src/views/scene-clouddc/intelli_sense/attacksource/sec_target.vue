<style lang="less">
    @import '../../../../styles/common.less';

    .customWidth {
        width: 100%;
    }

    .sec_target .ivu-tabs {
        overflow: visible;
    }

    .sec_target .fontStyle {
        font-size: 30px;
        margin-left: 10px;

    }

    .sec_target .font-container {
        color: rgb(255, 255, 255);
        font-size: 15px;
    }

    .sec_target .changePosition {
        position: absolute;
        top: -52px;
        right: 20px;
    }

    .sec_target .return {
        cursor: pointer;
        font-size: 40px;
        margin-left: 20px;
    }

    .sec_target .return:hover {
        color: #FFFFFF;
    }

    .sec_target .detail_font {
        margin-top: 16px;
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
    }

    .sec_target .detail_font > div {
        margin-bottom: 2%;
    }

    .sec_target .hacker_intercept {
        font-size: 36px;
    }


</style>

<template>
    <div class="sec_target">
        <Tabs v-model ="tabFlag" :animated="false" @on-click="changeTab">
            <TabPane label="攻击兴趣点统计" name="攻击兴趣点统计">
                <Row>
                    <Col span="4" offset="10" class="font-container">
                        <span>已拦截攻击</span><span class="fontStyle">{{total}}</span>
                    </Col>
                    <Col span="4" offset="5" class="changePosition">
                        <!--<DatePicker type="daterange" placement="bottom-end" placeholder="Select date"  @on-change="changeDate"></DatePicker>-->
                        <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm"
                                    placeholder="Select date and time(Excluding seconds)"
                                    class="customWidth" @on-change="changeDate">

                        </DatePicker>
                    </Col>
                </Row>
                <Row :gutter="16" class="margin-top-10">
                    <Col span="12" class="height-echart">
                        <!--黑客攻击排名Top10-->

                        <tp-ssa-echarts :allParams="blackListTop10Bar_target"
                                        ref="blackListTop10Bar_target"></tp-ssa-echarts>

                    </Col>
                    <Col span="12" class="height-echart">
                        <!--黑客攻击历史趋势-->

                        <tp-ssa-echarts :allParams="blackListTrendLine_target"
                                        ref="blackListTrendLine_target"></tp-ssa-echarts>

                    </Col>



                </Row>
            </TabPane>
            <TabPane label="攻击兴趣点列表" name="攻击兴趣点列表">
                <tp-table ref = "refTargetList" :all_params="targetList" ></tp-table>
                <!--详情-->
                <div v-show="showDetail" class="detail_part">

                    <Row class="margin-top-20">
                        <Col span="4" class="return">

                        <span v-on:click="returnFun" title="返回">
                                <Icon type="arrow-left-c"></Icon>
                            </span>
                        </Col>
                    </Row>

                    <Row :gutter="16" class="margin-top-20">

                        <Col span="5" offset="2" class="detail_font">
                            <div>
                                <span> IP：</span>
                                <span class="hacker_ip">{{detailParams.leftData.ip}}</span>
                            </div>
                            <div>
                                <span> 所在地：</span>
                                <span class="hacker_addr">{{detailParams.leftData.location}}</span>
                            </div>
                            <div>
                                <span> 弱点领域：</span>
                                <span class="hacker_goodAt">{{detailParams.leftData.goodAt}}</span>
                            </div>
                            <div>
                                <span> 被攻击次数：</span>
                                <span class="hacker_intercept">{{detailParams.leftData.intercept}}</span>
                            </div>
                        </Col>

                        <Col span="14" class="height-echart">
                            <tp-ssa-echarts :allParams="blackListTrendLine_detail"
                                            ref="blackListTrendLine_detail_ref"></tp-ssa-echarts>
                        </Col>

                    </Row>

                </div>
            </TabPane>

        </Tabs>


    </div>
</template>

<script type="es6">
    import TpSsaEcharts from '../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts'
    import TpTable from '../../../../components/locale-components/tp-table/tp-table'

    export default {
        name: 'sec_target',
        components: {TpTable, TpSsaEcharts},
        data () {
            return {
                begTime: null,
                endTime: null,
                tabFlag:"攻击兴趣点统计",
                total: 0,
                showDetail: false,
                showTable: true,
                detailParams: {
                    leftData: {}
                },
                blackListTop10Bar_target: {
                    id: 'pic_target',
                    type: 'bar',
                    title: `被攻击靶机排名Top10`,
                    url: '/api/cr_sec/sec_attack_interest/histogram',
                    /*reload: this.timeout,*/
                    data: {
                        begTime: null,
                        endTime: null,
                        fieldName: 'DstIP'
                    },
                    event: {
                        click: params => {
                            console.warn(`============ click ============`)
                            console.log(params);
                            this.jumpToTableWithCombQuery(this.blackListTop10Bar_target.data.fieldName, params.name);
                        }
                    }
                },
                blackListTrendLine_target: {
                    id: 'pic_Line',
                    type: 'line',
                    title: `被攻击的IP历史趋势`,
                    url: '/api/cr_sec/sec_attack_interest/trend',
                    data: {
                        begTime: null,
                        endTime: null,
                        timeLong: null,
                        fieldName: 'DstIP'
                    },
                    event: {
                        click: params => {
                            console.warn(`============ click ============`)
                            console.log(params)
                        }
                    }
                },
                targetList: {
                    id: 'tableBox',
                    type: 'table',
                    ajaxType: 'get',
                    checkBox: true,
                    url: '/api/cr_sec/sec_attack_interest/fuzzy_list',
                    data: {
                        fieldName: 'DstIP',
                        program: 'program'
                    },
                    add_btn: false,
                    // del_btn:true,
                    modify_btn: false,
                    cols: [
                        {
                            title: 'IP',
                            key: 'ip',
                            search:'ip',
                            render: (h, params) => {
                                return h('div', params.row.ip)
                            }
                        },
                        {
                            title: '地理位置',
                            key: 'location',
                            render: (h, params) => {
                                console.log(params)
                                return h('div', params.row.location)
                            }
                        },
                        {
                            title: '擅长领域',
                            key: 'goodAt',
                            render: (h, params) => {
                                return h('div', params.row.goodAt)
                            }
                        },
                        {
                            title: '病毒攻击次数',
                            key: 'avCount',
                            render: (h, params) => {
                                return h('div', params.row.avCount)
                            }
                        },
                        {
                            title: '异常流量攻击次数',
                            key: 'floodCount',
                            render: (h, params) => {
                                return h('div', params.row.floodCount)
                            }
                        },
                        {
                            title: '上网交互次数',
                            key: 'otherCount',
                            render: (h, params) => {
                                return h('div', params.row.otherCount)
                            }
                        },
                        {
                            title: '被攻击次数',
                            key: 'intercept',
                            render: (h, params) => {
                                return h('div', params.row.intercept)
                            }
                        },
                        {
                            title: '时间',
                            key: 'timestamp',
                            render: (h, params) => {
                                return h('div', params.row.timestamp)
                            }
                        },
                        {
                            title: '靶机画像',
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
                                                        CombQueryDataObject:{
                                                            DstIP: params.row['ip']
                                                        }
                                                    }

                                                });
                                            }
                                        }
                                    }, '详情')
                                ])
                            }
                        }
                    ]
                },
                blackListTrendLine_detail: {
                    id: 'pic',
                    type: 'bar',
                    title: `攻击源IP排名Top10`,
                    url: '/api/cr_sec/sec_attack_interest/histogram',
                    /*reload: this.timeout,*/
                    data: {
                        begTime: null,
                        endTime: null,
                        fieldName: 'SrcIP',
                        srcIP: 'DstIP',
                        srcIPValue: ''
                    },
                    event: {
                        click: params => {
                            console.warn(`============ click ============`)
                            console.log(params)
                        }
                    }
                }
            }
        },

        created () {
            let me = this
            let url = '/api/cr_sec/sec_attack_interest/histogram'
            let params = {
                begTime: this.begTime,
                endTime: this.endTime,
                fieldName: 'DstIP'
            }

            this.tempAjax(url, params, function (response) {
                me.total = response.data.total
            }, function (response) {

            })
        },
        methods: {
            changeDate (params) {
                this.begTime = (new Date(params[0])).valueOf()
                this.endTime = (new Date(params[1])).valueOf()
                let timeLong = this.timeLong(this.begTime, this.endTime)
                this.$refs.blackListTop10Bar_target.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    fieldName: 'DstIP'
                })


                this.$refs.blackListTrendLine_target.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    timeLong: timeLong,
                    fieldName: 'DstIP'
                })
            },

            timeLong (begTime, endTime, times) {
                if (!times) {
                    times = 12
                }

                let resultTime = parseInt(Number(Number(endTime) - Number(begTime)) / Number(times))

                if (resultTime) {
                    resultTime = parseInt(resultTime / 1000)
                    resultTime = resultTime + 's';
                    return resultTime
                }
            },

            // jumpToTableWithCombQuery(aggField, value){
            //
            //     let CombQueryDataObject = {search: {ip: [value]}};
            //     this.tabFlag = '攻击兴趣点列表';//跳转
            //     this.$refs.refTargetList.changeParams(CombQueryDataObject);
            // },
            //
            // showDetailFun (ip) {
            //
            //     this.showDetail = true
            //     this.showTable = false
            //     let url = '/api/cr_sec/sec_attack_interest/list'
            //     let params = {
            //         begTime: null,
            //         endTime: null,
            //         fieldName: 'DstIP',
            //         program: 'program',
            //         srcIPValue: ip
            //     }
            //     let me = this
            //     this.tempAjax(url, params, function (response) {
            //         if (response.data.rows.length > 0) {
            //             me.detailParams.leftData = response.data.rows[0]
            //         } else {
            //             me.detailParams.leftData = {
            //                 ip: ip,
            //                 location: '',
            //                 goodAt: '',
            //                 intercept: 0
            //             }
            //         }
            //
            //     }, function (response) {
            //         me.detailParams.leftData = {
            //             ip: ip,
            //             location: '',
            //             goodAt: '',
            //             intercept: 0
            //         }
            //
            //     });
            //
            //     setTimeout(function () {
            //             me.$refs.blackListTrendLine_detail_ref.changeParams({
            //                 begTime: null,
            //                 endTime: null,
            //                 fieldName: 'SrcIP',
            //                 srcIP: 'DstIP',
            //                 srcIPValue: ip
            //             })
            //         }
            //     )
            // },
            //
            // changeTab () {
            //     this.showDetail = false
            //     this.showTable = true
            // },
            //
            // tempAjax (url, params, success, failure, type) {
            //     if (!type) {
            //         type = 'get'
            //     }
            //     this.$http[type](url, {
            //         params: params
            //     })
            //         .then(function (response) {
            //
            //             success(response)
            //
            //         }).catch(function (response) {
            //         failure(response)
            //     })
            // },

            returnFun (event) {
                this.showDetail = false
                this.showTable = true
            }
        }

    }
</script>

