<template>
    <div class="reportTaskContent">
        <Row :gutter="5" type="flex" justify="start" align="middle" style="margin-bottom: 10px">
            <Col :sm="8" :md="4" :lg="2" >
                <Modal v-model="modalFlag"
                       :title="$t('添加任务')"
                       @on-ok="ok"
                       @on-cancel="cancel">

                    <Form ref="formItem" :model="formItem" :rules="rule"  label-position="left" :label-width="100">
                        <FormItem prop="taskName" :label="$t('任务名称：')" >
                            <Input  v-model="formItem.taskName" :placeholder="$t('请输入任务名称')"></Input>
                        </FormItem>
                        <FormItem :label="$t('模板名称：')" >
                            <Select v-model="formItem.modelName" :placeholder="$t('请选择模板')" >
                               <Option v-for="item in modelNameArray" :value="item">{{item}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('任务类型：')">
                            <RadioGroup v-model="formItem.taskType">
                                <Radio label="实时任务">{{ $t('实时任务') }}</Radio>
                                <Radio label="定时任务">{{ $t('定时任务') }}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem :label="$t('频率：')" v-show="formItem.taskType==='定时任务'" >
                            <Select v-model="formItem.period" style="width: 100px;">
                                <Option value="每天">每天</Option>
                                <Option value="每周">每周</Option>
                                <Option value="每月">每月</Option>
                            </Select>
                            <TimePicker v-show="formItem.period==='每天'"
                                        format="HH:mm" style="width: 100px"
                                        @on-change="getDayTime"></TimePicker>

                            <Select v-show="formItem.period==='每周'"
                                    style="width: 100px;" placeholder="星期"
                                    v-model="weekDay">
                                <Option v-for="item in weekday" :value="item">{{item}}</Option>
                            </Select>

                            <Select  v-show="formItem.period==='每月'"
                                    style="width: 100px;" placeholder="日期"
                                     v-model="monthDay">
                                <Option v-for="item in 31" :value="item">{{item}}</Option>
                            </Select>
                            <TimePicker v-show="formItem.period==='每月'"
                                        format="HH:mm" style="width: 100px"
                                        placeholder="时间"
                                        @on-change="getMonthTime"
                            ></TimePicker>

                        </FormItem>
                        <FormItem :label="$t('开始时间：')">
                            <TimePicker format="HH:mm"
                                        placeholder="选择时间" style="width: 112px"
                                        @on-change="getStartTime"></TimePicker>
                        </FormItem>
                        <Form-item label="告警：">
                            <i-switch v-model="formItem.alarm"  size="small">
                            </i-switch>
                        </Form-item>
                        <FormItem :label="$t('查询时间范围：')" >
                            <Select v-model="formItem.queryCoverage" :placeholder="$t('全部')" >
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('报表格式：')">
                            <RadioGroup v-model="formItem.reportStyle">
                                <Radio label="PDF">{{ $t('PDF') }}</Radio>
                                <Radio label="CVS">{{ $t('CVS') }}</Radio>
                                <Radio label="HTML">{{ $t('HTML') }}</Radio>
                            </RadioGroup>
                        </FormItem>

                    </Form>

                </Modal>
            </Col>
        </Row>

        <tp-table ref="refReportTask" :all_params="tableParams" @add-btn="add"></tp-table>

    </div>
</template>

<script>

    import TpTable from "./../../../../components/locale-components/tp-table/tp-table"

    export default {
        name: "report-task",
        components: {TpTable},
        data () {
            return {
                modalFlag: false,
                dayTime:'',
                weekDay:'',
                monthDay:'',
                monthTime:'',
                startTime:'',
                reportModelData: {
                    taskName:'',
                    taskType: '',
                    startTime:'',
                    period: '',
                    reportType:'',
                    status:'',
                    alarm: '',
                    taskCreateTime: '',
                    userMsg: {
                        createTime: 1535975440135,
                        name:"admin",
                        password:"d22e7dbd89ab7cffdeca4723b369be9a",
                        roleType:"系统管理员",
                        salt:"qWaiEs4XtckSuiWO",
                        username:"69d9a2"
                    },
                    queryCoverage:'',
                    taskCount:'',
                    operation:'',
                },
                modelNameArray:[],
                curModalType : 'create',//当前模态框状态
                weekday:['周日','周一','周二','周三','周四','周五','周六'],
                tableParams:{
                    id: 'reportTak',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "report_info",
                        type: "reportTask"
                    },
                    add_btn:true,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '任务名称',
                            key: 'taskName',
                            render: (h, params) =>{
                                return h('div',params.row._source.taskName)
                            }
                        },
                        {
                            title: '模板名称',
                            key: 'modelName',
                            render: (h, params) =>{
                                return h('div',params.row._source.modelName)
                            }
                        },
                        {
                            title: '任务类型',
                            key: 'taskType',
                            render: (h, params) =>{
                                return h('div',params.row._source.taskType ==='realTime'? '实时任务' :'定时任务')
                            }
                        },
                        {
                            title: '开始执行时间',
                            key: 'startTime',
                            render: (h, params) =>{
                                return h('div',params.row._source.startTime)
                            }
                        },
                        {
                            title: '频率',
                            key: 'period',
                            render: (h, params) =>{
                                return h('div',params.row._source.period)
                            }
                        },
                        {
                            title: '报表类型',
                            key: 'reportType',
                            render: (h, params) =>{
                                return h('div',params.row._source.reportType)
                            }
                        },
                        {
                            title: '执行状态',
                            key: 'status',
                            render: (h,params) => {
                                if (params.row._source.taskType === 'realTime'){
                                    return h('div','已执行')
                                }else {
                                    switch (params.row._source.status) {
                                        case '0' :
                                            return h('div','未执行');
                                        case '1' :
                                            return h('div','等待中');
                                        case '2' :
                                            return h('div','执行中');
                                        case '3' :
                                            return h('div','已执行');
                                    }
                                }
                            }
                        },
                        {
                            title: '告警',
                            key: 'alarm',
                            render: (h,params) =>{
                                return h('div',params.row._source.alarm ==='alarm_yes'?'是':'否')
                            }
                        },
                        {
                            title: '创建时间',
                            key: 'taskCreateTime',
                            render: (h, params) =>{
                                return h('div',params.row._source.taskCreateTime)
                            }
                        },
                        {
                            title: '报告人',
                            key: 'user',
                            render: (h, params) =>{
                                return h('div',params.row._source.user)
                            }
                        },
                        {
                            title: '查询范围',
                            key: 'queryCoverage',
                            render: (h, params) =>{
                                return h('div',params.row._source.queryCoverage)
                            }
                        },
                        {
                            title: '任务执行次数',
                            key: 'taskCount',
                            render: (h, params) =>{
                                return h('div',params.row._source.taskCount)
                            }
                        },
                        {
                            title: '操作',
                            key: 'operation',
                            render: (h,params) => {
                                let operation;
                                if (params.row._source.taskType === 'realTime'){
                                    operation = '执行';
                                } else {
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

                                }
                                return h('div',[
                                    h('a',{
                                        on: {
                                            click: ()=>{
                                                this.editeModalDate(params)
                                            }
                                        }
                                    },'编辑'),
                                    h('a',{
                                        style: {
                                            margin:'3px',
                                        },
                                        on: {
                                            click: ()=> {
                                                this.deleteReportData(params)
                                            }
                                        }
                                    },'删除'),
                                    h('a',{
                                        style: {
                                            margin:'3px',
                                        },
                                        on: {//有问题   判断停止还是执行
                                            click: ()=> {
                                                this.operateData(params);
                                                //console.log(params)
                                            }
                                        }
                                    },operation)
                                ])
                            }
                        }
                    ]
                },
                formItem: {
                    taskName: '',
                    modelName: '',
                    taskType: '定时任务',
                    period: '每天',
                    alarm: true,
                    queryCoverage:'全部',
                    reportStyle: 'PDF'
                },
                rule: {
                    taskName: [
                        {required: true, message: '请输入任务名称', trigger: 'blur'}
                    ],
                    modelName: [
                        {required: true, message: '请输入模板名称', trigger: 'change'}
                       //{type: 'string', required: true, message: '请选择模板', trigger: 'change'}
                    ]
                }

            }
        },
        methods: {
            editeModalDate(params){
                this.curModalType = 'edit';
                this.formItem.taskName = params.row._source.taskName;
                this.formItem.taskType = params.row._source.taskType ==='realTime'?'实时任务':'定时任务';
                this.formItem.period = params.row._source.period==='day'?'每天':(params.row._source.period==='month'?'每月':'每周');
                this.formItem.alarm = params.row._source.alarm === 'alarm_yes'?'是':'否';
                this.formItem.queryCoverage = params.row._source.queryCoverage;
                this.formItem.reportStyle = params.row._source.reportType.toUpperCase();
                this.modalFlag = true;
            },
            deleteReportData(params){
                let _this=this;
                let taskName = params.row._source.taskName;
                this.$http.get('/api/reportTaskDeleteDate',
                    {
                        params:{
                            taskName: taskName,
                        }
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.refReportTask.changeParams();
                    }, 1000);
                })
            },
            add() {
                this.modalFlag = true;
                this.$refs.formItem.resetFields();
            },
            getDayTime(value){//每天的时间
                this.dayTime=value;
            },
            getMonthTime(value){  //每月 时间
                this.monthTime=value;
            },
            getStartTime(value){  //开始时间
                this.startTime=value;
            },
            //操作数据
            operateData(params){
                {
                    let _this=this;
                    let data=params.row._source;
                    let taskObj ={};
                    // 1.先得到当前模板的名字
                    let modelName = data.modelName;
                    let taskName=data.taskName;
                    let taskType=data.taskType;
                    let startTime=data.startTime;
                    let alarm=data.alarm;
                    let queryCoverage=data.queryCoverage;
                    let taskCount=data.taskCount;
                    let taskCreateTime=data.taskCreateTime;
                    let reportType=data.reportType;
                    let user=data.user;
                    let scheduleTime=data.scheduleTime;
                    let period=data.period;
                    let taskExecuteDayOfWeek=data.taskExecuteDayOfWeek;
                    let taskExecuteMonth=data.taskExecuteMonth;
                    let taskExecuteDay=data.taskExecuteDay;
                    let status=data.status;
                    // 2.获取model中的数据
                    let modelObj = {};
                    let useCount ;
                    this.$http.get('/api/modelNameSelectData', {
                            params:{
                                index: 'report_info',
                                type: 'reportModel',
                                size: 100
                            }
                        }
                    ).then(res => {
                        let obj = res.data.rows;
                        let info = [];
                        for (let key in obj) {
                            info.push(obj[key]._source)
                        }
                        for (let key1 in info) {
                            for (let key in info[key1]) {
                                //reportModelData [key] = info[key1][key];
                                if (key === 'modelName') {
                                    let reportModelDataKey = info[key1][key];
                                    if (reportModelDataKey === modelName) {
                                        useCount = parseInt(info[key1]['useCount']) + 1;
                                        modelObj = {
                                            modelName: modelName,
                                            reportTitle: info[key1]['reportTitle'],
                                            useCount: useCount,
                                            reportContentKeys: info[key1]['reportContentKeys'],
                                            reportContentValues: info[key1]['reportContentValues'],
                                            createTime: info[key1]['createTime']
                                        };
                                    }
                                }
                            }
                        }
                        taskObj = {
                            taskName: taskName,
                            modelName: modelName,
                            taskType: taskType,
                            startTime: startTime,
                            alarm: alarm,
                            modelObj: modelObj,
                            queryCoverage: queryCoverage,
                            taskCount: taskCount,
                            taskCreateTime: taskCreateTime,
                            reportType: reportType,
                            user: user,
                            scheduleTime: scheduleTime,
                            period: period,
                            taskExecuteDayOfWeek: taskExecuteDayOfWeek,
                            taskExecuteMonth: taskExecuteMonth,
                            taskExecuteDay: taskExecuteDay,
                            status: status
                        };
                        if (status === "0"){
                            status = "1";
                            taskObj.status = status;
                            taskObj.taskCount = parseInt(taskObj.taskCount)+1;
                            // 修改模板中的useCount
                            useCount = parseInt(modelObj.useCount)+1;
                            // 修改模板中的值
                            this.$http.get('/api/reportModelSaveDate', {
                                    params:modelObj
                                }
                            ).then(res => {
                                setTimeout(function () {
                                    _this.$refs.refReportTask.changeParams();
                                }, 1000)
                            });
                            // 修改任务中的值
                            this.$http.get('/api/reportTaskSaveDate', {
                                    params:taskObj
                                }
                            ).then(res => {
                                setTimeout(function () {
                                    _this.$refs.refReportTask.changeParams();
                                }, 1000)
                            });
                            // 执行任务
                            this.$http.get('/api/makeReport', {
                                    params:taskObj
                                }
                            ).then(res => {
                                setTimeout(function () {
                                    _this.$refs.refReportTask.changeParams();
                                }, 1000)
                            });
                        } else {
                            status = "0";
                            taskObj.status = status;
                            // 修改任务中的值
                            this.$http.get('/api/reportTaskSaveDate', {
                                    params:taskObj
                                }
                            ).then(res => {
                                setTimeout(function () {
                                    _this.$refs.refReportTask.changeParams();
                                }, 1000)
                            });
                            this.$http.get('/api/closeReportTask', {
                                    params:taskObj
                                }
                            ).then(res => {
                                setTimeout(function () {
                                    _this.$refs.refReportTask.changeParams();
                                }, 1000)
                            });
                        }
                        obj.modelObj = modelObj;
                    })
                }
            },
            //点击确定
            ok() {
                let _this=this;
                let modelObj = {};
                // 定义任务发送的数据
                let taskObj = {};
                // 获取任务名
                let taskName = this.formItem.taskName;
                // 获取模板名
                let modelName = this.formItem.modelName;
                // 获取开始时间
                let startTimes = this.startTime;
                // 获取查询范围
                let queryCoverage = this.formItem.queryCoverage;
                // 获取任务类型--实时/定时
                let taskType= this.formItem.taskType==='实时任务'?'realTime':'setTimeout';
                // 获取频率
                let period = this.formItem.period==='每天'?'day':(this.formItem.period==='每月'?'month':'week');
                // 获取告警开关
                let alarm = this.formItem.alarm?'alarm_yes':'alarm_no';
                // 获取报表类型
                let reportType = this.formItem.reportStyle.toLowerCase();
                // 在创建任务的时候,默认执行次数为0
                let taskCount = 1;
                // 修改模板的使用次数
                let useCount;
                // 生成创建任务的时间
                let taskCreateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                // 获取当前的user用户
                let user = this.reportModelData.userMsg.roleType;

                let dayOfWeek = {};
                // let hour = $("#hour option:selected").html();
                // let minute = $("#min option:selected").html();
                //每周的时候要用周几weekDay
                let weekDay=this.weekDay;
                // 每月的时候要用day
                let monthDay = this.monthDay;
                let date = new Date();
                let startTime;
                let scheduleTime=this.dayTime;
                let taskExecuteDayOfWeek;
                let taskExecuteMonth = date.getMonth();
                let taskExecuteDay;
                // scheduleTime = hour + ":" + minute;
                if (period === "day") {
                    startTime = "每天";
                    taskExecuteDayOfWeek = "-";
                    taskExecuteMonth = "-";
                    taskExecuteDay = "-";
                } else if (period === 'week') {
                    taskExecuteDayOfWeek = dayOfWeek.value;
                    taskExecuteMonth = "-";
                    taskExecuteDay = "-";
                } else {
                    startTime = "每月";
                    period = 'month';
                    taskExecuteDayOfWeek = "-";
                    taskExecuteDay = '1';
                }
                let status;
                if (taskType === 'realTime') {
                    status = '0';
                    this.$http.get('/api/modelNameSelectData', {
                            params: {
                                index: 'report_info',
                                type: 'reportModel',
                                size: 100
                            }
                        }
                    ).then(res => {
                        let obj=res.data.rows;
                        let info=[];
                        for (let key in obj) {
                            info.push(obj[key]._source)//info 存各个_source
                        }
                        for (let key1 in info) {
                            for (let key in info[key1]) {
                                //this.reportModelData [key] = info[key1][key];
                                if (key === 'modelName') {
                                    let reportModelDataKey = info[key1][key];
                                    if (reportModelDataKey === modelName) {
                                        useCount = parseInt(info[key1]['useCount']) + 1;
                                        modelObj = {
                                            modelName: modelName,
                                            reportTitle: info[key1]['reportTitle'],
                                            useCount: useCount,
                                            reportContentKeys: info[key1]['reportContentKeys'],
                                            reportContentValues: info[key1]['reportContentValues'],
                                            createTime: info[key1]['createTime']
                                        };
                                    }
                                }
                            }
                        }
                        //保存报表模板数据
                        this.$http.get('/api/reportModelSaveDate', {
                                params: modelObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });
                        taskObj = {
                            taskName: taskName,
                            modelName: modelName,
                            taskType: taskType,
                            startTime: startTimes,///
                            alarm: alarm,
                            modelObj: modelObj,
                            queryCoverage: queryCoverage,
                            taskCount: taskCount,
                            taskCreateTime: taskCreateTime,
                            reportType: reportType,
                            user: user,
                            scheduleTime: scheduleTime,
                            period: period,
                            taskExecuteDayOfWeek: taskExecuteDayOfWeek,
                            taskExecuteMonth: taskExecuteMonth,
                            taskExecuteDay: taskExecuteDay,
                            status: status
                        };
                        //保存报表任务数据
                        this.$http.get('/api/reportTaskSaveDate', {
                                params: taskObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });
                        //生成报表
                        this.$http.get('/api/makeReport', {
                                params: taskObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });
                    })
                } else {
                    status = '1';
                    this.$http.get('/api/modelNameSelectData', {
                            params: {
                                index: 'report_info',
                                type: 'reportModel',
                                size: 100
                            }
                        }
                    ).then(res => {
                        let obj=res.data.rows;
                        let info=[];
                        for (let key in obj) {
                            info.push(obj[key]._source)//info 存各个_source
                        }
                        for (let key1 in info) {
                            for (let key in info[key1]) {
                                //this.reportModelData [key] = info[key1][key];
                                if (key === 'modelName') {
                                    let reportModelDataKey = info[key1][key];
                                    if (reportModelDataKey === modelName) {
                                        useCount = parseInt(info[key1]['useCount']) + 1;
                                        modelObj = {
                                            modelName: modelName,
                                            reportTitle: info[key1]['reportTitle'],
                                            useCount: useCount,
                                            reportContentKeys: info[key1]['reportContentKeys'],
                                            reportContentValues: info[key1]['reportContentValues'],
                                            createTime: info[key1]['createTime']
                                        };
                                    }

                                }

                            }

                        }
                        // 修改模板中的useCount
                        this.$http.get('/api/reportModelSaveDate', {
                                params: modelObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });
                        taskObj = {
                            taskName: taskName,
                            modelName: modelName,
                            taskType: taskType,
                            startTime: startTimes,//
                            alarm: alarm,
                            modelObj: modelObj,
                            queryCoverage: queryCoverage,
                            taskCount: taskCount,
                            taskCreateTime: taskCreateTime,
                            reportType: reportType,
                            user: user,
                            scheduleTime: scheduleTime,
                            period: period,
                            taskExecuteDayOfWeek: taskExecuteDayOfWeek,
                            taskExecuteMonth: taskExecuteMonth,
                            taskExecuteDay: taskExecuteDay,
                            status: status
                        };

                        this.$http.get('/api/reportTaskSaveDate', {
                                params: taskObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });

                        this.$http.get('/api/makeReport', {
                                params: taskObj
                            }
                        ).then(res => {
                            setTimeout(function () {
                                _this.$refs.refReportTask.changeParams();
                            }, 1000);
                        });
                    })
                }
            },
            cancel () {
                this.$Message.info('您点击了取消！');
            }
        },
        created() {
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
            let _this = this;
            //获取模板名称数组
            this.$http.get('/api/modelNameSelectData',
                {
                    params: {
                        index: 'report_info',
                        type: 'reportModel',
                        size: 100
                    }
                }
            ).then(res => {
                let obj = res.data.rows;
                let info = [];              //存放各个_source
                for (let key2 in obj) {
                    info.push(obj[key2]._source)
                }
                for (let key1 in info) {
                    for (let key in info[key1]) {
                        //this.reportModelData [key] = info[key1][key];
                        if (key === 'modelName') {
                            this.modelNameArray.push(info[key1][key]);//存放所有modelName
                        }
                    }
                }
            });
            //获取当前用户信息
            let token = JSON.parse(window.localStorage.voucher).token;
            this.$http.get('/api/usermgr/user_info', {
                    params:{
                        token:token
                        // token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6IjY5ZDlhMiIsInBhc3N3b3JkIjoiZDIyZTdkYmQ4OWFiN2NmZmRlY2E0NzIzYjM2OWJlOWEiLCJyb2xlVHlwZSI6Iuezu-e7n-euoeeQhuWRmCIsImNyZWF0ZVRpbWUiOiIxMDA4Njk5NTc1NTAxIiwic2FsdCI6ImQ2YWMxNjQ3NzQxYjg1ZmQ2YzQ1MTcwODc5YTYzYTZiIiwiaWF0IjoxNTM2MDI0OTgzLCJleHAiOjE1MzYwMjg1ODN9.lcSgPmcS7oz6-Y580unTvB4QcV7gbf7DD-ummVnnkGQ'
                    }
                }
            ).then(res => {
                _this.userMsg=res.data
            })
        }
    };
</script>


<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import '../../../scene-demo/tables/components/table.less';

</style>
