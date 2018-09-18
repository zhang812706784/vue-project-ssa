<template>
    <Row class="page-container">
        <Col span="24">
            <Row class="vms-row1">
                <!--一级柱形图-->
                <Col :span="12" style="height: 275px;">
                    <tp-ssa-echarts :allParams="firstBarParams" ref="firstBarRef"></tp-ssa-echarts>
                </Col>
                <!--一级趋势图-->
                <Col :span="12" style="height: 275px;">
                    <tp-ssa-echarts :allParams="firstLinesParams" ref="firstLinesRef"></tp-ssa-echarts>
                </Col>
            </Row>

            <!--二级柱钻取table表格-->
            <Row class="vms-row1">
                <Col :span="24" >
                    <tp-table :all_params="SecondTableParams"  ref="SecondTableRef" ></tp-table>
                </Col>
            </Row>

            <!--二级柱钻取趋势图表格-->
            <Row class="vms-row1" v-show="ScondLinesShowFlag">
                <Col :span="24" style="height: 275px;">
                    <tp-ssa-echarts :allParams="ScondLinesParams" ref="ScondLinesRef" ></tp-ssa-echarts>
                </Col>
            </Row>

        </Col>
    </Row>
</template>

<script type="es6">
    import TpTable from "../../locale-components/tp-table/tp-table";
    import TpSsaEcharts from "../../locale-components/tp-ssa-echarts/tp-ssa-echarts";
    export default {
        name: "tp-two-stage-drilling-plugin-flow",
        components: {TpSsaEcharts, TpTable},
        props: {
            all_params: Object,

        },
        data:function(){
          return {
              ScondLinesShowFlag:"true",
              selectFirstStage:"",
              firstBarParams:{},
              firstLinesParams:{},
              SecondTableParams:{},
              ScondLinesParams:{}
          }
        },
        created(){
            this.myCreated();
        },
        methods: {

            myCreated(){
                console.log(this.all_params);
                let given_params=this.all_params;

                /*一级柱形图*/
                let firstBarParams= {
                    yNumType:given_params.bar_yNumType,
                    id: given_params.bar_elementID,
                    type: "bar",
                    title:given_params.bar_title,
                    url: given_params.bar_url,
                    reload: 20000,
                    data: {
                        flow:given_params.flow,
                        flowType:given_params.FirstDrillingType,
                        direction:given_params.ShowFiled,
                        offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                        begTime:given_params.begTime,
                        endTime:given_params.endTime,
                    },
                    event: {
                        click: params => {
                            this.SecondTableRedraw(params.name);
                        }
                    },
                    callback:data => {
                        this.SecondTableRedraw(data.rows[0].key);
                    }
                };

                /*一级趋势图*/
                let firstLinesParams= {
                    yNumType:given_params.trendyNumType,
                    id: given_params.trend_elementID,
                    type: "line",
                    title:  given_params.trendTitle,
                    url:  given_params.trendUrl,
                    reload: 20000,
                    beforeEcharCallBack:this.beforeEcharCallBack,
                    data: {
                        flow:given_params.flow,
                        flowType:given_params.FirstDrillingType,
                        direction:given_params.ShowFiled,
                        begTime:given_params.begTime,
                        endTime:given_params.endTime,
                        offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                    },
                };
                this.firstBarParams=firstBarParams;
                this.firstLinesParams=firstLinesParams;

                /*二级钻取table*/
                this.SecondTableParams={
                    yNumType:given_params.SecondTable_yNumType,
                    async : false,
                    searchTime:false,//1  是否添加时间范围搜索     默认添加时间范围       Boolean     只有false的时候关闭   true和不写都为打开
                    id:given_params.SecondTableElementID,
                    type:"table",
                    ajaxType:"get",
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false,
                    pagingHide:false,
                    checkBox: true,
                    checkBoxOnchange:data => {
                        // console.log("111111111111111111111111111111111111111111111111111111111111111aa");
                        // console.log(data);
                        let selectKeys=[];
                        for( let item of data)
                        {
                            selectKeys.push(item)
                        }
                        this.SecondLineRedraw(selectKeys)
                    },

                    url:given_params.SecondTableURL,
                    data:{
                        flow:given_params.flow,
                        aggsCol:given_params.SecondDrillingType,
                        direction:given_params.ShowFiled,
                        begTime:given_params.begTime,
                        endTime:given_params.endTime,
                        queryObj:{
                            [given_params.FirstDrillingType]:""
                        },
                        offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                    },
                    cols: given_params.SecondTableListColumns,
                    callback:data => {
                        // console.log("2222222222222222222222222222222222222222222222222");
                        // console.log(data);
                        let selectKeys=[];
                        for( let item of data.rows)
                        {
                            item.selectFirstStage=this.selectFirstStage;
                            selectKeys.push(item.key)
                        }
                        this.SecondLineRedraw(selectKeys)
                    },
                };

                /*二级钻取趋势图*/
                this.selectKeys=[];
                this.ScondLinesParams={
                    id: given_params.SecondTrendElementID,
                    type: "line",
                    title: given_params.SecondTrendTitle,
                    url: given_params.SecondTrendURL,
                    data:{
                        yNumType:given_params.SecondTrendyNumType,
                        offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                        flow:given_params.flow,
                        aggsCol:given_params.SecondDrillingType,
                        selectKeys:this.selectKeys,
                        direction:given_params.ShowFiled,
                        begTime:given_params.begTime,
                        endTime:given_params.endTime,
                    },
                };

            },
            /*二级钻取table刷新*/
            SecondTableRedraw( selectFirstStage ) {
                console.log(selectFirstStage);
                let given_params = this.all_params;
                this.selectFirstStage = selectFirstStage;

                this.$refs.SecondTableRef.changeParams({
                    aggsCol: given_params.SecondDrillingType,
                    direction: given_params.ShowFiled,
                    begTime: given_params.begTime,
                    endTime: given_params.endTime,
                    queryObj: {
                        [given_params.FirstDrillingType]: this.selectFirstStage
                    },
                    offline_attr_p: given_params.SecondDrillingType + "_in_" + given_params.FirstDrillingType,
                });
            },

            /*二级钻取趋势图刷新
            * fullFilePath=./config/offlinedata6c/clouddc/sa_network/line/_cr_net/_cr_net_net_real_top_list_trend#realBarTendLine-UserIp_in_AppNameTopN Trend by UserIp in HTTP-文件下载.offlinedata.json!!!!!!!!!!!!!!!!!
            * fullFilePath=./config/offlinedata6c/clouddc/sa_network/crTrendLine/_cr_net/_cr_net_net_real_top_list_trend#realBarTendLine-UserIp_in_AppNameTopN Trend by UserIp in HTTP-文件下载.offlinedata.json
            * fullFilePath=./config/offlinedata6c/clouddc/sa_network/crTrendLine/_cr_net/_cr_net_net_real_top_list_trend#realBarTendLine-UserIp_in_AppNameTopN Trend by UserIp in HTTP-文件下载.offlinedata.json */
            SecondLineRedraw(selectKeyList) {
                let given_params = this.all_params;
                if(selectKeyList.length==0)
                {
                    this.ScondLinesShowFlag=false;
                    return;
                }

                this.ScondLinesShowFlag=true;
                
                console.log(selectKeyList);
                this.selectKeys=selectKeyList;
                this.ScondLinesParams.title="TopN Trend by "+given_params.SecondDrillingType+" in "+this.selectFirstStage;
                this.$refs.ScondLinesRef.changeParams({
                    yNumType:given_params.SecondTrendyNumType,
                    offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                    flow:given_params.flow,
                    aggsCol:given_params.SecondDrillingType,
                    selectKeys:this.selectKeys,
                    direction:given_params.ShowFiled,
                    begTime:given_params.begTime,
                    endTime:given_params.endTime,
                });
            },
            changeParams(dataDict) {
                if( dataDict ){
                    let givenparams=this.all_params;
                    for(let key in dataDict )
                    {
                        givenparams[key]=dataDict[key];
                    }
                }
                this.myCreated();
                this.$refs.firstBarRef.reload();
                this.$refs.firstLinesRef.reload();

            },
        }
    };
</script>

<style lang="less" scoped>

    .plugin {
        width: 100%;
        height: 100%;

        .ivu-col {
            height: 100%;

            .echarts-container {
                width: 100%;
                height: 100%;

                &-null {
                    width: 100%;
                    height: 100%;
                    position: relative;

                    &:before {
                        content: '';
                        width: 80%;
                        height: 70%;
                        position: absolute;
                        top: 10%;
                        left: 8%;
                        opacity: .6;
                        background-image: url('../../../../static/images/echarts/null.png');
                        background-size: cover;
                        background-position: center;
                    }
                }
            }
        }

    }

</style>
