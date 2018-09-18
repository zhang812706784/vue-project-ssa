<template>
    <div class="siteScanConfig">
        <div class="formManage">
            <Form :model="formItem" :label-width="100"  style="width:50%;margin-left: 600px;"><!--:rules="rule"-->
                <FormItem label="任务名称：" prop="taskName">
                    <input v-model="formItem.taskName"></input>
                </FormItem>
                <FormItem label="IP配置：" prop="ipConfig">
                    <RadioGroup v-model="formItem.ipConfig">
                        <Radio label="IP地址"></Radio>
                        <input v-model="formItem.ipConfigAddress"></input><br>
                        <Radio label="IP范围"></Radio>
                        <input v-model="formItem.ipRangeStart"></input>---<input v-model="formItem.ipRangeEnd"></input>
                    </RadioGroup>
                </FormItem>

                <FormItem label="任务类型：" prop="taskType">
                    <RadioGroup v-model="formItem.taskType" vertical>
                        <Radio label="一次性"></Radio>
                        <Radio label="周期循环"></Radio>
                        <span style="margin-left: 60px;padding-right: 10px">执行时间:</span>
                        <DatePicker v-model="formItem.execDate" type="date"  format="yyyy-MM-dd" placeholder="选择年月日" style="width: 150px"></DatePicker>
                        <TimePicker v-model="formItem.execTime"  placeholder="选择时间" style="width:150px"></TimePicker>
                        <br>
                        <span style="margin-left:60px">执行周期：</span>
                        <input v-model="formItem.execCycle"></input>
                        <span>天</span>

                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <button class="createBtn" @click="createTask">创建任务</button>
                </FormItem>
            </Form>
        </div>
        <div class="formManage">
            <tp-table ref="siteScanList" :all_params="tableParams"></tp-table>
        </div>
    </div>
</template>

<script>
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "siteScanConfig",
        components: {TpTable},
        data () {
            return {
                formItem: {
                    taskName: '',
                    ipConfig: 'IP地址',
                    ipAddress:'',
                    ipRange: '',
                    taskType: '一次性',
                    execDate:'',
                    execTime:'',
                    execCycle: '',
                    ipConfigAddress:'',
                    ipRangeStart:'',
                    ipRangeEnd:''
                },
                // rule: {
                //     taskName: [
                //         {required: true, message: '请输入任务名称', trigger: 'blur'}
                //     ],
                //     ipConfig: [
                //         {required: true, message: '请选择IP配置', trigger: 'change'}
                //     ],
                //     taskType: [
                //         {required: true, message: '请选择任务类型', trigger: 'change'}
                //     ]
                // },
                tableParams: {
                    id: 'siteScanConfigList',
                    index: true,
                    checkBox: false,
                    url: '/api/readDateFromES',
                    type:'table',
                    ajaxType:'get',
                    data:{

                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '任务名称',
                            render: (h, params) => {
                                return h('div', params.row._source.taskName)
                            }
                        },
                        {
                            title: 'IP/IPS',
                            render: (h, params) => {
                                return h('div', params.row._source.IP_IPS);
                            }
                        },
                        {
                            title: '开始时间',
                            render: (h, params) => {
                                return h('div', params.row._source.createTime)
                            }
                        },
                        {
                            title: '任务类型',
                            render: (h, params) => {
                                if (params.row._source.timeType === 'once'){
                                    return h('div','一次性');
                                } else {
                                    return h('div','周期循环');
                                }
                            }
                        },
                        {
                            title: '执行间隔',
                            render: (h, params) => {
                                return h('div', params.row._source.timePeriod+' '+'天')
                            }
                        },
                        {
                            title: '执行次数',
                            render: (h, params) => {
                                return h('div', params.row._source.operationCount)
                            }
                        },
                        {
                            title: '状态',
                            render: (h, params) => {
                                switch (params.row._source.status) {
                                    case "0" :
                                        return h('div','未执行');
                                    case "1" :
                                        return h('div','等待中');
                                    case "2" :
                                        return h('div','执行中');
                                    case "3" :
                                        return h('div','已执行');
                                }
                            }
                        },
                        {
                            title: '操作',  //未实现逻辑功能
                            key: 'operation',
                            render: (h, params) => {
                                let operation;
                                switch (params.row._source.status) {
                                    case "0" :
                                        operation = '执行';
                                        break;
                                    case "1" :
                                        operation = '停止';
                                        break;
                                    case "2" :
                                        operation = '停止';
                                        break;
                                    case "3" :
                                        operation = '执行';
                                }
                                return h('div',[
                                    h('a',{
                                        on: {
                                            click: ()=>{
                                                this.operateData(params);
                                            }
                                        }
                                    },operation),
                                    h('a',{
                                        style: {
                                            margin:'15px'
                                        },
                                        on: {
                                            click: ()=>{
                                                this.deleteData(params);
                                            }
                                        }
                                    },'删除')
                                ])
                            }
                        }
                    ]
                }
            }

        },
        methods: {
            sendRequest(url,obj){
                let _this=this;
                _this.$http.get(url, {
                        params:obj
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.siteScanList.changeParams();
                    }, 1000);
                });
            },
            createTask() {
                let data = this.formItem;
                let taskName = data.taskName;
                let year = data.execDate.getFullYear();
                let month =(data.execDate.getMonth()+1).toString().length>1?data.execDate.getMonth()+1:'0'+(data.execDate.getMonth()+1).toString();
                let day = data.execDate.getDate().toString().length>1?data.execDate.getDate():'0'+data.execDate.getDate();
                let parseDate = year+'-'+month+'-'+day+ ' ' + data.execTime;
                let createTime = new Date(parseDate).getTime(); //1536118562539
                let nowTime = (new Date()).valueOf();//1536118562539
                // 缓存
                let ip = data.ipConfigAddress;
                let startIP = data.ipRangeStart;
                let endIP = data.ipRangeEnd;
                let timePeriod = data.execCycle;
                let IP_IPS;
                // 正则匹配IP地址
                let match = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/;
                // IP配置
                let curUserSelect = data.ipConfig === 'IP地址' ? 'ip' : '-';
                // 任务类型
                let timeType = data.taskType === '一次性' ? 'once' : '-';

                if (curUserSelect === 'ip') {//ip配置为ip地址
                    if (ip !== '') {
                        let flag = match.test(ip);
                        if (!flag) {
                            this.$Message.info(this.$t('请输入正确的IP'));
                        }
                    } else {
                        this.$Message.info(this.$t('请输入IP'));
                    }

                    //判断任务名是否为空
                    if (taskName === '') {
                        this.$Message.info(this.$t('请输入定时任务名'));
                    } else if (nowTime < createTime) {
                        if (timeType === 'once') {
                            IP_IPS = ip;
                            let sendObj = {
                                taskName: taskName,
                                timeType: timeType,
                                createTime: parseDate,
                                timePeriod: '-',
                                operationCount: 0,
                                IP_IPS: IP_IPS,
                                status: 0
                            };
                            this.sendRequest('/api/saveDate2ES', sendObj);
                        }
                        else if (timePeriod === '') {
                            this.$Message.info(this.$t('请输入执行周期'));
                        } else if (nowTime < createTime) {
                            IP_IPS = ip;
                            let sendObj = {
                                taskName: taskName,
                                timeType: timeType,
                                createTime: parseDate,
                                timePeriod: timePeriod,
                                operationCount: 0,
                                IP_IPS: IP_IPS,
                                status: 0
                            };
                            this.sendRequest('/api/saveDate2ES', sendObj);
                        } else {
                            this.$Message.info(this.$t('您选的时间已过，请重新选择'))
                        }
                    }
                } else {//ip配置为ip范围
                    if (startIP !== '') {
                        let flag = match.test(startIP);
                        if (!flag) {
                            this.$Message.info(this.$t('请输入正确的起始IP'));
                        }
                    } else {
                        this.$Message.info(this.$t('请输入起始IP'));
                    }
                    if (endIP !== '') {
                        let flag = match.test(endIP);
                        if (!flag) {
                            this.$Message.info(this.$t('请输入正确的结束IP'));
                        }
                    } else {
                        this.$Message.info(this.$t('请输入结束IP'));
                    }
                    if (timePeriod === '') {
                        this.$Message.info(this.$t('输入执行周期'));
                    } else if (taskName === '') {
                        this.$Message.info(this.$t('请输入定时任务名'));
                    } else if (timeType === 'once') {
                        IP_IPS = startIP + '-' + endIP;
                        let sendObj = {
                            taskName: taskName,
                            timeType: timeType,
                            createTime: parseDate,
                            timePeriod: '-',
                            operationCount: 0,
                            IP_IPS: IP_IPS,
                            status: 0
                        };
                        this.sendRequest('/api/saveDate2ES', sendObj);
                    } else if (nowTime < createTime) {
                        if (startIP < endIP) {
                            IP_IPS = startIP + '-' + endIP;
                            let sendObj = {
                                taskName: taskName,
                                timeType: timeType,
                                createTime: parseDate,
                                timePeriod: timePeriod,
                                operationCount: 0,
                                IP_IPS: IP_IPS,
                                status: 0
                            };
                            this.sendRequest('/api/saveDate2ES', sendObj);
                        } else {
                            this.$Message.info(this.$t('起始IP已经超过结束IP'));
                        }
                    } else {
                        this.$Message.info(this.$t('您选的时间已过，请重新选择'));
                    }

                }
            },
            operateData(params) {
                let _data=params.row._source;
                let _this=this;
                let obj = {
                    IP_IPS: _data.IP_IPS,
                    createTime: _data.createTime,
                    status: _data.status,
                    timePeriod: _data.timePeriod,
                    taskName: _data.taskName,
                    timeType: _data.timeType,
                    operationCount: _data.operationCount
                };
                if (obj.status === '0') {
                    obj.status = '1';
                    this.sendRequest('/api/operation_Execute',obj);
                } else {
                    this.sendRequest('/api/operation_Stop',obj);
                }
            },
            deleteData(params){
                let _data=params.row._source;
                let _this=this;
                let obj = {
                    IP_IPS: _data.IP_IPS,
                    createTime: _data.createTime,
                    status: _data.status,
                    timePeriod: _data.timePeriod,
                    taskName: _data.taskName,
                    timeType: _data.timeType,
                    operationCount: _data.operationCount
                };
                this.sendRequest('/api/delete_Task',obj);
            }
        },
        mounted() {

        }
    };
</script>

<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import './../../../scene-demo/tables/components/table.less';
  *{
      font-family: "微软雅黑";
      color:#fff
  }
    .formManage {
        width: 100%;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
    }

    input {
        width: 118px;
        height: 26px;
        line-height: 26px;
        border-radius: 5px;
        color: #888;
        border: 1px solid #888;
        background-color: transparent;
    }
    .createBtn {
        width: 100px;
        height: 28px;
        line-height: 28px;
        border: none;
        border-radius: 5px;
        margin-bottom: 10px;
        background-image: linear-gradient(to right, #8a00ff, #4189f6);
    }

</style>
