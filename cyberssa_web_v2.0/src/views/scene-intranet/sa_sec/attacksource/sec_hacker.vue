<template>
    <div class="sec_hacker">
        <Tabs value="黑客画像" @on-click="changeTab">
            <TabPane label="黑客画像" name="黑客画像">
                <!--详情-->
                <div v-show="showTable" class="detail_part">

                    <Row>
                        <Col span="4" class="return">
                        <span v-on:click="returnFun" title="返回">
                                <Icon type="arrow-left-c"></Icon>
                            </span>
                        </Col>
                    </Row>

                    <Row :gutter="16" class="margin-top-20">
                        <Col span="1" style="height: 190px;color: #E23938; margin-top: 16px">
                            <img height="190" width="200" src="../../../../../static/images/clouddc-topology/攻击.png"/>
                        </Col>
                        <Col span="5" offset="2" class="detail_font">
                            <!--<div id="hack" style="width: 600px;height:400px;"></div>-->

                            <div>
                                <span> IP：</span>
                                <span class="hacker_ip">{{detailParams.leftData.ip}}</span>
                            </div>
                            <div>
                                <span> 所在地：</span>
                                <span class="hacker_addr">{{detailParams.leftData.location}}</span>
                            </div>
                            <div>
                                <span> 黑客/白客：</span>
                                <span class="hacker_id">{{detailParams.leftData.identity}}</span>
                            </div>
                            <div>
                                <span> 擅长领域：</span>
                                <span class="hacker_goodAt">{{detailParams.leftData.goodAt}}</span>
                            </div>
                            <div>
                                <span> 拦截次数：</span>
                                <span class="hacker_intercept">{{detailParams.leftData.intercept}}</span>
                            </div>
                        </Col>

                        <Col span="14" class="height-echart">
                            <tp-ssa-echarts :allParams="blackListTop10Bar_detail" ref="blackListTop10Bar_detail">

                            </tp-ssa-echarts>

                        </Col>

                    </Row>
                </div>
                <!--表格-->
                <tp-table ref="hackerListRef" :all_params="hackerList" v-show="showTable"></tp-table>
            </TabPane>

        </Tabs>


    </div>
</template>

<script type="es6">
    import Util from '../../../../libs/util';
    import TpSsaEcharts from '../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts'
    import TpTable from '../../../../components/locale-components/tp-table/tp-table'
    import Button from "iview/src/components/button/button";

    export default {
        name: 'sec_hacker',
        components: {Button, TpTable, TpSsaEcharts},
        data() {
            return {
                begTime: '',
                endTime: '',
                showTable: true,
                SrcIP:'',
                detailParams: {
                    leftData: {
                        ip: '',
                        location: '',
                        identity:'',
                        goodAt: '',
                        intercept: 0
                    }
                },
                blackListTop10Bar: {
                    id: 'pic_10Bar',
                    type: 'bar',
                    title: `黑客攻击主机排名Top10`,
                    url: '/api/cr_sec/hackers/histogram',
                    /*reload: this.timeout,*/
                    data: {
                        begTime: null,
                        endTime: null,
                        fieldName: 'SrcIP'
                    },
                    event: {
                        click: params => {
                            console.warn(`============ click ============`)
                            console.log(params)
                        }
                    }
                },
                blackListTrendLine: {
                    id: 'pic_Line',
                    type: 'line',
                    title: `黑客攻击历史趋势`,
                    url: '/api/cr_sec/hackers/trend',
                    data: {
                        begTime: null,
                        endTime: null,
                        timeLong: null,
                        fieldName: 'SrcIP'
                    },
                    event: {
                        click: params => {
                            console.warn(`============ click ============`)
                            console.log(params)
                        }
                    }
                },
                hackerList: {},

                blackListTop10Bar_detail: {
                    id: 'pic',
                    type: 'bar',
                    title: `黑客攻击排名Top10`,
                    url: '/api/cr_sec/hackers/histogram',
                    /*reload: this.timeout,*/
                    data: {
                        begTime: null,
                        endTime: null,
                        fieldName: 'DstIP',
                        srcIP: 'SrcIP',
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
            let url = '/api/cr_sec/hackers/histogram';
            let params = {
                begTime: this.begTime,
                endTime: this.endTime,
                fieldName: 'DstIP'
            };

            // this.tempAjax(url, params, function (response) {
            //     me.total = response.data.total
            // }, function (response) {
            //
            // });
            debugger
            let source = this.$route.params.source;
            let SrcIP = source && (source === 'index_intrusion') ?  this.$route.params.CombQueryDataObject.SrcIP : "192.168.115.40";
            this.SrcIP = SrcIP;
            this.hackerList = {
                id: 'tableBox',
                type: 'table',
                ajaxType: 'get',
                checkBox: false,
                url: '/api/ssa_table',
                data:{
                    index: "ssa_envents*",
                    type: "nsec",
                    CombQuerys:{
                        program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                    },
                    queryObj: Util.externSearchDist,
                    search:{
                        SrcIP:SrcIP,
                        // DstIP:"59.111.160.195"
                    },

                },
                add_btn: false,
                modify_btn: false,
                cols:[
                    {
                        title: '目的IP',
                        render: (h, params) => {

                            return h('div', params.row._source.DstIP)
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
                            return h('div', params.row._source.dPosition)
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
                                                    source: 'sec_hacker',
                                                    CombQueryDataObject: {
                                                        SrcIP: this.detailParams.leftData.ip,
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
            // this.showDetailFun(SrcIP);
        },


        methods: {
            changeDate(params) {
                this.begTime = (new Date(params[0])).valueOf();
                this.endTime = (new Date(params[1])).valueOf();
                let timeLong = this.timeLong(this.begTime, this.endTime);
                this.$refs.blackListTop10Bar.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    fieldName: 'SrcIP'
                })

                this.$refs.blackListTrendLine.changeParams({
                    begTime: this.begTime,
                    endTime: this.endTime,
                    timeLong: timeLong,
                    fieldName: 'SrcIP'
                })
            },
            timeLong(begTime, endTime, times) {
                if (!times) {
                    times = 12
                }

                let resultTime = parseInt(Number(Number(endTime) - Number(begTime)) / Number(times))

                if (resultTime) {
                    resultTime = parseInt(resultTime / 1000);
                    resultTime = resultTime + 's';
                    return resultTime;
                }

            },
            // showDetailFun(ip) {
            //     let url = '/api/cr_sec/hackers/fuzzy_list';
            //     let params = {
            //         begTime: null,
            //         endTime: null,
            //         hackerIp: 'ip',
            //         hackerIpValue: ip
            //     };
            //
            //     let me = this;
            //     this.tempAjax(url, params, function (response) {
            //         if (response.data.rows.length > 0) {
            //             me.detailParams.leftData = response.data.rows[0]
            //         } else {
            //             me.detailParams.leftData = {
            //                 ip: ip,
            //                 location: '',
            //                 identity: '',
            //                 goodAt: '',
            //                 intercept: 0
            //
            //             }
            //         }
            //         me.hackerPicture(me.detailParams.leftData.ip,
            //             me.detailParams.leftData.location,
            //             me.detailParams.leftData.identity,
            //             me.detailParams.leftData.goodAt,
            //             me.detailParams.leftData.intercept)
            //     }, function (response) {
            //         me.detailParams.leftData = {
            //             ip: ip,
            //             location: '',
            //             identity: '',
            //             goodAt: '',
            //             intercept: 0
            //         };
            //         me.hackerPicture(me.detailParams.leftData.ip,
            //             me.detailParams.leftData.location,
            //             me.detailParams.leftData.identity,
            //             me.detailParams.leftData.goodAt,
            //             me.detailParams.leftData.intercept)
            //     });
            //
            //
            // },
            changeTab() {
                this.showDetail = false
                this.showTable = true
            },
            // tempAjax(url, params, success, failure, type) {
            //     if (!type) {
            //         type = 'get'
            //     }
            //     this.$http[type](url, {
            //         params: params
            //     })
            //         .then(function (response) {
            //
            //             success(response);
            //
            //
            //         }).catch(function (response) {
            //         failure(response)
            //     })
            // },
            returnFun() {
                this.$router.go(-1);
                this.$store.commit('removeRoute', this.$route.path);
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

        },
        mounted() {
            let SrcIP = this.SrcIP;
            let _this = this;
           debugger
            this.$http.get("/api/ssa_table", {
                params: {
                    index: "ssa_envents*",
                    type: "nsec",
                    CombQuery: {
                        program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                    },
                    search: {
                        SrcIP:SrcIP
                    },
                }
            }).then(res => {
                debugger
                _this.detailParams.leftData["ip"] = res.data.rows[0]._source.SrcIP;
                _this.detailParams.leftData["location"] = res.data.rows[0]._source.dPosition;
                _this.detailParams.leftData["identity"] = res.data.rows[0]._source.threatType === '外部'?'黑客':'白客';
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

    .sec_hacker .ivu-tabs {
        overflow: visible;
    }

    .sec_hacker .fontStyle {
        font-size: 30px;
        margin-left: 10px;

    }

    .sec_hacker .font-container {
        color: rgb(255, 255, 255);
        font-size: 15px;
    }

    .changePosition {
        position: absolute;
        top: -52px;
        right: 20px;
    }

    .sec_hacker .return {
        cursor: pointer;
        font-size: 40px;
        margin-left: 20px;
    }

    .sec_hacker .return:hover {
        color: #FFFFFF;
    }

    .sec_hacker .detail_font {
        margin-top: 16px;
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
    }

    .sec_hacker .detail_font > div {
        margin-bottom: 2%;
    }

    .sec_hacker .hacker_intercept {
        font-size: 36px;
    }
</style>
