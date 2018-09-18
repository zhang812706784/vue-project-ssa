<style lang="less">
    @import '../../../styles/common.less';
    .customPadding{
        margin-bottom: 20px;
    }
    .dateContaier{
        position: relative;
        margin-bottom: 30px;
    }
    .dateContaier_wrap{
        position: absolute;
        top:0px;
        right:20px;
    }
</style>

<template>
    <div>
        <!--<div style="color: red;">
            g_selectIndex============{{g_selectIndex}}
            <br>
            g_selectType============{{g_selectType}}
            <br>
            g_selectFiled1============{{g_selectFiled1}}
            <br>
            g_selectFiled2============{{g_selectFiled2}}
            <br>
            g_selectFiled1Value============{{g_selectFiled1Value}}
            <br>
        </div>-->

        <Row>
            <Col span="24" class="dateContaier">
                <div class="dateContaier_wrap">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="changeDate"></DatePicker>
                </div>
            </Col>
        </Row>
        <Row :gutter="16" class="customPadding">
            <Col span="8" class="height-echart">
            <!--所有索引(数据库)-->
            <tp-ssa-echarts :allParams="ESIndexSet"></tp-ssa-echarts>
            </Col>
            <Col span="8" class="height-echart">
            <!--某索引的所有type(数据库中的表)-->
            <tp-ssa-echarts :allParams="ESTypeSet" ref="ESTypeRef"></tp-ssa-echarts>
            </Col>
            <Col span="8" class="height-echart">
            <!--某type中所有的字段(表中的所有字段)-->
            <tp-ssa-echarts :allParams="ESAllFiledSet" ref="ESAllFiledRef"></tp-ssa-echarts>
            </Col>
        </Row>

        <Row :gutter="16" class="customPadding">
            <Col span="8" class="height-echart">
                <!--模块xx的子类xx的xx的排名-->
                <tp-ssa-echarts :allParams="ESSingleFiledSet" ref="ESSingleFiledSetRef"></tp-ssa-echarts>
            </Col>

            <Col span="8" class="height-echart">
                <!--模块xx的子类xx的xx的趋势图-->
                <tp-ssa-echarts :allParams="ESSingleFieldTrenSet" ref="ESSingleFieldTrenSetRef"></tp-ssa-echarts>
            </Col>

            <Col span="8" class="height-echart">
                <!--选择二级钻取字段-->
                <tp-ssa-echarts :allParams="ESTwoAllFiledSet" ref="ESTwoAllFiledSetRef"></tp-ssa-echarts>
            </Col>
        </Row>

        <Row :gutter="16" class="customPadding">
            <Col span="8" class="height-echart">
                <!--xx=xx的xx的排名-->
                <tp-ssa-echarts :allParams="ESFild2InFiled1Set" ref="ESFild2InFiled1SetRef"></tp-ssa-echarts>
            </Col>

            <Col span="8" class="height-echart">
                <!--xx=xx的xx的趋势-->
                <tp-ssa-echarts :allParams="ESFild2InFiled1Trend" ref="ESFild2InFiled1TrendRef"></tp-ssa-echarts>
            </Col>

            <Col span="8" class="height-echart">
                <!--xx=xx的xx的排名-->
                <tp-ssa-echarts :allParams="ESDoublePie" ref="ESDoublePieRef"></tp-ssa-echarts>
            </Col>
        </Row>

    </div>

</template>

<script type="es6">
  import TpSsaEcharts from '../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts'

  export default {
    name: 'sa_modelIndex_child',
    components: {TpSsaEcharts},
    data () {
      return {
        g_selectIndex: '',
        g_selectType: '',
        g_selectFiled1: '',
        g_selectFiled2:'',
        g_selectFiled1Value:'',
        begTime:null,
        endTime:null,
        ESIndexSet: {
          id: 'index',
          type: 'pie',
          title: '总体信息分类',
          url: '/api/getpie',
//          reload: 20000,
          data: {
            aggField: 'index',
            size: 100
          },
          event: {
            click: params => {
              this.selectTypeChangeRedraw(params.name)
            }
          },
          callback: data => {

            if (data.rows.length > 0) {
                let name = '';
              //冯华志让我搞个默认值，适用于当前演示版本保证展示一定有数据，本来默认字段是data.rows[0].key
              // let name = data.rows[3] ? data.rows[3].key : data.rows[0].key;
                for( let i of data.rows){
                    if(i.key.indexOf("ssa") !== -1){
                        name = i.key;
                        break;
                    }
                }
              this.selectTypeChangeRedraw(name);
            }else{
              this.selectTypeChangeRedraw('')
            }

          }
        },
        ESTypeSet: {
          id: 'type',
          type: 'pie',
          title: `模块XX的子类`,
          url: '/api/getpie',
//          reload: 20000,
          data: {
            index: '',
            aggField: 'type',
            size: 100
          },
          event: {
            click: params => {
              this.selectAllFiledChangeRedraw(this.g_selectIndex, params.name)
            }
          },
          callback: data => {

            if (data.rows.length > 0) {
              this.selectAllFiledChangeRedraw(this.g_selectIndex, data.rows[0].key);
            }else{
              this.selectAllFiledChangeRedraw(this.g_selectIndex, '');
            }

          }
        },
        ESAllFiledSet: {
          id: 'allFiled',
          type: 'pie',
          title: `模块XX的子类xxx的所有字段`,
          url: '/api/getfield',
//        reload: 20000,
          data: {
            index: '',
            type: ''
          },
          event: {
            click: params => {

              this.g_selectFiled1 = params.name;

              this.selectSingleFiledChangeRedraw(this.g_selectIndex, this.g_selectType, this.g_selectFiled1);

              this.selectSingleFieldTrenChangeRedraw(this.g_selectIndex, this.g_selectType, this.g_selectFiled1);

              this.selectESTwoAllFiledSetChangeRedraw(this.g_selectIndex,this.g_selectType);
            }
          },
          callback: data => {
            if (data.rows.length > 0) {
              //冯华志让我搞个默认值，适用于当前演示版本保证展示一定有数据，本来this.g_selectFiled1默认字段是data.rows[0].key
              //this.g_selectFiled2默认字段为this.g_selectFiled1;*/

              // this.g_selectFiled1 = data.rows[22] ? data.rows[22].key : data.rows[0].key;
              // this.g_selectFiled2 = data.rows[23] ? data.rows[23].key : data.rows[0].key;
                this.g_selectFiled1 = 'SrcIP';
                this.g_selectFiled2 = 'DstIP';


              this.selectSingleFiledChangeRedraw(this.g_selectIndex,this.g_selectType, this.g_selectFiled1);

              this.selectSingleFieldTrenChangeRedraw(this.g_selectIndex,this.g_selectType, this.g_selectFiled1);

              this.selectESTwoAllFiledSetChangeRedraw(this.g_selectIndex,this.g_selectType);

            }else{
              this.selectSingleFiledChangeRedraw(this.g_selectIndex,this.g_selectType, '');

              this.selectSingleFieldTrenChangeRedraw(this.g_selectIndex,this.g_selectType, '');

              this.selectESTwoAllFiledSetChangeRedraw(this.g_selectIndex,this.g_selectType);
            }

          }
        },

        ESSingleFiledSet: {
          id: 'singleFiled',
          type: 'pie',
          title: `模块xx的子类xx的xx的排名`,
          url: '/api/getpie',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
            aggField:'',
            size:5,
            begTime:null,
            endTime:null

          },
          event: {
            click: params => {

              this.selectESFild2InFiled1SetRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,params.name,true);

              this.selectESFild2InFiled1TrendRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,params.name);

              this.selectESDoublePieRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,params.name);
            }
          },
          callback: data => {

            if (data.rows.length > 0) {
              this.selectESFild2InFiled1SetRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,data.rows[0].key,true);

              this.selectESFild2InFiled1TrendRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,data.rows[0].key);

              this.selectESDoublePieRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,data.rows[0].key);
            }else{

                this.selectESFild2InFiled1SetRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                  this.g_selectFiled2,'',true);

                this.selectESFild2InFiled1TrendRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                  this.g_selectFiled2,'');

                this.selectESDoublePieRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                  this.g_selectFiled2,'');

            }

          }
        },

        ESSingleFieldTrenSet: {
          id: 'singleFieldTrend',
          type: 'line',
          title: `模块xx的子类xx的xx的趋势图`,
          url: '/api/getlines',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
            aggField: '',
            begTime:null,
            endTime:null,
            size:5
          },
          event: {
            click: params => {

            }
          }
        },

        ESTwoAllFiledSet: {
          id: 'twoAllFiled',
          type: 'pie',
          title: `选择二级钻取字段`,
          url: '/api/getfield',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
          },
          event: {
            click: params => {
              this.g_selectFiled2=params.name;


              this.selectESFild2InFiled1SetRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,this.g_selectFiled1Value,false);

              this.selectESFild2InFiled1TrendRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,this.g_selectFiled1Value);

              this.selectESDoublePieRedraw(this.g_selectIndex,this.g_selectType,this.g_selectFiled1,
                this.g_selectFiled2,this.g_selectFiled1Value);

            }
          }
        },

        ESFild2InFiled1Set: {
          id: 'fild2InFiled1',
          type: 'bar',
          title: `xx=xx的xx的排名`,
          url: '/api/getpie',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
            queryObj:null,
            aggField:'',
            size:5,
            begTime:null,
            endTime:null
          },
          event: {
            click: params => {

            }
          }
        },

        ESFild2InFiled1Trend: {
          id: 'Fild2InFiled1Trend',
          type: 'line',
          title: `xx=xx的xx的趋势`,
          url: '/api/getlines',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
            queryObj:null,
            aggField:'',
            begTime:null,
            endTime:null,
            size:5
          },
          event: {
            click: params => {

            }
          }
        },

        ESDoublePie: {
          id: 'doublePie',
          type: 'pie',
          title: `xx=xx的xx的排名`,
          url: '/api/getpie',
//        reload: 20000,
          data: {
            index: '',
            type:  '',
            queryObj:null,
            aggField:'',
            size:5,
            begTime:null,
            endTime:null
          },
          event: {
            click: params => {

            }
          }
        }
      }
    },
    created () {},
    watch:{
      begTime(val,oldval){
        this.refreshAll();
      },
      endTime(val,oldval){
        this.refreshAll();
      }

    },
    methods: {
      refreshAll(){
        let selectIndex = this.g_selectIndex;
        let selectType = this.g_selectType;
        let selectFiled1 = this.g_selectFiled1;
        let selectFiled2 = this.g_selectFiled2;
        let selectFiled1Value = this.g_selectFiled1Value;
        this.selectTypeChangeRedraw(this.g_selectIndex);
        this.selectSingleFiledChangeRedraw (selectIndex, selectType, selectFiled1);
        this.selectSingleFieldTrenChangeRedraw (selectIndex, selectType, selectFiled1);
        this.selectESTwoAllFiledSetChangeRedraw (selectIndex, selectType);
        this.selectESFild2InFiled1SetRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value,false);
        this.selectESFild2InFiled1TrendRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value);
        this.selectESDoublePieRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value);

      },
      selectTypeChangeRedraw (selectIndex) {

        this.g_selectIndex = selectIndex

        this.ESTypeSet.title = '模块' + this.g_selectIndex + '的子类'

        this.$refs.ESTypeRef.changeParams({
          index: this.g_selectIndex,
          aggField: 'type',
          size: 100
        })

      },

      selectAllFiledChangeRedraw (selectIndex, selectType) {
        this.g_selectType = selectType
        this.ESAllFiledSet.title = `模块${selectIndex}的子类${this.g_selectType}的所有字段`

        this.$refs.ESAllFiledRef.changeParams({
          'index': selectIndex,
          'type': this.g_selectType
        })
      },

      selectSingleFiledChangeRedraw (selectIndex, selectType, firstFiled) {

        this.ESSingleFiledSet.title = `模块${selectIndex}的子类${selectType}的${firstFiled}的排名`

        this.$refs.ESSingleFiledSetRef.changeParams({

          'index': selectIndex,
          'type':  selectType,
          'aggField':firstFiled,
          'size':5,
          'begTime':this.begTime,
          'endTime':this.endTime
        })
      },

      selectSingleFieldTrenChangeRedraw (selectIndex, selectType, firstFiled) {

        this.ESSingleFieldTrenSet.title = `模块${selectIndex}的子类${selectType}的${firstFiled}的趋势图`

        this.$refs.ESSingleFieldTrenSetRef.changeParams({

          'index': selectIndex,
          'type':  selectType,
          'aggField':firstFiled,
          'begTime':this.begTime,
          'endTime':this.endTime,
          'size':5
        })
      },

      selectESTwoAllFiledSetChangeRedraw (selectIndex, selectType) {

        this.$refs.ESTwoAllFiledSetRef.changeParams({

          'index': selectIndex,
          'type':  selectType,
        })
      },

      selectESFild2InFiled1SetRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value,flag){
        if(flag){
          this.g_selectFiled1Value=selectFiled1Value;
        }

        this.ESFild2InFiled1Set.title = `${selectFiled1} = ${this.g_selectFiled1Value}的${selectFiled2}的排名`;
        let tempObj = {
          'index': selectIndex,
          'type': selectType,
          'aggField': selectFiled2,
          'size': 5,
          'begTime':this.begTime,
          'endTime':this.endTime
        }
        if(selectFiled1 != ""){
          tempObj.queryObj = {[selectFiled1]: selectFiled1Value};
        }

        this.$refs.ESFild2InFiled1SetRef.changeParams(tempObj);
        /*this.$refs.ESFild2InFiled1SetRef.changeParams({
          index: selectIndex,
          type: selectType,
          queryObj: {[selectFiled1]: selectFiled1Value},
          aggField: selectFiled2,
          size: 5
        })*/


      },

      selectESFild2InFiled1TrendRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value){

        this.ESFild2InFiled1Trend.title = `${selectFiled1} = ${this.g_selectFiled1Value}的${selectFiled2}的趋势`;

        let tempObj = {
          'index': selectIndex,
          'type': selectType,
          'aggField': selectFiled2,
          'begTime':this.begTime,
          'endTime':this.endTime,
          'size': 5
        }
        if(selectFiled1 != ""){
          tempObj.queryObj = {[selectFiled1]: selectFiled1Value};
        }

        this.$refs.ESFild2InFiled1TrendRef.changeParams(tempObj);
        /*this.$refs.ESFild2InFiled1TrendRef.changeParams({
          index: selectIndex,
          type:  selectType,
          queryObj:{[selectFiled1]:selectFiled1Value},
          aggField:selectFiled2,
          begTime:1526907600000,
          endTime:1526911200000,
          size:5
        });*/

      },

      selectESDoublePieRedraw(selectIndex,selectType,selectFiled1,selectFiled2,selectFiled1Value){

        this.ESDoublePie.title = `${selectFiled1} = ${this.g_selectFiled1Value}的${selectFiled2}的排名`;

        let tempObj = {
          'index': selectIndex,
          'type': selectType,
          'aggField': selectFiled2,
          'size': 5,
          'begTime':this.begTime,
          'endTime':this.endTime
        }
        if(selectFiled1 != ""){
          tempObj.queryObj = {[selectFiled1]: selectFiled1Value};
        }

        this.$refs.ESDoublePieRef.changeParams(tempObj);

       /* this.$refs.ESDoublePieRef.changeParams({
          index: selectIndex,
          type:  selectType,
          queryObj:{[selectFiled1]:selectFiled1Value},
          aggField:selectFiled2,
          size:5
        });*/

      },

      changeDate(params){
        this.begTime = new Date(params[0]).getTime();
        this.endTime = new Date(params[1]).getTime();
      },
    }
  }
</script>
