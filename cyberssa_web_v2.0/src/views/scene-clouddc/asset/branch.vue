<template>
    <div>
        <!-- 分支表格-->
        <tp-table ref="branchTab" :all_params="branch_params" @add-btn="addBranch"  @del-btn="delBranch"></tp-table>
        <!-- 增加/编辑分支model-->
        <Modal v-model="branchModelShow" width="580px"
               :title="title"
               @on-ok="submitBranch"
               @on-cancel="cancelBranch">
            <slot name="content">
                <Form ref="branchItem" :model="branchItem" :rules="branch_ruleValidate" label-position="left" :label-width="100">
                    <FormItem :label="$t('分支名称：')" prop="branchName">
                        <Input v-model="branchItem.branchName" clearable placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('资产组：')" prop="groupNames" >
                        <Transfer
                                :data="branch_data"
                                :target-keys="targetKeys_branch"
                                :list-style="listStyle"
                                :render-format="branchRender"
                                :operations="['向左移','向右移']"
                                filterable
                                @on-change="branchHandleChange">
                        </Transfer>
                    </FormItem>
                    <FormItem :label="$t('地理位置：')" prop="site" >
                        <Input v-model="branchItem.site"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('责任人：')" prop="responser" >
                        <Input v-model="branchItem.responser"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('联系方式：')" prop="phone" >
                        <Input v-model="branchItem.phone"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('备注：')" prop="remark" >
                        <Input v-model="branchItem.remark" :autosize="true" type="textarea" placeholder="Enter something..."/>
                    </FormItem>
                </Form>
            </slot>
        </Modal>
    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "branch",
        components: {TpTable},
        data:function(){
            return {

                title:'',
                branchModelShow :false,
                branchItem: {
                    id:'',
                    branchName: '',
                    groupNames: '',
                    site: '',
                    responser: '',
                    phone: '',
                    remark: '',
                    uuid:''
                },
                branch_params:{
                    id: 'branch_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/ssa/java/asset/branch/branchList',
                    type:'table',
                    ajaxType:'get',
                    data:{},
                    add_btn:true,
                    del_btn:true,
                    cols: [
                        {
                            title: '分支',
                            key: 'branchName'
                        },
                        {
                            title: '资产组',
                            key: 'groupNames'
                        },
                        {
                            title: 'IP地址范围',
                            key: 'ipScope'
                        },
                        {
                            title: '地理位置',
                            key: 'site'
                        },
                        {
                            title: '责任人',
                            key: 'responser'
                        },
                        {
                            title: '联系方式',
                            key: 'phone'
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
                                                this.branchItem= {
                                                    id: params.row.id,
                                                    branchName: params.row.branchName,
                                                    groupNames: params.row.groupNames,
                                                    site: params.row.site,
                                                    responser: params.row.responser,
                                                    phone: params.row.phone,
                                                    remark:params.row.remark,
                                                    uuid:params.row.uuid
                                                };
                                                this.getBranchTargetKeys(params.row.uuid);
                                                this.title="修改";
                                                this.branchModelShow =true;
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        }
                    ]
                },
                branch_ruleValidate: {
                    branchName: [
                        { required: true, message: '分支名称不能为空', trigger: 'blur' }
                    ]
                },
                branch_data: this.getBranchData(),
                targetKeys_branch:this.getBranchTargetKeys(),
                listStyle: {
                    width: '170px',
                    height: '200px'
                }

            }
        },
        methods: {

            addBranch(){
                this.targetKeys_branch=[];
                this.title="新增"
                //重置
                this.$refs['branchItem'].resetFields();
                this.branchModelShow =true;
            },
            delBranch(currentRows){
                let del_branch = [];
                for(let i=0; i<currentRows.length ;i++){
                    del_branch.push(currentRows[i].uuid);
                }
                if(del_branch.length >0){
                    let params={
                        data: del_branch.join(",")
                    };
                    this.loading =true;
                    this.$http.post("/ssa/java/asset/branch/deleteBranch",params).then(res => {
                        if(res.code==0){
                            this.loading = false;
                            //刷新
                            this.$refs.branchTab.changeParams();
                        }
                    });
                }
            },
            getBranchData () {
                let mockData1 = [];
                this.$http.post("/ssa/java/asset/group/allGroupNames").then(res => {
                    if(res.code==0){
                        let result = res.data.rows;
                        if(result.length > 0){
                            for (let i = 0; i < result.length; i++) {
                                mockData1.push({
                                    key: result[i].uuid.toString(),
                                    label: result[i].groupName.toString(),
                                    description: 'The desc of content  ' + i
                                });
                            }
                        }else{
                            mockData1.push({
                                key: 1,
                                label: "暂时没有资产组，请添加",
                                description: '请先添加资产组再选择  '
                            });
                        }
                    }
                });
                return mockData1;
            },
            getBranchTargetKeys (_this) {
                this.targetKeys_branch=[];
                let branchUuid ={
                    branchUuid:_this
                };
                let targetData1 =[];
                this.$http.post("/ssa/java/asset/branch/selectedGroupsNames",branchUuid).then(res => {
                    if(res.code === 0){
                        let result = res.data.rows;
                        if(result.length > 0) {
                            for (let i = 0; i < result.length; i++) {
                                targetData1.push(result[i].uuid.toString());
                            }
                            this.targetKeys_branch = targetData1;
                        }
                    }
                });
                return targetData1;
            },
            branchHandleChange (newTargetKeys) {
                this.targetKeys_branch = newTargetKeys;
            },
            branchRender (item) {
                return item.label;
            },
            submitBranch () {
                if(this.targetKeys_branch){
                    let arr = [];
                    for(let i=0; i<this.targetKeys_branch.length;i++){
                        arr.push(this.targetKeys_branch[i]);
                    }
                    this.branchItem.groupNames=arr.join(",");
                }

                this.$refs.branchItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/ssa/java/asset/branch/createBranch", this.branchItem).then(res => {
                            if(res.code==0){
                                this.loading = false;
                                //刷新
                                this.$refs.branchTab.changeParams();
                            }
                        });
                    }else{
                        console.log('没过');
                    }
                })
            },
            cancelBranch () {
                this.$Modal.remove();
            }

        }
    };
</script>

<style scoped>

</style>



