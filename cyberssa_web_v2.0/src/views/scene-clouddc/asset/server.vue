<template>
    <Tabs >
        <TabPane label="服务器显示" name="服务器显示">
            <!-- 服务器表格-->
            <tp-table ref="serverTab" :all_params="server_params" @add-btn="addServer"  @del-btn="delServer"></tp-table>
            <!-- 增加/编辑服务器model-->
            <Modal v-model="serverModelShow" width="580px"
                   :title="title"
                   @on-ok="submitServer"
                   @on-cancel="cancelServer">
                <slot name="content">
                    <Form ref="serverItem" :model="serverItem" :rules="server_ruleValidate" label-position="left" :label-width="100">
                        <FormItem :label="$t('服务器IP：')" prop="serverIp">
                            <Input v-model="serverItem.serverIp" clearable placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem :label="$t('服务器名称：')" prop="serverName">
                            <Input v-model="serverItem.serverName" clearable placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem :label="$t('管理员：')" prop="admin" >
                            <Input v-model="serverItem.admin"  placeholder="Enter something..." clearable/>
                        </FormItem>
                        <FormItem :label="$t('备注：')" prop="remark" >
                            <Input v-model="serverItem.remark" :autosize="true" type="textarea" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem :label="$t('配置业务：')" prop="configBusiness" >
                            <Transfer
                                    :data="server_data"
                                    :target-keys="targetKeys_server"
                                    :list-style="listStyle"
                                    :render-format="serverRender"
                                    :operations="['向左移','向右移']"
                                    filterable
                                    @on-change="serverHandleChange">
                            </Transfer>
                        </FormItem>
                    </Form>
                </slot>
            </Modal>
        </TabPane>
        <TabPane label="业务显示" name="业务显示">
            <!-- 业务表格-->
            <tp-table ref="businessTab" :all_params="business_params" @add-btn="addBusiness" @del-btn="delBusiness"></tp-table>
            <!-- 增加/编辑业务model-->
            <Modal v-model="businessModelShow" width="580px"
                   :title="title"
                   @on-ok="submitBusiness"
                   @on-cancel="cancelBusiness">
                <slot name="content">
                    <Form ref="businessItem" :model="businessItem" :rules="business_ruleValidate" label-position="left" :label-width="100">
                        <FormItem :label="$t('业务名称：')" prop="businessName">
                            <Input v-model="businessItem.businessName" clearable placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem :label="$t('重要级别：')" prop="level">
                            <Select v-model="businessItem.level">
                                <Option :value="1" :key="1">{{$t('普通')}}</Option>
                                <Option :value="2" :key="2">{{$t('核心')}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('责任人：')" prop="responser" >
                            <Input v-model="businessItem.responser"  placeholder="Enter something..." clearable/>
                        </FormItem>
                        <FormItem :label="$t('邮箱：')" prop="email" >
                            <Input v-model="businessItem.email" placeholder="Enter something..." clearable/>
                        </FormItem>
                        <FormItem :label="$t('备注：')" prop="remark" >
                            <Input v-model="businessItem.remark" :autosize="true" type="textarea" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem :label="$t('配置服务器：')" prop="configServer" >
                            <Transfer
                                    :data="business_data"
                                    :target-keys="targetKeys_business"
                                    :list-style="listStyle"
                                    :render-format="businessRender"
                                    :operations="['向左移','向右移']"
                                    filterable
                                    @on-change="businessHandleChange">
                            </Transfer>
                        </FormItem>
                    </Form>
                </slot>
            </Modal>
        </TabPane>
    </Tabs>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "server",
        components: {TpTable},
        data:function(){
            return {

                //==================服务器显示start==================
                title:'',
                serverModelShow :false,
                serverItem: {
                    id:'',
                    serverIp: '',
                    serverName: '',
                    admin: '',
                    type: '',
                    remark: '',
                    configBusiness:'',
                    createTime:'',
                    uuid:''
                },
                server_params:{
                    id: 'server_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/ssa/java/asset/server/serverList',
                    type:'table',
                    ajaxType:'get',
                    data:{},
                    add_btn:true,
                    del_btn:true,
                    cols: [
                        {
                            title: '服务器IP',
                            key: 'serverIp'
                        },
                        {
                            title: '主机名称',
                            key: 'serverName'
                        },
                        {
                            title: '管理员',
                            key: 'admin'
                        },
                        {
                            title: '所属组',
                            key: 'groupName',
                            render: (h, params) => {
                                return h('div', params.row.groupName == null ? '未分组' : params.row.groupName);
                            }
                        },
                        {
                            title: '所属分支',
                            key: 'branchName',
                            render: (h, params) => {
                                return h('div', params.row.branchName == null ? '未配置分支' : params.row.branchName);
                            }
                        },
                        {
                            title: '识别方式',
                            key: 'type',
                            render: (h, params) => {
                                return h('div', params.row.type === 1 ? '自动识别' : '手动识别');
                            }
                        },
                        {
                            title: '备注',
                            key: 'remark'
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
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.serverItem= {
                                                    id: params.row.id,
                                                    serverIp: params.row.serverIp,
                                                    serverName: params.row.serverName,
                                                    admin: params.row.admin,
                                                    type: params.row.type,
                                                    remark:params.row.remark,
                                                    createTime:params.row.createTime,
                                                    uuid:params.row.uuid
                                                };
                                                this.getServerTargetKeys(params.row.uuid);
                                                this.title="修改";
                                                this.serverModelShow =true;
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    ]
                },
                server_ruleValidate: {
                    serverIp: [
                        { required: true, message: '服务器IP不能为空', trigger: 'blur' }
                    ]
                },
                server_data: this.getServerData(),
                targetKeys_server:this.getServerTargetKeys(),

                //==================服务器显示end==================


                //==================业务显示start==================
                businessModelShow :false,
                businessItem: {
                    id:'',
                    businessName: '',
                    level: '',
                    responser: '',
                    email: '',
                    remark: '',
                    configServer:'',
                    uuid:''
                },
                business_params:{
                    id: 'business_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/ssa/java/asset/business/businessList',
                    type:'table',
                    ajaxType:'get',
                    data:{},
                    add_btn:true,
                    del_btn:true,
                    modify_btn:true,
                    cols: [
                        {
                            title: '业务名称',
                            key: 'businessName'
                        },
                        {
                            title: '重要级别',
                            key: 'level',
                            render: (h, params) => {
                                return h('div', params.row.level === 1 ? '普通' : '核心');
                            }
                        },
                        {
                            title: '责任人',
                            key: 'responser'
                        },
                        {
                            title: '邮箱',
                            key: 'email'
                        },
                        {
                            title: '备注',
                            key: 'remark'
                        },
                        {
                            title: '操作',
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
                                                this.show(params.index)
                                            }
                                        }
                                    }, '详情'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.businessItem= {
                                                    id: params.row.id,
                                                    businessName: params.row.businessName,
                                                    level: params.row.level,
                                                    responser: params.row.responser,
                                                    email: params.row.email,
                                                    remark:params.row.remark,
                                                    uuid:params.row.uuid
                                                };
                                                this.getBusinessTargetKeys(params.row.uuid);
                                                this.title="修改";
                                                this.businessModelShow =true;
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    ]
                },
                business_ruleValidate: {
                    businessName: [
                        { required: true, message: '业务名称不能为空', trigger: 'blur' }
                    ],level: [
                        { required: true, message: '请选择重要级别'}
                    ],
                },
                business_data: this.getBusinessData(),
                targetKeys_business:this.getBusinessTargetKeys(),
                listStyle: {
                    width: '170px',
                    height: '200px'
                }

                //==================业务显示end==================
            }
        },
        methods: {

            //==================服务器显示start==================

            addServer(){
                this.targetKeys_server=[];
                this.title="新增"
                //重置
                this.$refs['serverItem'].resetFields();
                this.serverModelShow =true;
            },
            delServer(currentRows){
                let del_server = [];
                for(let i=0; i<currentRows.length ;i++){
                    del_server.push(currentRows[i].uuid);
                }
                if(del_server.length >0){
                    let params={
                        data: del_server.join(",")
                    };
                    this.loading =true;
                    this.$http.post("/ssa/java/asset/server/deleteServer",params).then(res => {
                        if(res.code==0){
                            this.loading = false;
                            //刷新
                            this.$refs.serverTab.changeParams();
                        }
                    });
                }
            },
            getServerData () {
                let mockData1 = [];
                this.$http.post("/ssa/java/asset/business/businessNames").then(res => {
                    if(res.code==0){
                        let result = res.data.rows;
                        for (let i = 0; i < result.length; i++) {
                            mockData1.push({
                                key: result[i].uuid.toString(),
                                label: result[i].businessName.toString(),
                                description: 'The desc of content  ' + i
                            });
                        }
                    }
                });
                return mockData1;
            },
            getServerTargetKeys (_this) {
                this.targetKeys_server=[];
                let serverUuid ={
                    serverUuid:_this
                };
                let targetData1 =[];
                this.$http.post("/ssa/java/asset/server/selectedBusinessNames",serverUuid).then(res => {
                    if(res.code === 0){
                        let result = res.data.rows;
                        for (let i = 0; i < result.length; i++) {
                            targetData1.push( result[i].uuid.toString());
                        }
                        this.targetKeys_server = targetData1;
                    }
                });
                return targetData1;
            },
            serverHandleChange (newTargetKeys) {
                this.targetKeys_server = newTargetKeys;
            },
            serverRender (item) {
                return item.label;
            },
            submitServer () {
                if(this.targetKeys_server){
                    let arr = [];
                    for(let i=0; i<this.targetKeys_server.length;i++){
                        arr.push(this.targetKeys_server[i]);
                    }
                    this.serverItem.configBusiness=arr.join(",");
                }
                this.$refs.serverItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/ssa/java/asset/server/createServer", this.serverItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.serverTab.changeParams();
                            }
                        });
                    }else{
                        console.log('没过');
                    }
                })
            },
            cancelServer () {
                this.$Modal.remove();
            },

            //==================服务器显示end==================


            //==================业务显示start==================

            addBusiness(){
                this.targetKeys_business=[];
                this.title="新增"
                //重置
                this.$refs['businessItem'].resetFields();
                this.businessModelShow =true;
            },
            delBusiness(currentRows){
                let del_business = [];
                for(let i=0; i<currentRows.length ;i++){
                    del_business.push(currentRows[i].uuid);
                }
                if(del_business.length >0){
                    let params={
                        data: del_business.join(",")
                    };
                    this.loading =true;
                    this.$http.post("/ssa/java/asset/business/deleteBusiness",params).then(res => {
                        if(res.code==0){
                            this.loading = false;
                            //刷新
                            this.$refs.businessTab.changeParams();
                        }
                    });
                }
            },
            getBusinessData () {
                let mockData = [];
                //新增
                this.$http.post("/ssa/java/asset/server/serverIps").then(res => {
                    if(res.code==0){
                        let result = res.data.rows;
                        for (let i = 0; i < result.length; i++) {
                            mockData.push({
                                key: result[i].uuid.toString(),
                                label: result[i].serverIp.toString(),
                                description: 'The desc of content  ' + i
                            });
                        }
                    }
                });
                return mockData;
            },
            getBusinessTargetKeys (_this) {
                this.targetKeys_business=[];
                let businessUuid ={
                    businessUuid:_this
                };
                let targetData =[];
                this.$http.post("/ssa/java/asset/business/serverIpList",businessUuid).then(res => {
                    if(res.code === 0){
                        let result = res.data.rows;
                        for (let i = 0; i < result.length; i++) {
                            targetData.push( result[i].uuid.toString());
                        }
                        this.targetKeys_business = targetData;
                    }
                });
                return targetData;
            },
            businessHandleChange (newTargetKeys) {
                this.targetKeys_business = newTargetKeys;
            },
            businessRender (item) {
                return item.label;
            },
            submitBusiness () {
                if(this.targetKeys_business){
                    let arr = [];
                    for(let i=0; i<this.targetKeys_business.length;i++){
                        arr.push(this.targetKeys_business[i]);
                    }
                    this.businessItem.configServer=arr.join(",");
                }
                this.$refs.businessItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/ssa/java/asset/business/createBusiness", this.businessItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.businessTab.changeParams();
                            }
                        });
                    }else{
                        console.log('没过');
                    }
                })
            },
            cancelBusiness () {
                this.$Modal.remove();
            }

            //==================业务显示end==================
        }
    };
</script>

<style scoped>

</style>


