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
        name: "tp-two-stage-drilling-plugin-app",
        components: {TpSsaEcharts, TpTable},
        props: {
            all_params: Object,
        },
        data:function(){
          return {
              ScondLinesShowFlag:"true",
              fieldSet:{
                  Content:'关键字',
                  URL:'网站路径',
                  SrcIP:'用户',
                  host:'探针',
                  AppName:'应用名',
                  DstIP:"目的IP"
              },
              selectFirstFiledValue:"",
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
                let given_params=this.all_params;

                /*一级柱形图*/
                this.firstBarParams= {
                    yNumType:given_params.bar_yNumType,
                    id: given_params.bar_elementID,
                    type: "bar",
                    title:given_params.bar_title,
                    url: given_params.bar_url,
                    data: given_params.firstBarData,
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
                this.firstLinesParams= {
                    yNumType:given_params.trendyNumType,
                    id: given_params.trend_elementID,
                    type: "line",
                    title:  given_params.trendTitle,
                    url:  given_params.trendUrl,
                    beforeEcharCallBack:this.beforeEcharCallBack,
                    data: given_params.firstLinesData,
                };

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
                    checkAll: true,
                    checkBoxOnchange:data => {
                        let selectKeys=[];
                        for( let item of data) {
                            selectKeys.push(item.key)
                        }
                        this.SecondLineRedraw(selectKeys)
                    },

                    url:given_params.SecondTableURL,
                    data:given_params.SecondTableData,
                    cols: given_params.SecondTableListColumns,

                    callback:data => {
                        let selectKeys=[];
                        for( let item of data.rows) {
                            item.selectFirstFiledValue=this.selectFirstFiledValue;
                            selectKeys.push(item.key)
                        }
                        this.SecondLineRedraw(selectKeys);
                    },
                };

                /*二级钻取趋势图*/
                //this.selectKeys=[];
                this.ScondLinesParams={
                    id: given_params.SecondTrendElementID,
                    type: "line",
                    title: given_params.SecondTrendTitle,
                    url: given_params.SecondTrendURL,
                    data:given_params.ScondLinesData,
                };
            },

            /*二级钻取table刷新*/
            SecondTableRedraw( selectFirstFiledValue ) {

                let given_params = this.all_params;
                this.selectFirstFiledValue = selectFirstFiledValue;

                // let tmpData=this.SecondTableParams.data;
                // tmpData.queryObj={[given_params.FirstDrillingType]:this.selectFirstFiledValue};
                // this.$refs.SecondTableRef.changeParams(tmpData);
                this.$refs.SecondTableRef.changeParams({
                    aggsCol: given_params.SecondDrillingType,
                    begTime: given_params.begTime,
                    endTime: given_params.endTime,
                    checkBox:true,
                    queryObj: {
                        [given_params.FirstDrillingType]: this.selectFirstFiledValue
                    },
                    offline_attr_p: given_params.SecondDrillingType + "_in_" + given_params.FirstDrillingType,
                });
            },

            /*二级钻取趋势图刷新*/
            SecondLineRedraw(selectKeyList) {
                let given_params = this.all_params;
                if(selectKeyList.length==0) {
                    this.ScondLinesShowFlag=false;
                    return;
                }
                this.ScondLinesShowFlag=true;
                this.selectKeys=selectKeyList;
                this.ScondLinesParams.title=this.fieldSet[given_params.FirstDrillingType] + this.selectFirstFiledValue+"的源IP趋势图";

                // let tmpData=this.ScondLinesParams.data;
                // tmpData.selectKeys=this.selectKeys;
                //
                // let tmpData2={
                //     yNumType:given_params.SecondTrendyNumType,
                //     offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                //     flow:given_params.flow,
                //     aggsCol:given_params.SecondDrillingType,
                //     direction:given_params.ShowFiled,
                //     begTime:given_params.begTime,
                //     endTime:given_params.endTime,
                //     selectKeys:this.selectKeys
                // };
                this.$refs.ScondLinesRef.changeParams({
                    yNumType:given_params.SecondTrendyNumType,
                    offline_attr_p:given_params.SecondDrillingType+"_in_"+given_params.FirstDrillingType,
                    flow:given_params.flow,
                    aggsCol:given_params.SecondDrillingType,
                    direction:given_params.ShowFiled,
                    begTime:given_params.begTime,
                    endTime:given_params.endTime,
                    selectKeys: selectKeyList
                });
            },

            changeParams(dataDict) {
                this.all_params.bar_title = dataDict.firstBarTitle
                this.all_params.trendTitle = dataDict.trendTitle
                this.all_params.SecondTableListColumns = dataDict.cols
                this.myCreated();
                if(dataDict){
                    this.firstBarParams.data=dataDict.firstBarData;
                    this.firstLinesParams.data=dataDict.firstLinesData;
                    this.SecondTableParams.data=dataDict.SecondTableData;
                    this.ScondLinesParams.data=dataDict.ScondLinesData;
                }
                this.$refs.firstBarRef.changeParams(this.firstBarParams.data);
                this.$refs.firstLinesRef.changeParams(this.firstLinesParams.data);
                // this.$refs.SecondTableRef.changeParams(this.SecondTableParams.data);
            },
            changeDate(data){
                if(data){
                    this.all_params.begTime = data.begTime;
                    this.all_params.endTime = data.endTime;
                    this.firstBarParams.data.begTime =data.begTime
                    this.firstBarParams.data.endTime =data.endTime
                    this.firstLinesParams.data.begTime=data.begTime;
                    this.firstLinesParams.data.endTime= data.endTime
                }
                this.$refs.firstBarRef.changeParams(this.firstBarParams.data);
                this.$refs.firstLinesRef.changeParams(this.firstLinesParams.data);
                this.$refs.SecondTableRef.changeParams(this.SecondTableParams.data);
            }
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
