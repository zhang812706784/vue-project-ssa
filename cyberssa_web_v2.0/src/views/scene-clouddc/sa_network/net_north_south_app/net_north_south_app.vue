<template>
    <Tabs value="应用流量统计分析">
        <TabPane label="应用流量统计分析" name="应用流量统计分析">
            <Col class="vm-date">
                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeTime" class="vm-date1"></DatePicker>
            </Col>

            <Row>
                <Col span="2" style="width: 200px; float:right;background: transparent;">
                    <Select @on-change="changeDate">
                        <Option :value="item.val" v-for="item in select_data">{{item.text}}</Option>
                    </Select>
                </Col>
            </Row>
            <Tabs  type="card">

                <TabPane label="实时速率" name="实时速率">
                    <!--do realTime-->
                    <Col span="24">
                        <tp-two-stage-drilling-plugin-flow :all_params="realTimeRate" ref="realTimeRateRef"></tp-two-stage-drilling-plugin-flow>
                    </Col>
                </TabPane>
                <TabPane label="平均速率" name="平均速率">
                    <!--do 平均-->
                    <Col span="24">
                        <tp-two-stage-drilling-plugin-flow :all_params="averageRate" ref="averageRateRef"></tp-two-stage-drilling-plugin-flow>
                    </Col>
                </TabPane>
                <TabPane label="流量" name="流量">
                    <!--处理流量-->
                    <tp-two-stage-drilling-plugin-flow :all_params="rateOfFlow" ref="rateOfFlowRef" ></tp-two-stage-drilling-plugin-flow>
                </TabPane>

            </Tabs>

        </TabPane>

        <TabPane label="应用流量日志列表" name="应用流量日志列表">
            <Row>
                <Col :span="6">
                    <p>实时速率</p>
                </Col>
                <Col :span="6">
                    <p>平均速率</p>
                </Col>
                <Col :span="6">
                    <p>流量</p>
                </Col>
            </Row>
            <tp-table :all_params="appflowlist" ></tp-table>
        </TabPane>

    </Tabs>
</template>

<script type="es6">
    import TpTwoStageDrillingPluginFlow from "../../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-flow";
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "test-import-echarts",
        components: {TpTwoStageDrillingPluginFlow,TpTable},
        data () {
            return {
                barRefs: '',
                timeout: 600,
                select_data: [{val: 'up', text: "上行"}, {val: 'down', text: "下行"}, {val: 'double', text: "双向"}],
                realTimeRate: {},
                averageRate: {},
                rateOfFlow: {},
                appflowlist: {},
                begTime: (new Date().getTime()) - 10800000,
                endTime: new Date().getTime(),


            };
        },
        created(){
            this.realTimeRate={
                flow:"north_south",
                    bar_yNumType:"rate",
                    SecondTable_yNumType:"rate",
                    trendyNumType:"rate",
                    SecondTrendyNumType:"rate",

                    //一级钻取字段和二级钻取字段
                    FirstDrillingType:'AppName',
                    SecondDrillingType:"UserIp",
                    ShowFiled:'up',
                    select_data:[{val:'up',text:"上行"},{val:'down',text:"下行"},{val:'double',text:"双向"}],

                    //时间插件
                    date_elementID:'date_val',

                    //一级钻取柱状图参数
                    bar_elementID:'realBar',
                    bar_title:"实时速率Top10",
                    bar_url:'/api/cr_net/net/real_top_chart',
                    //一级钻取topN趋势图参数
                    trend_elementID:'realLines',
                    trendTitle:"实时速率Top5历史趋势图",
                    trendUrl:'/api/cr_net/net/real_top_trend',

                    //二级钻取table表格参数
                    SecondTableElementID:"realsecondtable",
                    SecondTableURL:'/api/cr_net/net/real_top_list',
                    SecondTableListColumns:[
                    {
                        title: '应用名',
                        key:  'selectFirstStage',
                    },
                    {
                        title: '源IP',
                        key: 'key',
                    },
                    {
                        title: '次数',
                        key: 'doc_count',
                    }
                ],
                    //二级钻取趋势图参数
                    SecondTrendElementID:"realBarTendLine",
                    SecondTrendTitle:"趋势图",
                    SecondTrendURL:'/api/cr_net/net/real_top_list_trend',
            };
            this.averageRate={
                flow:"north_south",
                    bar_yNumType:"rate",
                    SecondTable_yNumType:"rate",
                    trendyNumType:"rate",
                    SecondTrendyNumType:"rate",


                    //一级钻取字段和二级钻取字段
                    FirstDrillingType:'AppName',
                    SecondDrillingType:"UserIp",
                    ShowFiled:'up',
                    select_data:[{val:'up',text:"上行"},{val:'down',text:"下行"},{val:'double',text:"双向"}],

                    //时间插件
                    date_elementID:'date_val',


                    //一级钻取柱状图参数
                    bar_elementID:'rateBar',
                    bar_title:"平均速率Top10",
                    bar_url:'/api/cr_net/net/rate_top_chart',
                    //一级钻取topN趋势图参数
                    trend_elementID:'rateLines',
                    trendTitle:"平均速率Top5历史趋势图",
                    trendUrl:'/api/cr_net/net/rate_top_trend',

                    //二级钻取table表格参数
                    SecondTableElementID:"ratesecondtable",
                    SecondTableURL: '/api/cr_net/net/rate_top_list',
                    SecondTableListColumns:[
                    {
                        title: '应用名',
                        key:  'selectFirstStage',
                    },
                    {
                        title: '源IP',
                        key: 'key',
                    },
                    {
                        title: '次数',
                        key: 'doc_count',
                    }
                ],
                    //二级钻取趋势图参数
                    SecondTrendTitle:"趋势图",
                    SecondTrendElementID:"rateBarTendLine",
                    SecondTrendURL: '/api/cr_net/net/rate_top_list_trend'
            };
            this.rateOfFlow={
                flow:"north_south",
                    bar_yNumType:"bytes",
                    SecondTable_yNumType:"bytes",
                    trendyNumType:"bytes",
                    SecondTrendyNumType:"bytes",

                    //一级钻取字段和二级钻取字段
                    FirstDrillingType:'AppName',
                    SecondDrillingType:"UserIp",
                    ShowFiled:'up',
                    select_data:[{val:'up',text:"上行"},{val:'down',text:"下行"},{val:'double',text:"双向"}],
                    //时间插件
                    date_elementID:'date_val',


                    //一级钻取柱状图参数
                    bar_elementID:'flowBar',
                    bar_title:"流量Top10",
                    bar_url: '/api/cr_net/net/flow_top_chart',
                    //一级钻取topN趋势图参数
                    trend_elementID:'flowLines',
                    trendTitle:"流量Top5历史趋势图",
                    trendUrl: '/api/cr_net/net/flow_top_trend',

                    //二级钻取table表格参数
                    SecondTableElementID:"flowsecondtable",
                    SecondTableURL:'/api/cr_net/net/flow_top_list',
                    SecondTableListColumns:[
                    {
                        title: '应用名',
                        key:  'selectFirstStage',
                    },
                    {
                        title: '源IP',
                        key: 'key',
                    },
                    {
                        title: '次数',
                        key: 'doc_count',
                    }],
                    //二级钻取趋势图参数
                    SecondTrendTitle:"趋势图",
                    SecondTrendElementID:"flowBarTendLine",
                    SecondTrendURL: '/api/cr_net/net/flow_top_list_trend',
            };
            this.appflowlist= {
                id: 'appflowlist',
                    type: "table",
                    ajaxType: "get",
                    checkBox: true,
                    url: '/api/cr_net/net/flow_list',
                    data: {
                    flow:"north_south",
                        flowType:"AppName",
                        begTime:"",
                        endTime:"",
                        search:""
                },
                add_btn: false,
                    del_btn: false,
                    modify_btn: false,
                    cols: [
                    {
                        title: 'IP地址',
                        key: 'key',
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
                                        title:params.row.key
                                    }
                                }, params.row.key)
                            ]);

                            // return h('div', params.row._source.enforce);
                        }
                    },
                    // 实时速率
                    {
                        title: '上行速率',
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
                                        title:this.bytesRateFormat(params.row.real_uprate)
                                    }
                                }, this.bytesRateFormat(params.row.real_uprate))
                            ]);

                        }
                    },
                    {
                        title:'下行速率',
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
                                        title:this.bytesRateFormat(params.row.real_downrate )                                       }
                                }, this.bytesRateFormat(params.row.real_downrate ))
                            ]);

                        }
                    },
                    {
                        title:'双向速率',
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
                                        title:this.bytesRateFormat(params.row.real_flowrate)
                                    }
                                },this.bytesRateFormat(params.row.real_flowrate))
                            ]);
                            // return h('div',params.row._source.ip_address);
                        }
                    },
                    {
                        title: '占比',
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
                                        title:params.row.real_flowrate_percent.toFixed(2)+"%"
                                    }
                                }, params.row.real_flowrate_percent.toFixed(2)+"%")
                            ]);

                            // return h('div', params.row._source.uuid);


                        }
                    },
                    // 平均速率-上行速率
                    {
                        title: '上行速率',
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
                                        title:this.bytesRateFormat(params.row.uprate)
                                    }
                                }, this.bytesRateFormat(params.row.uprate))
                            ]);

                        }
                    },
                    {
                        title:'下行速率',
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
                                        title:this.bytesRateFormat(params.row.downrate )                                       }
                                }, this.bytesRateFormat(params.row.downrate ))
                            ]);

                        }
                    },
                    {
                        title:'双向速率',
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
                                        title:this.bytesRateFormat(params.row.flowrate)
                                    }
                                },this.bytesRateFormat(params.row.flowrate))
                            ]);
                            // return h('div',params.row._source.ip_address);
                        }
                    },
                    {
                        title: '占比',
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
                                        title:params.row.flowrate_percent.toFixed(2)+"%"
                                    }
                                }, params.row.flowrate_percent.toFixed(2)+"%")
                            ]);


                        }
                    },
                    // 流量
                    {
                        title: '上行',
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
                                        title:this.bytesFormat(params.row.up)
                                    }
                                }, this.bytesFormat(params.row.up))
                            ]);

                        }
                    },
                    {
                        title:'下行',
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
                                        title:this.bytesFormat(params.row.down )                                       }
                                }, this.bytesFormat(params.row.down ))
                            ]);

                        }
                    },
                    {
                        title:'双向',
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
                                        title:this.bytesFormat(params.row.flow)
                                    }
                                },this.bytesFormat(params.row.flow))
                            ]);
                            // return h('div',params.row._source.ip_address);
                        }
                    },
                    {
                        title: '占比',
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
                                        title:params.row.flow_percent.toFixed(2)+"%"
                                    }
                                }, params.row.flow_percent.toFixed(2)+"%")
                            ]);

                            // return h('div', params.row._source.uuid);


                        }
                    }
                ]
            };
        },
        methods: {
            testEvent (params) {
                console.warn(`============ 触发 echarts event ============`);
                console.log(params);
            },
            changeDate(val) {
                this.realTimeRate.ShowFiled = val;
                this.averageRate.ShowFiled = val;
                this.rateOfFlow.ShowFiled = val;
                console.log(val)

                this.$refs.realTimeRateRef.changeParams(
                    {
                        ShowFiled: val,
                    }
                );

                this.$refs.averageRateRef.changeParams(
                    {
                        ShowFiled: val,
                    }
                );

                this.$refs.rateOfFlowRef.changeParams(
                    {
                        ShowFiled: val,
                    }
                );

            },
            changeTime(params){

                var bTime = new Date(params[0]).getTime();
                var eTime = new Date(params[1]).getTime();
                this.$refs.realTimeRateRef.changeParams(
                    {
                        begTime: bTime,
                        endTime: eTime,
                    }
                );
                this.$refs.averageRateRef.changeParams(
                    {
                        begTime: bTime,
                        endTime: eTime,
                    }
                );

                this.$refs.rateOfFlowRef.changeParams(
                    {
                        begTime: bTime,
                        endTime: eTime,
                    }
                );



            },
            bytesRateFormat (bytes, timeLong) {
                if (!timeLong){										// 如果timeLong为空，就默认以分为计数单位

                return this.bytesFormat(bytes) + "/m";}
                else {												// 如果timeLong不为空

                    var timeNum = parseInt(timeLong);				// 取timeLong的数字，如 12h，取 12
                    var tranBytes = this.bytesFormat(bytes * timeNum);		// 将timeLong的数字乘以流量并格式化

                        return tranBytes + "/" + timeLong.substr(-1);		// 添加timeLong的单位
                }
            },
            bytesFormat (bytes) {
                if (bytes === 0) return '0 B';

                var unitSize = 1024;

               let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                // Math.floor():函数返回一个数的自然对数
                // Math.log():函数返回一个数的自然对数
                let index = Math.floor(Math.log(bytes) / Math.log(unitSize));

               let num = (bytes / Math.pow(unitSize, index)).toPrecision(3);

                return num + ' ' + sizes[index];
                //toPrecision(3) 后面保留一位小数，如1.0GB
                //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
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
