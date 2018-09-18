<template>
    <div class="sec_target">
        <Tabs value="目标画像" :animated="false" @on-click="changeTab">

            <TabPane label="目标画像" name="目标画像">
                <!--详情-->
                <div v-show="showTable" class="detail_part">

                    <Row class="margin-top-20">
                        <Col span="4" class="return">

                        <span v-on:click="returnFun" title="返回">
                                <Icon type="arrow-left-c"></Icon>
                            </span>
                        </Col>
                    </Row>

                    <Row :gutter="16" class="margin-top-20">

                        <Col span="1" style="height: 190px;color: #E23938; margin-top: 16px">
                            <img height="190" width="200" src="../../../../../static/images/clouddc-topology/受攻击.png"/>
                        </Col>

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
                        <!--<Col span="4" class="height-echart">-->
                        <!--<div id="forceChart" style="width: 545px;height:240px;"></div>-->
                        <!--</Col>-->
                    </Row>

                </div>

                <!--表格-->
                <tp-table ref="targetListRef" :all_params="targetList" v-show="showTable"></tp-table>
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
        data() {
            return {
                begTime: null,
                endTime: null,
                total: 0,
                DstIP: '',
                showDetail: false,
                showTable: true,
                detailParams: {
                    leftData: {
                        ip: '',
                        location: '',
                        goodAt: '',
                        intercept: 0
                    }
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
                            console.log(params)
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
                targetList: {},

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
        created() {

            let me = this;
            let url = '/api/cr_sec/sec_attack_interest/histogram';
            let params = {
                begTime: this.begTime,
                endTime: this.endTime,
                fieldName: 'DstIP'
            };

            this.tempAjax(url, params, function (response) {
                me.total = response.data.total
            }, function (response) {

            });
            let source = this.$route.params.source;
            let DstIP = source && (source === 'index_intrusion') ? this.$route.params.CombQueryDataObject.DstIP : "";
            this.DstIP = DstIP;
            let _this = this;



            console.log('this is jump 目标画像 test console');
            console.log(DstIP);
            this.targetList = {
                id: 'tableBox',
                type: 'table',
                ajaxType: 'get',
                checkBox: true,
                url: '/api/ssa_table',
                data: {
                    index: "ssa_envents*",
                    type: "nsec",
                    CombQuery: {
                        program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                    },
                    search: {
                        DstIP: DstIP
                    },

                },
                add_btn: false,
                modify_btn: false,
                cols: [
                    {
                        title: '源IP',
                        render: (h, params) => {

                            return h('div', params.row._source.SrcIP)
                        }
                    },
                    {
                        title: '攻击行为',
                        render: (h, params) => {
                            return h('div', params.row._source.program)
                        }
                    },
                    {
                        title: '所在地',
                        render: (h, params) => {
                            return h('div', params.row._source.sPosition)
                        }
                    },
                    {
                        title: '时间',
                        key: 'timestamp',
                        render: (h, params) => {
                            return h('div', params.row._source.s_timestamp)
                        }
                    },
                    {
                        title: '入侵回溯',
                        key: '入侵回溯',
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
                                                name: "sec_traceback",
                                                params: {
                                                    source: 'sec_target',
                                                    CombQueryDataObject: {
                                                        SrcIP: params.row._source.SrcIP,
                                                        DstIP: params.row._source.DstIP
                                                    }
                                                }

                                            });
                                        }
                                    }
                                }, '入侵回溯')
                            ])
                        }
                    }
                ],
            };
            // this. (DstIP);
        },

        methods: {
            changeDate(params) {
                this.begTime = (new Date(params[0])).valueOf();
                this.endTime = (new Date(params[1])).valueOf();
                let timeLong = this.timeLong(this.begTime, this.endTime);
                this.$refs.blackListTop10Bar_target.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    fieldName: 'DstIP'
                });

                this.$refs.blackListTrendLine_target.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    timeLong: timeLong,
                    fieldName: 'DstIP'
                })
            },

            timeLong(begTime, endTime, times) {
                if (!times) {
                    times = 12
                }
                let resultTime = parseInt(Number(Number(endTime) - Number(begTime)) / Number(times));

                if (resultTime) {
                    resultTime = parseInt(resultTime / 1000);
                    resultTime = resultTime + 's';
                    return resultTime
                }
            },


            // showDetailFun(ip) {
            //
            //     // this.showDetail = true
            //     this.showTable = true;
            //     let url = '/api/cr_sec/sec_attack_interest/list';
            //     let params = {
            //         begTime: null,
            //         endTime: null,
            //         fieldName: 'DstIP',
            //         program: 'program',
            //         srcIPValue: ip
            //     }
            //     let me = this;
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
            //     me.hackerPicture();
            //     }, function (response) {
            //         me.detailParams.leftData = {
            //             ip: ip,
            //             location: '',
            //             goodAt: '',
            //             intercept: 0
            //         }
            //
            //     })
            // },

            changeTab() {
                this.showDetail = false;
                this.showTable = true
            },

            tempAjax(url, params, success, failure, type) {
                if (!type) {
                    type = 'get'
                }
                this.$http[type](url, {
                    params: params
                })
                    .then(function (response) {

                        success(response)

                    }).catch(function (response) {
                    failure(response)
                })
            },


            hackerPicture() {

                this.$http.get("/api/getpie", {
                    params: {
                        index: "ssa_envents*",
                        type: "nsec",
                        aggField: "attacktype.keyword",
                    }
                }).then(res => {
                    let data = {};
                    console.log(res.data.rows);
                    for (let i = 0; i < res.data.rows.length; i++) {
                        data[res.data.rows[i].key] = res.data.rows[i].doc_count;
                    }

                });
            },

            returnFun() {
                this.$router.go(-1);
                this.$store.commit('removeRoute', this.$route.path);
            }
        },
        mounted() {
            let DstIP = this.DstIP;
            let _this = this;
            this.$http.get("/api/ssa_table", {
                params: {
                    index: "ssa_envents*",
                    type: "nsec",
                    CombQuery: {
                        program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                    },
                    search: {
                        DstIP: DstIP
                    },
                }
            }).then(res => {
                _this.detailParams.leftData["ip"] = res.data.rows[0]._source.DstIP;
                _this.detailParams.leftData["location"] = res.data.rows[0]._source.dPosition;
                _this.detailParams.leftData["goodAt"] = res.data.rows[0]._source.program;
                _this.detailParams.leftData["intercept"] = res.data.total;
            });
        }
    }
</script>

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
