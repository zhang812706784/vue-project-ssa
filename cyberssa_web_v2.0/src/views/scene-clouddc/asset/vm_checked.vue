<template>
    <div>
        <!-- 终端表格-->
        <tp-table ref="vmTab" :all_params="vm_params" ></tp-table>
        <Modal v-model="vmCheckModelShow" width="580px"
               :title="title"
               @on-ok="submitVmCheck"
               @on-cancel="cancelVmCheck">
            <slot name="content">
                <Form ref="vmCheckItem" :model="vmCheckItem" label-position="left" :label-width="100">
                    <FormItem :label="$t('安装类型：')" prop="vmIp">

                        <RadioGroup v-model="vmCheckItem.installType">
                            <Radio label="自动安装"></Radio>
                            <Radio label="手动安装"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="vmCheckItem.installType === '手动安装'" :label="$t('安装类型：')" prop="vmIp">
                        <a href="###" @click="detail">下载</a>
                    </FormItem>
                    <div v-if="vmCheckItem.installType === '自动安装'">
                        <FormItem :label="$t('用户名：')" prop="email" >
                            <Input v-model="vmCheckItem.username" placeholder="Enter something..." clearable/>
                        </FormItem>
                        <FormItem :label="$t('密码：')" prop="email" >
                            <Input v-model="vmCheckItem.password" placeholder="Enter something..." clearable/>
                        </FormItem>
                    </div>

                </Form>
            </slot>
        </Modal>
        <Modal v-model="logModelShow" width="780px"
               title="日志信息">
            <slot name="content">
                <tp-table ref="logTab" :all_params="log_params" ></tp-table>
            </slot>
        </Modal>

    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "vm_check",
        components: {TpTable},
        data:function(){
            return {
                title:'',
                vmCheckModelShow :false,
                logModelShow:false,
                vmCheckItem: {
                    id:'',
                    vmIp:'',
                    installType:'',
                    createTime: '',
                    username: '',
                    password: '',
                    uuid:''
                },
                vm_params:{
                    id: 'vm_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "asset",
                        type: "vm"
                    },
                    add_btn:false,
                    del_btn:false,
                    cols: [
                        {
                            title: '终端IP',
                            key: 'vmIp',
                            render: (h, params) => {
                                if(params.row._source.vmIp){
                                    return h('div', params.row._source.vmIp);
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '终端名称',
                            key: 'vmName',
                            render: (h, params) => {
                                if(params.row._source.vmName){
                                    return h('div', params.row._source.vmName);
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '状态',
                            key: 'isDisable',
                            render: (h, params) => {
                                return h('div', params.row._source.isDisable === 1 ? '在线' : '离线');
                            }
                        },
                        {
                            title: '工作时长',
                            key: 'sysUptime',
                            render: (h, params) => {
                                if(params.row._source.sysUptime){
                                    return h('div', parseInt(params.row._source.sysUptime / 3600)+'h');
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: 'CPU使用率',
                            key: 'cpuUtil',
                            render: (h, params) => {
                                if(params.row._source.cpuUtil){
                                    return h('div', (params.row._source.cpuUtil* 1).toFixed(2) + ' %');
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '剩余内存',
                            key: 'memFree',
                            render: (h, params) => {
                                if(params.row._source.memFree){
                                    return h('div', (params.row._source.memFree / 1024 / 1024).toString().split('.')[0] + ' MB');
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '剩余硬盘',
                            key: 'diskFree',
                            render: (h, params) => {
                                if(params.row._source.diskFree){
                                    return h('div', (params.row._source.diskFree / 1024 / 1024).toString().split('.')[0] + ' MB');
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '网速',
                            key: 'netIn',
                            render: (h, params) => {
                                if(params.row._source.netIn){
                                    return h('div', (params.row._source.netIn / 1024).toFixed(1) + ' kb/s');
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '操作系统',
                            key: 'sysInfo',
                            render: (h, params) => {
                                if(params.row._source.sysInfo){
                                    return h('div', params.row._source.sysInfo);
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: 'MAC地址',
                            key: 'macAddr',
                            render: (h, params) => {
                                if(params.row._source.macAddr){
                                    return h('div', params.row._source.macAddr.split(' ')[1] || '');
                                }else{
                                    return h('div', "--");
                                }

                            }
                        },
                        {
                            title: '操作',
                            key: '操作',
                            width: 200,
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
                                                this.loading = false;
                                                this.$refs.logTab.changeParams(
                                                    {
                                                        hostId: params.row._source.hostId
                                                    }
                                                );
                                                this.logModelShow= true;
                                            }
                                        }
                                    }, '日志'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$http.post("/api/ass_virtual/vm/check_install", {param: params.row._source.vmIp}).then(res => {
                                                    if(res.data.row==0){
                                                        this.loading = false;
                                                        this.title="安装EDR";
                                                        this.vmCheckItem= {
                                                            id:params.row._source.id,
                                                            vmIp:params.row._source.vmIp,
                                                            createTime: params.row._source.createTime,
                                                            uuid:params.row._source.uuid,
                                                            installType:"自动安装",
                                                        };
                                                        this.vmCheckModelShow =true;
                                                    }
                                                    else{
                                                        alert("已经安装");
                                                    }
                                                });

                                                /*if(params.row._source.installType){
                                                    this.vmCheckItem["installType"]=params.row._source.installType;
                                                }else{
                                                    this.vmCheckItem["installType"]="";
                                                }*/

                                            }
                                        }
                                    }, '安装'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.loading = true;
                                                this.$http.post("/ssa/java/asset/vm/createListenerVm", {vmIp: params.row._source.vmIp,vmName:params.row._source.vmName}).then(res => {
                                                    if(res.code==0){
                                                        this.loading = false;
                                                        //刷新
                                                        this.$refs.vmTab.changeParams();
                                                    }
                                                });
                                            }
                                        }
                                    }, '监控')

                                ]);
                            }
                        }
                    ]
                },
                log_params:{
                    id: 'log_tab',
                    index: true,
                    loading:true,
                    checkBox: false,
                    url: '/ssa/java/asset/vm/logList',
                    type:'table',
                    ajaxType:'get',
                    data:{},
                    add_btn:false,
                    del_btn:false,
                    cols: [
                        {
                            title: '发生时间',
                            key: 'clock',
                            width: 150,
                            render: (h, params) => {
                                if(params.row.clock){
                                    var timestamp4 = new Date(params.row.clock)
                                    let date = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8)
                                    return h('div', date);
                                }else{
                                    return h('div', "--");
                                }
                            }
                        },
                        {
                            title: '日志信息',
                            key: 'value',
                            render: (h, params) => {
                                if(params.row.value){
                                    return h('div', params.row.value);
                                }else{
                                    return h('div', "--");
                                }
                            }
                        }
                    ]
                }
                //==================终端显示end==================
            }
        },
        methods: {
            detail(){
                window.location.href = "/ssa/java/downLoadFile/downLoadZipFile?&fileName=edr_linux_1.0.0.zip&filePath=/cyberssa_backend/config/edr_install/";
            },
            submitVmCheck(){

                this.$refs.vmCheckItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/api/ass_virtual/vm/install_edr", this.vmCheckItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.groupTable.changeParams();
                            }
                        });

                    }else{
                        console.log('没过');
                    }
                })

            },
            cancelVmCheck(){

            }
        }
    };
</script>

<style scoped>

</style>




