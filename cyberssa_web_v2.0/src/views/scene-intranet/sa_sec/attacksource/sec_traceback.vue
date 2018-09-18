<!--Created by zmj on 2018/8/31-->
<!--<style lang="less">

</style>-->
<template>
    <Tabs value="入侵回溯" :animated="false" @on-click="changeTab" class="sec_target">

        <TabPane label="入侵回溯" name="入侵回溯">
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
                    <Col span="12" class="height-echart">
                        <div id="forceChart" style="width: 545px;height:240px;"></div>
                    </Col>
                    <Col span="12" class="height-echart">
                        <tp-ssa-echarts :allParams="pic_Line" ref="blackListTrendLine_detail_ref"></tp-ssa-echarts>
                    </Col>
                </Row>

            </div>
            <!--表格-->
            <tp-table ref="targetListRef" :all_params="targetList" v-show="showTable" @getPageSize="getPageSize"></tp-table>

        </TabPane>

    </Tabs>

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
                page :'',
                size:'',
                index:'',
                DstIP:'',
                SrcIP:'',
                showDetail: false,
                showTable: true,
                detailParams: {
                    leftData: {}
                },

                pic_Line: {},
                targetList: {},

            }
        },

        created() {
            let source = this.$route.params.source;
            let DstIP;
            let SrcIP;

            SrcIP = source && (source === 'index_intrusion' || source === 'sec_target'|| source === 'sec_hacker')  ? this.$route.params.CombQueryDataObject.SrcIP : '';
            DstIP = source && (source === 'index_intrusion' || source === 'sec_target'|| source === 'sec_hacker')  ? this.$route.params.CombQueryDataObject.DstIP : '';


            this.SrcIP = SrcIP;
            this.DstIP = DstIP;
            console.log('this is jump 入侵回溯 test console');

            this.targetList = {
                id: 'tableBox',
                type: 'table',
                ajaxType: 'get',
                checkBox: true,
                url: '/api/ssa_table',
                data:{
                    index: "ssa_envents*",
                    type: "nsec",
                    CombQuerys:{
                        program: ["IPS","ATTACK","AV","FILE_TRANSFER","WEB_ACCESS","SCAN","FILTER","DEFENSE","APP_POLICY","APP_POLICY"],
                    },

                    search:{
                        SrcIP:SrcIP,
                        DstIP:DstIP
                    },

                },
                add_btn: false,
                modify_btn: false,
                cols: [
                    {
                        title: '攻击',
                        key: 'attack',
                        render: (h, params) => {
                            return h('span','第' + `${(params.index + 1) + (this.page === 1 ? 0 : (this.page - 1) * this.size)}`+ '次');
                        },
                    },
                    {
                        title: '攻击类型',

                        render: (h, params) => {
                            console.log(params);
                            return h('div', params.row._source.program)
                        }
                    },

                    {
                        title: '源IP',
                        render: (h, params) => {
                            return h('div', params.row._source.SrcIP)
                        }
                    },
                    {
                        title: '目的IP',
                        key: 'DstIP',
                        render: (h, params) => {
                            return h('div', params.row._source.DstIP);
                        }
                    },
                    {
                        title: '源地址',
                        render: (h, params) => {
                            return h('div', params.row._source.sPosition)
                        }
                    },
                    {
                        title: '目的地址',
                        render: (h, params) => {
                            return h('div', params.row._source.dPosition)
                        }
                    },
                    // {
                    //     title: '拦截次数',
                    //     key: 'intercept',
                    //     render: (h, params) => {
                    //         return h('div', params.row.intercept)
                    //     }
                    // },
                    {
                        title: '时间',
                        key: 'timestamp',
                        render: (h, params) => {
                            return h('div', params.row._source.GenTime)
                        }
                    }
                ]
            };


            this.pic_Line = {
                id: 'pic_Line',
                type: 'line',
                title: `攻击频率历史趋势`,
                url: '/api/cr_sec/hackers/attack',
                data: {
                    begTime: null,
                    endTime: null,
                    fieldSrc: "SrcIP",
                    fieldDst: "DstIP",
                    srcIp:  SrcIP ,
                    dstIp: DstIP
                },
            };
            let _this = this;
            this.$http.get("/api/getpie", {
                params: {
                    index: "ssa_envents*",
                    type: "nsec",
                    aggField: "attacktype",
                    queryObj: {
                        SrcIP:  _this.SrcIP,
                        DstIP: _this.DstIP
                    },
                }
            }).then(res => {
                let data = {};
                console.log(res.data.rows);
                for (let i = 0; i < res.data.rows.length; i++) {
                    data[res.data.rows[i].key] = res.data.rows[i].doc_count;
                }
                this.drawForceChart(data);

            });


        },

        methods: {
            getPageSize(page,size){
              this.page = page;
              this.size = size;
            },
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
                    fieldName: 'DstIP'
                })
            },

            // 渲染流程图
            drawForceChart(valueList) {
                console.log('开始执行流程图');
                var tempX = 300;
                var teamY = 300;
                var nodeList = [];
                for (var value in valueList) {
                    var tempNodeObj = {};
                    switch (value){
                        case '侦查(recon)' :

                            // tempX = 100;
                            break;
                        case '投放(delivery)':
                            tempX = tempX + 100;
                            teamY = teamY + 200;
                            break;
                        case '开发利用(exploitation)':
                            tempX = tempX + 100;
                            teamY = teamY + 200;
                            break;
                        case 'cc通信(cc)' :
                            tempX = tempX + 300;
                            break;
                        case '恶意活动(action)':
                            tempX = tempX + 400;

                            break;
                    }
                    tempNodeObj['name'] = value;
                    tempNodeObj['x'] = tempX;
                    tempNodeObj['y'] = 300 ;
                    tempX = 300;
                    teamY = 300;
                    nodeList.push(tempNodeObj);
                };
                var option = {
                    title: {
                        text: '攻击阶段'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} : {b}'
                    },

                    series: [
                        {
                            type: 'graph',
                            layout: 'none',
                            symbolSize: 50,
                            roam: true,
                            label: {
                                normal: {
                                    show: true
                                }
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: nodeList,
                            links: [{
                                symbolSize: [5, 20],
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },

                            },
                                {
                                    source: '侦查(recon)',
                                    target: '投放(delivery)',
                                },
                                {
                                    source: '投放(delivery)',
                                    target: '开发利用(exploitation)'
                                },
                                {
                                    source: '开发利用(exploitation)',
                                    target: 'cc通信(cc)'
                                },
                                {
                                    source: 'cc通信(cc)',
                                    target: '恶意活动(action)'
                                },
                                {
                                    source: '投放(delivery)',
                                    target: 'cc通信(cc)'
                                },
                            ],

                        }
                    ]
                };


                var forceChart = this.$echarts.init(document.getElementById('forceChart'));

                forceChart.setOption(option);
                window.addEventListener('resize', forceChart.resize);
            },
            changeTab() {
                this.showDetail = false;
                this.showTable = true
            },


            returnFun() {
                this.$router.go(-1);
                this.$store.commit('removeRoute', this.$route.path);
            }
        },
        mounted(){


        }

    }
</script>

<style lang="less">
    @import '../../../../styles/common.less';
    @import '../../../scene-clouddc/global_perspective/intrusion_situation.less';

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
