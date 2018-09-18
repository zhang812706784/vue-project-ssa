<template>
  <div class="sys-manage">
    <Tabs @on-click="setBrowserTime" ref="tabs">
      <TabPane :label="$t('后端配置')" name="name1">
        <div class="tabItem">
          <Row>
            <Form ref="ELKForm" :model="ELKSetting" :rules="ELKruleValidate" label-position="left" :label-width="120">
              <FormItem :label="$t('ES IP配置')" prop="elk_host">
                <Input v-model="ELKSetting.elk_host" :placeholder="$t('请输入IP')" clearable/>
              </FormItem>
              <FormItem :label="$t('ES 端口配置')" prop="elk_port">
                <Input v-model="ELKSetting.elk_port" number :placeholder="$t('请输入端口')" clearable />
              </FormItem>
              <FormItem class="form-action">
                <Button type="primary" @click="configSubmit('ELK','ELKForm')">{{$t('保存')}}</Button>
                <Button type="primary" @click="getELKData(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>
              </FormItem>
              <hr/>
              <FormItem :label="$t('默认搜索时间配置')" prop="elk_port">
                <div v-if="dateShow" :style="{left:barWidth+'px'}">
                  <!--<DatePicker format="yyyy/MM/dd" type="daterange" :placeholder="$t('选择开始-结束日期')" style="width: 200px"></DatePicker>-->
                  <DatePicker  v-model="timeStr" format="yyyy/MM/dd" type="daterange" :placeholder="$t('选择开始-结束日期')" style="width: 200px" @on-change="dateChange"></DatePicker>
                  <br/>
                  <FormItem class="form-action">
                    <Button type="primary" @click="changeTime" style="margin-left: -19px">{{$t('保存')}}</Button>
                    <Button  @click="getTimeData(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>
                  </FormItem>
                </div>
              </FormItem>
            </Form>

          </Row>
        </div>
      </TabPane>
      <TabPane :label="$t('扫描工具配置')" name="name2">
        <div class="tabItem">
          <Form ref="openvasForm" :model="openvasSetting" :rules="openvasValidate" label-position="left" :label-width="130">
            <FormItem :label="$t('扫描工具 IP配置')" prop="host">
              <Input v-model="openvasSetting.host" :placeholder="$t('Enter something...')" clearable/>
            </FormItem>
            <FormItem :label="$t('扫描工具 端口配置')" prop="port">
              <Input v-model="openvasSetting.port" number :placeholder="$t('Enter something...')" clearable />
            </FormItem>
            <FormItem class="form-action">
              <Button type="primary" @click="configSubmit('openvas','openvasForm')">{{$t('保存')}}</Button>
              <Button type="primary" @click="getOpenvasData(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane :label="$t('时间配置')" name="timeSetting">
        <div v-show="customView" class="tabItem">
          <Form :model="timeSetting" label-position="left" :label-width="100">
            <div class="time-setting-view">
              <Button @click="customView = true" :class="{active:customView}">{{$t('客户端')}}</Button>
              <Button @click="customView = false" :class="{active:!customView}">{{$t('服务端')}}</Button>
            </div>
            <FormItem class="time-setting-content" :label="$t('系统时间')">
              <Input v-model="timeSetting.date" :placeholder="$t('默认系统时间')" style="width:auto" disabled/>
              <Button type="primary" @click="getTime(true)" style="margin-left: 20px" class="refresh-btn">{{$t('刷新')}}</Button>
            </FormItem>
            <FormItem class="time-setting-content" :label="$t('时区选择')">
              <Select v-model="timeSetting.time_zone" size="small" class="time-zone">
                <Option v-for="item in timeZoneList" :value="item.value" :key="item.value">{{ $t(item.key) }}</Option>
              </Select>
            </FormItem>
            <FormItem class="time-setting-content" :label="$t('配置方式')">
              <RadioGroup v-model="timeSetting.timeConfigType" vertical style="width:100%">
                <Row>
                  <Col span="12">
                  <Radio :label="$t('同步浏览器时间')" class="radio" style="display:inline-block"></Radio>
                  <Input :value="browserTime | timeFormat" :disabled="!(timeSetting.timeConfigType === $t('同步浏览器时间'))" style="width:auto" />
                  </Col>
                </Row>

                <Radio :label="$t('手动配置')" class="radio"></Radio>
                <!-- <DatePicker v-model="timeSetting.selectedDateTime" :readonly="!(timeSetting.timeConfigType === '手动配置')"
                :disabled="!(timeSetting.timeConfigType === '手动配置')" placement="bottom" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"></DatePicker> &ndash;&gt;-->
                <Row type="flex" justify="start" class="time-select">
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('时')">
                    <Select v-model="selectedDateTime.hour" size="small" style="width:80px" :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.hourList" :value="item" :key="item">{{ item.toString().length>1?item:'0' +item}}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('分')">
                    <Select v-model="selectedDateTime.minute" size="small" style="width:80px" :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.minuteList" :value="item" :key="item">{{ item.toString().length>1?item:'0' +item }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('秒')">
                    <Select v-model="selectedDateTime.second" size="small" style="width:80px" :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.secondList" :value="item" :key="item">{{ item.toString().length>1?item:'0' +item }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="start" class="time-select">
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('年')">
                    <Select v-model="selectedDateTime.year" size="small" @on-change="selectYear" style="width:80px"
                            :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.yearList" :value="item" :key="item">{{ item.toString() }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('月')">
                    <Select v-model="selectedDateTime.month" size="small" @on-change="selectMonth" style="width:80px" :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.monthList" :value="item" :key="item">{{ item.toString().length>1?item:'0' +item }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="5" :md="3" :lg="2">
                  <FormItem :label="$t('日')">
                    <Select v-model="selectedDateTime.day" size="small" style="width:80px" :disabled="!(timeSetting.timeConfigType === $t('手动配置'))">
                      <Option v-for="item in date.dayList" :value="item" :key="item">{{ item.toString().length>1?item:'0' +item }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
                <Radio :label="$t('与NTP服务器同步')" class="radio"></Radio>
                <div class="config" style="margin-top:8px">
                  <Row>
                    <Col :span="4" :md="3" :lg="2">
                    <span>{{$t('服务器')}}</span>
                    </Col>
                    <Col :span="2">
                    <Select v-model="timeSetting.server" size="small" class="time-zone" :disabled="!(timeSetting.timeConfigType === $t('与NTP服务器同步'))">
                      <Option v-for="item in serverList" :value="item">{{ item }}</Option>
                    </Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col :span="4" :md="3" :lg="2">
                    <span>{{$t('同步间隔')}}</span>
                    </Col>
                    <Col :span="3" :md="2">
                    <Input number style="width:40px" v-model="timeSetting.serverStepHour" :disabled="!(timeSetting.timeConfigType === $t('与NTP服务器同步'))" />
                    <span>{{$t('小时')}}</span>
                    </Col>
                    <Col :span="3" :md="2" >
                    <Input number style="width:40px" v-model="timeSetting.serverStepMinute" :disabled="!(timeSetting.timeConfigType === $t('与NTP服务器同步'))" />
                    <span>
                      {{$t('分')}}
                    </span>
                    </Col>
                  </Row>
                </div>
              </RadioGroup>
            </FormItem>
            <div class="time-setting-action">
              <Button type="primary" @click="timeConfigSubmit('timeForm')">{{$t('确定')}}</Button>
            </div>
          </Form>
        </div>
        <div v-show="!customView" class="tabItem">
          <Form label-position="left" :label-width="100">
            <div class="time-setting-view">
              <Button @click="customView = true" :class="{active:customView}">{{$t('客户端')}}</Button>
              <Button @click="customView = false" :class="{active:!customView}">{{$t('服务端')}}</Button>
            </div>
            <FormItem :label="$t('ntp服务')">
              <Select v-model="ntpServerSetting.type" size="small" style="width:300px">
                <Option v-for="item in ntpServerList" :value="item.value" :key="item.value">{{ $t(item.name) }}</Option>
              </Select>
              <Button @click="getNtpServer(ntpServerSetting.type)" style="margin-left: 8px" class="refresh-btn">{{$t('确定')}}</Button>
            </FormItem>
            <FormItem :label="$t('状态信息')">
              <!-- {{ntpServerSetting.value}} -->
              <Input style="width:auto" v-model="ntpServerSetting.value" type="textarea" :rows="5" />
            </FormItem>
          </Form>
        </div>
      </TabPane>

      <!--新加插件管理-->
      <TabPane :label="$t('组件状态信息')" name="name5">
        <!--<div class="tabItem">-->
          <!--<Form>-->
            <!--<div>-->
              <!--<div style="width:700px;padding:5px 0 5px 20px">-->
                <!--<p style="line-height: 30px;padding-left: 10px;" v-html="plugStatus"></p>-->
              <!--</div>-->
            <!--</div>-->
            <!--&lt;!&ndash;<FormItem class="form-action">&ndash;&gt;-->
              <!--&lt;!&ndash;<Button type="primary" @click="getSysInfo(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>&ndash;&gt;-->
            <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
          <!--</Form>-->
        <!--</div>-->

        <Row>
          <Button v-for="(item,key) in plugList" v-on:click="changeProgram(key,item)" >{{key}}:{{item}}</Button>
          <!--<FormItem class="form-action">-->
            <!--<Button type="primary" @click="getSysInfo(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>-->
          <!--</FormItem>-->
        </Row>

      <!--新加插件管理-->
      </TabPane>
      <TabPane :label="$t('系统信息')" name="name4">
        <div class="tabItem">
          <Form>
            <div>
              <div style="width:700px;padding:5px 0 5px 20px">
                <p style="line-height: 30px;padding-left: 10px;" v-html="sysInfo"></p>
              </div>
            </div>
            <FormItem class="form-action">
              <Button type="primary" @click="getSysInfo(true)" style="margin-left: 8px">{{$t('刷新')}}</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import TpTwoStageDrillingPluginFlow from '../../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-flow';
import TpTable from '../../../../components/locale-components/tp-table/tp-table';
import timeFormat from '../filter/timeFormat';
import moment from 'moment';

export default {
  name: 'systemManage',
  components: {
    TpTable,
    TpTwoStageDrillingPluginFlow
  },
  data() {
    return {
      barWidth: 0,
      dateShow: false,
        plugList:{},
        // plugStatus:[],
      customView: true,
      browserTime: null,
      ELKSetting: {},
      openvasSetting: {},
      timeSetting: {},
        timeStr:'',
      begTime:"",
      endTime:"",
      bTimestemp:"",
      eTimestemp:"",
      ntpServerSetting: {
        value: null
      },
      selectedDateTime: {
        hour: 0,
        minute: 0,
        second: 0
      },
      sysInfo: '',
      // 验证规则
      ELKruleValidate: {
        elk_host: [
          { required: true, message: this.$t('IP不能为空') },
          {
            validator: (rule, value, callback) => {
              if (
                /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/.test(
                  value
                )
              ) {
                callback();
              } else {
                callback(new Error(this.$t('请输入正确的ip地址')));
              }
            },
            trigger: 'change'
          }
        ],
        elk_port: [
          {
            required: true,
            type: 'number',
            min: 0,
            max: 65535,
            message: this.$t('范围0-65535')
          }
        ]
      },
      openvasValidate: {},
      // 静态数据
      date: {
        hourList: [...new Array(24).keys()],//0-23
        minuteList: [...new Array(60).keys()],//0-59
        secondList: [...new Array(60).keys()],//0-59
        yearList: new Array(moment().year() + 1 - 1900)//2018-1900
          .fill(0)
          .map((n, i) => i + 1900)
          .reverse()
      },
      timeZoneList: [
        { key: 'GMT-11:00 阿皮亚', value: 'Pacific/Apia' },
        { key: 'GMT-10:00 檀香山', value: 'Pacific/Honolulu' },
        { key: 'GMT-09:30 马克萨斯', value: 'Pacific/Marquesas' },
        { key: 'GMT-09:00 甘比尔', value: 'Pacific/Gambier' },
        { key: 'GMT-08:00 皮特克恩岛', value: 'Pacific/Pitcairn' },
        { key: 'GMT-07:00 凤凰城', value: 'America/Phoenix' },
        { key: 'GMT-06:00 哥斯达黎加', value: 'America/Costa_Rica' },
        { key: 'GMT-05:00 波哥达', value: 'America/Bogota' },
        { key: 'GMT-04:00 瓜德罗普岛', value: 'America/Guadeloupe' },
        { key: 'GMT-03:00 阿根廷', value: 'America/Argentina/Buenos_Aires' },
        { key: 'GMT-02:00 迪诺罗尼亚群岛', value: 'America/Noronha' },
        { key: 'GMT-01:00 佛得角普拉亚', value: 'Atlantic/Cape_Verde' },
        { key: 'GMT+00:00 达喀尔', value: 'Africa/Dakar' },
        { key: 'GMT+01:00 金沙萨', value: 'Africa/Kinshasa' },
        { key: 'GMT+02:00 哈拉雷', value: 'Africa/Harare' },
        { key: 'GMT+03:00 摩加迪沙', value: 'Africa/Mogadishu' },
        { key: 'GMT+04:00 毛里求斯', value: 'Indian/Mauritius' },
        { key: 'GMT+04:30 喀布尔', value: 'Asia/Kabul' },
        { key: 'GMT+05:00 撒马尔罕', value: 'Asia/Samarkand' },
        { key: 'GMT+05:30 哥伦布', value: 'Asia/Colombo' },
        { key: 'GMT+06:00 达卡', value: 'Asia/Dhaka' },
        { key: 'GMT+07:00 万象', value: 'Asia/Vientiane' },
        { key: 'GMT+08:00 上海', value: 'Asia/Shanghai' },
        { key: 'GMT+09:00 东京', value: 'Asia/Tokyo' },
        { key: 'GMT+10:00 关岛', value: 'Pacific/Guam' },
        { key: 'GMT+11:00 努美亚', value: 'Pacific/Noumea' },
        { key: 'GMT+11:30 诺福克', value: 'Pacific/Norfolk' },
        { key: 'GMT+12:00 瑙鲁', value: 'Pacific/Nauru' },
        { key: 'GMT+13:00 汤加塔布岛', value: 'Pacific/Tongatapu' }
      ],
      serverList: [
        'pool.ntp.org',
        'asia.pool.ntp.org',
        'europe.pool.ntp.org',
        'north-america.pool.ntp.org',
        'oceania.pool.ntp.org',
        'south-america.pool.ntp.org',
        'time.windows.com',
        'time.nuri.net',
        'time.asia.apple.com',
        'clock.via.net',
        'time.asia.apple.com',
        'clock.via.net',
        'ntp.nasa.gov',
        'ntp.sjtu.edu.cn'
      ],
      ntpServerList: [
        { name: '检查状态', value: 'check' },
        { name: '启动服务', value: 'start' },
        { name: '重启服务', value: 'restart' },
        { name: '停止服务', value: 'stop' },
        { name: '设置配置文件', value: 'defaultcfg' }
      ]
    };
  },
  created() {
    let { elk_host: host, elk_port: port } = this.ELKruleValidate;
    let [{ value }] = this.ntpServerList;
    this.token = JSON.parse(window.localStorage.voucher).token;
    this.ntpServerSetting.type = value;
    this.openvasValidate = {
      host,
      port
    };
    // 异步获取数据 不同步
    this.getELKData();
    this.getOpenvasData();
    this.getTime();
    this.getSysInfo();
    this.getTimeData();


      Date.prototype.Format = function (fmt) {
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }
  },
  mounted() {
    // 这里为tab上的时间选择固定位置（所有tabItem的长度）
     this.getPlugInfo();
    setTimeout(() => {
      let tabBar = this.$refs.tabs.$refs.navScroll.children[0];
      this.barWidth = tabBar.offsetWidth;
      this.dateShow = true;
    });
  },
  filters: {
    timeFormat: function(value) {
      return timeFormat(parseInt(value));
    }
  },
  methods: {

      getPlugInfo(){
          let _this =this;
          this.$http.post('/api/sysmgr/plug_manage', {
              // param:{
              //     option:"status"
              // }
              param:"status"
          }).then(res => {
              _this.plugList = {};
              if (res.code === 0) {
                  let tempArr = res.data.rows;
                  for (var i in tempArr){
                      let tempList = tempArr[i].trim().split(":");
                      if (tempList.length>1){
                          switch (tempList[0]) {
                              case 'logstash':
                                  if (tempList[1]*1 >=2 ){
                                      _this.plugList[tempList[0]] = '正常运行'
                                  }  else{
                                      _this.plugList[tempList[0]] = '未启动'
                                  }
                                  break;
                              case 'redis':
                                  if (tempList[1]*1 >=4 ){
                                      _this.plugList[tempList[0]] = '正常运行'
                                  }  else{
                                      _this.plugList[tempList[0]] = '未启动'
                                  }
                                  break;
                              case 'redis':
                                  if (tempList[1]*1 >=4 ){
                                      _this.plugList[tempList[0]] = '正常运行'
                                  }  else{
                                      _this.plugList[tempList[0]] = '未启动'
                                  }
                                  break;
                              default :
                                  if (tempList[1]*1 >=1 ){
                                      _this.plugList[tempList[0]] = '正常运行'
                                  }  else{
                                      _this.plugList[tempList[0]] = '未启动'
                                  }
                                  break;

                          }

                          // _this.plugList[tempList[0]] = tempList[1];
                      }
                      else {
                          _this.plugList[tempArr[0]] = ""
                      }
                  }

                  // console.log( this.plugStatus);
              }
          });
      },

      changeProgram(plugName,status){
          // 判断组件状态 ,如果是正常运行,返回状态运行,否则请求
          if (status != "正常运行" ){
              this.$http.post('/api/sysmgr/plug_manage', {
                  param:{
                      plugName:plugName,
                      option:"restart"
                  }
              }).then(res => {
                  this.getPlugInfo();
                  this.$Message.success(this.$t('状态已更新!'));
              });
          } else {
              this.$Message.success(this.$t('正常运行!'));
          }

      },

      dateChange(date) {
          let bTime = new Date(date[0]).getTime();
          let eTime = new Date(date[1]).getTime();
          this.begTime = bTime;
          this.endTime = eTime;
      },
      getELKData(status) {
          this.$http
              .get('/api/sysmgr/get_conf', {params: {type: 'ELK'}})
              .then(res => {
                  if (res.code === 0) {
                      this.ELKSetting = res.data.rows.info;
                      this.ELKHOST = this.ELKSetting.elk_host;
                  }
                  if (status) {
                      this.$Message.success(this.$t('已刷新'));
                  }
              });
      },



      getTimeData(status) {
          this.$http
              .get('/api/sysmgr/get_conf', {params: {type: 'time'}})
              .then(res => {
                  if (res.code === 0) {

                      console.log(res);
                      let beginTime =res.data.rows.beginTime;
                      let endTime = res.data.rows.endTime;
                      this.bTimestemp = res.data.rows.beginTime;
                      this.eTimestemp = res.data.rows.endTime;
                      var timeStr = new Date(beginTime).Format("yyyy/MM/dd");
                      timeStr = timeStr+" - "+(new Date(endTime).Format("yyyy/MM/dd/"));

                      this.timeStr = timeStr;
                  }
                  if (status) {
                      this.$Message.success(this.$t('已刷新'));
                  }
              });
      },


      getOpenvasData(status) {
          this.$http
              .get('/api/sysmgr/get_conf', {params: {type: 'openvas'}})
              .then(res => {
                  if (res.code === 0) {
                      this.openvasSetting = res.data.rows.info;
                  }
                  if (status) {
                      this.$Message.success(this.$t('已刷新'));
                  }
              });
      },
      getTime() {
          // 这里是一些静态数据
          this.$http
              .get('/api/sysmgr/get_time')
              .then(res => {
                  if (res.code === 0) {
                      let {date, time_zone} = res && res.data.row;
                      date = timeFormat(parseInt(date));
                      this.timeSetting = {date, time_zone};
                  }
              })
              .catch(err => {
              });
      },
      changeTime() {
          let data = {};
         if (this.begTime){
             data= {
                 type: 'time',
                 beginTime: this.begTime,
                 endTime: this.endTime
             };
         } else{
              data = {
                 type: 'time',
                 beginTime: this.bTimestemp,
                 endTime: this.eTimestemp
             };
         }
          this.$http.post('/api/sysmgr/update_conf', data).then(res => {
              if (res.code === 0) {
                   this.$Message.success(this.$t('Success!'));
                  //console.log('Success!')
              } else {
                  this.$Message.error(this.$t('Fail!'));
              }
          });
      },
      getSysInfo(status) {
          this.$http.get('/api/getversion').then(res => {

              if (res.msg){
                  this.sysInfo =
                      res.msg.replace(/:/g, ' : ').replace(/[\r\n]/g, '<br/>') || '';
              } else {
                  this.sysInfo = res
              }

              if (status) {
                  this.$Message.success(this.$t('已刷新!'));
              }
          });
      },
      getNtpServer(param) {
          this.$http.post('/api/sysmgr/ntp_server', {param}).then(res => {
              if (res.code === 0) {
                  this.ntpServerSetting.value = res.data.row;
                  console.log(this.ntpServerSetting);
              }
          });
      },

      setTime(date) {
          return this.$http
              .post('/api/sysmgr/set_time', {date: timeFormat(date)})
              .then(res => {
                  return res.code === 0;
              });
      },
      setZone(zone) {
          return this.$http
              .post('/api/sysmgr/set_zone', {time_zone: zone})
              .then(res => {
                  return res.code === 0;
              });
      },
      setNtp(ip, hour, minutes) {
          return this.$http
              .post('/api/sysmgr/ntp_sync', {server_ip: ip, hour, minutes})
              .then(res => {
                  return res.code === 0;
              });
      },
      setBrowserTime(name) {
          if (name === 'timeSetting') {
              if (this.browserTimer) {
                  clearInterval(this.browserTimer);
              }
              this.browserTime = new Date().getTime();
              this.browserTimer = setInterval(() => {
                  this.browserTime += 1000;
              }, 1000);
          }
      },
      selectYear(value) {
          this.date.monthList = new Array(12).fill(0).map((v, i) => i + 1);
      },
      selectMonth(value) {
          let days = moment()
              .set('year', this.selectedDateTime.year)
              .set('month', parseInt(value) - 1)
              .daysInMonth();
          this.date.dayList = new Array(days).fill(0).map((v, i) => i + 1);
          console.log(this.date.dayList);
      },
      configSubmit(type, name) {
          this.$refs[name].validate(valid => {
              if (valid) {//验证通过
                  let data;
                  if (type === 'ELK') {
                      let {elk_host, elk_port} = this.ELKSetting;
                      data = {
                          type,
                          id: this.ELKHOST,
                          elk_host: elk_host,
                          elk_port: elk_port,
                          token: this.token
                      };
                  }
                  if (type === 'openvas') {
                      let {host, port} = this.openvasSetting;
                      data = {
                          type,
                          id: host,
                          open_host: host,
                          open_port: port,
                          token: this.token
                      };
                  }

                  this.$http.post('/api/sysmgr/update_conf', data).then(res => {
                      if (res.code === 0) {
                          this.$Message.success(this.$t('Success!'));
                      } else {
                          this.$Message.error(this.$t('Fail!'));
                      }
                  });
              }
          });
      },
      timeConfigSubmit(name) {
          let {timeConfigType} = this.timeSetting;
          if (timeConfigType) {
              let promise = null;
              switch (timeConfigType) {
                  case this.$t('同步浏览器时间'):
                      promise = this.setTime(this.browserTime);
                      break;
                  case this.$t('手动配置'):
                      let {
                          year,
                          month,
                          day: date,
                          hour,
                          minute,
                          second
                      } = this.selectedDateTime;
                      let d = moment().set({
                          year,
                          month,
                          date,
                          hour,
                          minute,
                          second
                      });
                      promise = this.setTime(timeFormat(d.toDate()));
                      break;
                  case this.$t('与NTP服务器同步'):
                      let {server, serverStepHour, serverStepMinute} = this.timeSetting;
                      promise = this.setNtp(server, serverStepHour, serverStepMinute);
                      break;
              }
              promise &&
              promise.then(res => {
                  if (res) {
                      this.setZone(this.timeSetting.time_zone).then(res => {
                          if (res) {
                              this.$Message.success(this.$t('Success!'));
                          } else {
                              this.$Message.error(this.$t('Fail!'));
                          }
                      });
                  }
              });
          } else {
              this.setZone(this.timeSetting.time_zone).then(res => {
                  if (res) {
                      this.$Message.success(this.$t('Success!'));
                  } else {
                      this.$Message.error(this.$t('Fail!'));
                  }
              });
          }
      }
  },


};
</script>

<style lang="less">
.sys-manage {
  position: relative;
}
.ivu-form-item {
  margin: 0;
  padding: 5px 0 5px 20px;
}

.time-select .ivu-form-item {
  margin: 0;
  padding: 5px 0 5px 0;
}

.tabItem {
  color: white;
  padding-bottom: 108px;
}

.time-setting-content {
  margin: 0;
  padding: 5px 0 5px 20px;
}

.time-setting-action {
  display: flex;
  margin-top: 10px;
  justify-content: flex-start;
  width: 700px;
  padding: 5px 0 5px 20px;
}

.time-setting-view button {
  width: auto;
  padding: 0 15px;
  height: 30px;
  font-size: 14px;
  text-align: center;
  line-height: 28px;
  display: inline-block;
  cursor: pointer;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: none;
}

.time-setting-view .active {
  color: #d0d0d0;
  background: rgba(204, 204, 204, 0.3);
}

.ivu-form .ivu-form-item-label {
  color: white;
}

.ivu-input {
  width: 200px;
  height: 26px;
  border-radius: 5px;
  outline-style: none;
  color: #888;
  background-color: transparent;
  border: 1px solid #888;
  padding: 0 4px;
}

.config .ivu-input {
  width: 40px;
}

.form-action .ivu-form-item-content {
  margin: 10px 0 0 0 !important;
  width: 700px;
}

.form-action button,
.time-setting-action button {
  height: 28px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  color: #fff;
  padding: 5px 20px;
  margin-right: 8px;
  background-image: linear-gradient(to right, #8a00ff, #4189f6);
  outline: none;
  cursor: pointer;
}

.ivu-form {
  padding: 8px;
  border: 1px solid #e5e5e5;
  overflow: visible;
}

.time-select .ivu-form-item-label {
  width: auto !important;
}

.time-zone {
  width: 300px;
  border-radius: 5px;
}

.refresh-btn {
  background-color: lightgray;
  width: 55px;
  height: 25px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-size: 10px !important;
  outline: none;
  background-color: darkgray;
  cursor: pointer;
  color: white;
  line-height: 12.5px;
}

textarea {
  background-color: white !important;
}

.time-container {
  position: absolute;
  top: 4px;
}
</style>
