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

<template>
    <div class="sec_hacker">
        <Tabs v-model="tabFlag" @on-click="changeTab">
            <TabPane label="黑客综合统计" name="黑客综合统计">
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

                    <tp-ssa-echarts :allParams="blackListTop10Bar" ref="blackListTop10Bar"></tp-ssa-echarts>

                    </Col>
                    <Col span="12" class="height-echart">
                    <!--黑客攻击历史趋势-->

                    <tp-ssa-echarts :allParams="blackListTrendLine" ref="blackListTrendLine"></tp-ssa-echarts>

                    </Col>

                </Row>
            </TabPane>
            <TabPane label="黑客分析列表" name="黑客分析列表">
                <!--表格-->
                <tp-table  ref="refhackerList" :all_params="hackerList" v-show="showTable"></tp-table>
                <!--详情-->
                <div v-show="showDetail" class="detail_part">

                    <Row>
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
            </TabPane>

        </Tabs>


    </div>
</template>

<script type="es6">
  import TpSsaEcharts from '../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts'
  import TpTable from '../../../../components/locale-components/tp-table/tp-table'

  export default {
    name: 'sec_hacker',
    components: {TpTable, TpSsaEcharts},
    data () {
      return {
         tabFlag:"黑客综合统计",
        begTime: '',
        endTime: '',
        total: 0,
        showDetail: false,
        showTable: true,
        detailParams: {
          leftData: {}
        },
        blackListTop10Bar: {
          id: 'pic_10Bar',
          type: 'bar',
          title: `黑客攻击排名Top10`,
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
                this.jumpToTableWithCombQuery(this.blackListTop10Bar.data.fieldName, params.name);
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
        hackerList: {
          id: 'tableBox',
          type: 'table',
          ajaxType: 'get',
          checkBox: true,
          url: '/api/cr_sec/hackers/fuzzy_list',
          data: {
            fieldName: 'SrcIP',
            program: 'program'
          },
          add_btn: false,
          // del_btn:true,
          modify_btn: false,
          cols: [
            {
              title: 'IP',
              key: 'ip',
              search: 'ip',
              render: (h, params) => {
                return h('div', params.row.ip)
              }
            },
            {
              title: '地理位置',
              key: 'location',
              render: (h, params) => {
                return h('div', params.row.location)
              }
            },
            {
              title: '擅长领域',
              key: 'goodAt',
              search: 'goodAt',
              render: (h, params) => {
                return h('div', params.row.goodAt)
              }
            },
            {
              title: '黑客/白客',
              key: 'identity',
              search: 'identity',
              render: (h, params) => {
                return h('div', params.row.identity)
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
              title: '拦截次数',
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
              title: '黑客画像',
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
                              name: "sec_hacker",
                              params: {
                                  source: 'index_intrusion',
                                  CombQueryDataObject: {
                                      SrcIP: params.row['ip']
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
                /*查询的字段域 和 字段value */

            }
          }
        }
      }
    },
    created () {
      let me = this
      let url = '/api/cr_sec/hackers/histogram'
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
        this.$refs.blackListTop10Bar.changeParams({
          begTime: this.begTime,
          endTime: this.endTime,
          fieldName: 'SrcIP'
        });

        this.$refs.blackListTrendLine.changeParams({
          begTime: this.begTime,
          endTime: this.endTime,
          timeLong: timeLong,
          fieldName: 'SrcIP'
        })
      },
        jumpToTableWithCombQuery(aggField, value) {

            let CombQueryDataObject = {search: {ip: [value]}};
            this.tabFlag = '黑客分析列表';//跳转
            // {search:{ [aggField]:[value]
            //
            // }}
            this.$refs.refhackerList.changeParams(CombQueryDataObject);
        },
      timeLong (begTime, endTime, times) {
        if (!times) {
          times = 12
        }

        let resultTime = parseInt(Number(Number(endTime) - Number(begTime)) / Number(times))

        if (resultTime) {
          resultTime = parseInt(resultTime / 1000)
          resultTime = resultTime + 's'
          return resultTime
        }

      },
      showDetailFun (ip) {
        this.showDetail = true
        this.showTable = false
        let url = '/api/cr_sec/hackers/fuzzy_list'
        let params = {
          begTime: null,
          endTime: null,
          hackerIp: 'ip',
          hackerIpValue: ip
        }

        let me = this
        this.tempAjax(url, params, function (response) {
          if (response.data.rows.length > 0) {
            me.detailParams.leftData = response.data.rows[0]
          } else {
            me.detailParams.leftData = {
              ip: ip,
              location: '',
              identity: '',
              goodAt: '',
              intercept: 0

            }
          }
        }, function (response) {
          me.detailParams.leftData = {
            ip: ip,
            location: '',
            identity: '',
            goodAt: '',
            intercept: 0
          }
        })

        //this.blackListTrendLine_detail.data.srcIPValue = ip;

        this.$refs.blackListTop10Bar_detail.changeParams({
          begTime: null,
          endTime: null,
          fieldName: 'SrcIP',
          srcIP: 'DstIP',
          srcIPValue: ip
        })
      },
      changeTab () {
        this.showDetail = false
        this.showTable = true
      },
      tempAjax (url, params, success, failure, type) {
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
      returnFun (event) {
        this.showDetail = false
        this.showTable = true
      }
    }

  }
</script>

