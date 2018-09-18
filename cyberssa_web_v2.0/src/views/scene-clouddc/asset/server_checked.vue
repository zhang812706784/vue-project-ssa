<template>
    <div>
        <tp-table :all_params="server_params" ></tp-table>
        <Modal v-model="ipmiCfgShow" width="580px"
               title="服务器监控配置"
               @on-ok="submitIpmi"
               @on-cancel="cancelIpmi">
            <slot name="content">
                <Form ref="ipmiItem" :model="ipmiItem" :rules="ipmi_ruleValidate" label-position="left" :label-width="100">
                    <FormItem :label="$t('IPMI用户名：')" prop="ipmiName">
                        <Input v-model="ipmiItem.ipmiName" clearable placeholder="Enter something...">
                        <Icon type="ios-person-outline" slot="prepend"></Icon></Input>
                    </FormItem>
                    <FormItem :label="$t('IPMI密码：')" prop="ipmiPassword">
                        <Input v-model="ipmiItem.ipmiPassword" type="password" clearable placeholder="Enter something...">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon></Input>
                    </FormItem>
                    <FormItem :label="$t('服务器类型：')" prop="ipmiType">
                        <Select v-model="ipmiItem.ipmiType">
                            <Option :value="1" :key="1">{{$t('DELL服务器')}}</Option>
                            <Option :value="2" :key="2">{{$t('LENOVO服务器')}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </slot>
        </Modal>
    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "server_check",
        components: {TpTable},
        data:function(){
            return {
                title:'',
                ipmiCfgShow :false,
                ipmiItem: {
                    serverIp:'',
                    serverName:'',
                    ipmiName: '',
                    ipmiPassword: '',
                    ipmiType: '',
                    uuid:''
                },
                server_params:{
                    id: 'server_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "asset",
                        type: "server"
                    },
                    add_btn:false,
                    del_btn:false,
                    cols: [
                        {
                            title: '终端IP',
                            key: 'serverIp',
                            render: (h, params) => {
                                return h('div', params.row._source.serverIp);
                            }
                        },
                        {
                            title: '终端名称',
                            key: 'hostName',
                            render: (h, params) => {
                                return h('div', params.row._source.hostName);
                            }
                        },
                        {
                            title: '状态',
                            key: 'isDisableIpmi',
                            render: (h, params) => {
                                return h('div', params.row._source.isDisableIpmi === 1 ? '在线' : '离线');
                            }
                        },
                        {
                            title: '服务器类型',
                            key: 'hostType',
                            render: (h, params) => {
                                if(params.row._source.hostType ==="dell"){
                                    return h('div', "DELL服务器");
                                }else if(params.row._source.hostType ==="lenovo"){
                                    return h('div', "LENOVO服务器");
                                }else{
                                    return h('div', "未获取型号")
                                }
                            }
                        },
                        {
                            title: '风扇1',
                            key: 'fan1',
                            render: (h, params) => {
                                if(params.row._source.fan1){
                                    return h('div', parseInt(params.row._source.fan1) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: '风扇2',
                            key: 'fan2',
                            render: (h, params) => {
                                if(params.row._source.fan2){
                                    return h('div', parseInt(params.row._source.fan2) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: '风扇3',
                            key: 'fan3',
                            render: (h, params) => {
                                if(params.row._source.fan3){
                                    return h('div', parseInt(params.row._source.fan3) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: '风扇4',
                            key: 'fan4',
                            render: (h, params) => {
                                if(params.row._source.fan4){
                                    return h('div', parseInt(params.row._source.fan4) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: '风扇5',
                            key: 'fan5',
                            render: (h, params) => {
                                if(params.row._source.fan5){
                                    return h('div', parseInt(params.row._source.fan5) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: '风扇6',
                            key: 'fan6',
                            render: (h, params) => {
                                if(params.row._source.fan6){
                                    return h('div', parseInt(params.row._source.fan6) + ' RPM');
                                }else{
                                    return h('div', 0 + ' RPM');
                                }
                            }
                        },
                        {
                            title: 'CPU温度',
                            key: 'cpuTemp1',
                            render: (h, params) => {
                                if(params.row._source.cpuTemp1){
                                    return h('div', parseInt(params.row._source.cpuTemp1) + ' ℃');
                                }else{
                                    return h('div', 0 + ' ℃');
                                }
                            }
                        },
                        {
                            title: 'CPU温度',
                            key: 'cpuTemp1',
                            render: (h, params) => {
                                if(params.row._source.cpuTemp1){
                                    return h('div', parseInt(params.row._source.cpuTemp1) + ' ℃');
                                }else{
                                    return h('div', 0 + ' ℃');
                                }
                            }
                        },
                        {
                            title: '系统功率',
                            key: 'sysPower',
                            render: (h, params) => {
                                if(params.row._source.sysPower){
                                    return h('div', parseInt(params.row._source.sysPower) + ' Walts');
                                }else{
                                    return h('div', 0 + ' Walts');
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
                                                this.show(params.index)
                                            }
                                        }
                                    }, '详情'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {

                                                this.ipmiItem= {
                                                    serverIp:params.row._source.serverIp,
                                                    serverName: params.row._source.serverName,
                                                    ipmiName: params.row._source.ipmiName,
                                                    ipmiPassword: params.row._source.ipmiPassword,
                                                    ipmiType: params.row._source.ipmiType,
                                                    uuid:params.row._source.uuid
                                                };
                                                this.$refs['ipmiItem'].resetFields();
                                                this.ipmiCfgShow =true;
                                            }
                                        }
                                    }, '监控')
                                ]);
                            }
                        }
                    ]
                },
                ipmi_ruleValidate: {
                    ipmiName: [
                        { required: true, message: 'IPMI用户名不能为空', trigger: 'blur' }
                    ],
                    ipmiPassword: [
                        { required: true, message: 'IPMI密码不能为空', trigger: 'blur' }
                    ],
                    ipmiType: [
                        { required: true, message: '服务器类型不能为空' }
                    ],
                }
            }
        },
        methods: {
            submitIpmi () {
                this.$refs.ipmiItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/ssa/java/asset/server/createServerImpi", this.ipmiItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.serverTab.changeParams();
                            }
                        });
                    }else{
                        console.log('没过');
                    }
                });
            },
            cancelIpmi () {
                this.$Modal.remove();
            }
        }
    };
</script>

<style scoped>

</style>




