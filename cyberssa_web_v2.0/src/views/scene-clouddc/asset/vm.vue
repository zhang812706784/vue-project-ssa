<template>
    <div>
        <!-- 终端表格-->
        <tp-table ref="vmTab" :all_params="vm_params" @add-btn="addVm"  @del-btn="delVm"></tp-table>
        <!-- 增加/编辑终端model-->
        <Modal v-model="vmModelShow" width="580px"
               :title="title"
               @on-ok="submitVm"
               @on-cancel="cancelVm">
            <slot name="content">
                <Form ref="vmItem" :model="vmItem" :rules="vm_ruleValidate" label-position="left" :label-width="100">
                    <FormItem :label="$t('终端IP：')" prop="vmIp">
                        <Input v-model="vmItem.vmIp" clearable placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('终端名称：')" prop="vmName">
                        <Input v-model="vmItem.vmName" clearable placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('管理员：')" prop="admin" >
                        <Input v-model="vmItem.admin"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('备注：')" prop="remark" >
                        <Input v-model="vmItem.remark" :autosize="true" type="textarea" placeholder="Enter something..."/>
                    </FormItem>
                </Form>
            </slot>
        </Modal>
    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "vm",
        components: {TpTable},
        data:function(){
            return {

                //==================终端显示start==================
                title:'',

                vmModelShow :false,
                vmItem: {
                    id:'',
                    vmIp: '',
                    vmName: '',
                    admin: '',
                    type: '',
                    remark: '',
                    createTime: '',
                    uuid:''
                },
                vm_params:{
                    id: 'vm_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/ssa/java/asset/vm/vmList',
                    type:'table',
                    ajaxType:'get',
                    data:{},
                    add_btn:true,
                    del_btn:true,
                    cols: [
                        {
                            title: '终端IP',
                            key: 'vmIp'
                        },
                        {
                            title: '终端名称',
                            key: 'vmName'
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
                                                this.vmItem= {
                                                    id: params.row.id,
                                                    vmIp: params.row.vmIp,
                                                    vmName: params.row.vmName,
                                                    admin: params.row.admin,
                                                    type: params.row.type,
                                                    remark:params.row.remark,
                                                    createTime:params.row.createTime,
                                                    uuid:params.row.uuid
                                                };
                                                this.title="修改";
                                                this.vmModelShow =true;
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    ]
                },
                vm_ruleValidate: {
                    vmIp: [
                        { required: true, message: '终端IP不能为空', trigger: 'blur' }
                    ]
                },
                //==================终端显示end==================


            }
        },
        methods: {

            //==================终端显示start==================

            addVm(){
                this.title="新增"
                //重置
                this.$refs['vmItem'].resetFields();
                this.vmModelShow =true;
            },
            delVm(currentRows){
                let del_vm = [];
                for(let i=0; i<currentRows.length ;i++){
                    del_vm.push(currentRows[i].uuid);
                }
                if(del_vm.length >0){
                    let params={
                        data: del_vm.join(",")
                    };
                    this.loading =true;
                        this.$http.post("/ssa/java/asset/vm/deleteVm",params).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.vmTab.changeParams();
                            }
                        });
                }
            },
            submitVm () {
                this.$refs.vmItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/ssa/java/asset/vm/createVm", this.vmItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.vmTab.changeParams();
                            }
                        });
                    }else{
                        console.log('没过');
                    }
                })
            },
            cancelVm () {
                this.$Modal.remove();
            }

            //==================终端显示end==================

        }
    };
</script>

<style scoped>

</style>



