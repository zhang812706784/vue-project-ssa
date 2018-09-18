<style lang="less">

</style>

<template>

    <div>

        <tp-table ref="groupTable" :all_params="all_params" @add-btn="add" @del-btn="del"></tp-table>

        <Modal v-model="isShow"
               :title="title"
               @on-ok="submit"
               @on-cancel="cancel">
            <slot name="content">
                <Form ref="formItem" :model="formItem" :rules="ruleValidate" label-position="left" :label-width="100">
                    <FormItem :label="$t('用户名：')" prop="groupName">
                        <Input v-model="formItem.groupName" clearable placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('密码：')" prop="passw" >
                        <Input v-model="formItem.passw" :autosize="true" type="password" placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('权限：')" prop="ipProperty">
                        <Select v-model="formItem.ipProperty">
                            <!--<Option :value="2" :key="2">读写</Option>-->
                            <Option :value="1" :key="1">只读</Option>
                            <Option :value="0" :key="0">无</Option>
                        </Select>
                    </FormItem>
                    <!--<FormItem :label="$t('责任人：')" prop="responser" >
                        <Input v-model="formItem.responser"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('邮箱：')" prop="email" >
                        <Input v-model="formItem.email" placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('IP范围：')" prop="ipScope" >
                        <Input v-model="formItem.ipScope" :autosize="true" type="textarea" placeholder="Enter something..."/>
                    </FormItem>-->

                </Form>
            </slot>
        </Modal>

    </div>

</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";

    export default {
        components: {TpTable},
        data: function () {
            return {
                index: 1,
                title: '',
                formDynamic: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                isShow: false,
                formItem: {
                    id: '',
                    groupName: '',
                    passw: '',
                    ipProperty: '读写',
                    responser: '',
                    email: '',
                    ipScope: '',
                    remark: ''
                },
                all_params: {
                    id: 'group_tab',
                    index: true,
                    loading: true,
                    checkBox: true,
                    url: '/apis/api/user/list',
                    type: 'table',
                    ajaxType: 'get',
                    data: {
                        /* index: "asset",
                        type: "group" */
                    },
                    add_btn: true,
                    del_btn: true,
                    modify_btn: true,
                    cols: [
                        {
                            title: '姓名',
                            key: 'username'
                        },
                        {
                            title: '权限',
                            key: 'auth',
                            render: (h, params) => {
                                let auth = '';
                                switch (params.row.auth) {
                                    case 1:
                                        auth = '只读权限';
                                        break;
                                    case 2:
                                        auth = '读写权限';
                                        break;
                                    default:
                                        auth = '无权限';
                                        break;

                                }

                                return h('div', auth);
                            }
                        }/* {
                            title: '责任人',
                            key: 'responser'
                        },
                        {
                            title: '邮箱',
                            key: 'email'
                        },
                        {
                            title: 'IP范围',
                            key: 'ipScope'
                        },
                        {//lyn新增
                            title: '采集频率',
                            render: (h, params) => {
                                return h('div', '1分钟/次')
                            }
                        },
                        {
                            title: '备注',
                            key: 'remark'
                        }, */
                        /* {
                            title: '操作',
                            key: '操作',
                            width: 150,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.formItem= {
                                                    id: params.row.id,
                                                    groupName: params.row.groupName,
                                                    ipProperty: params.row.ipProperty,
                                                    responser: params.row.responser,
                                                    email: params.row.email,
                                                    ipScope: params.row.ipScope,
                                                    remark:params.row.remark
                                                }
                                                this.title="修改"
                                                this.isShow =true;
                                            }
                                        }
                                    }, '修改')
                                ]);
                            }
                        } */
                    ]
                },
                ruleValidate: {
                    groupName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    ipProperty: [
                        { required: true, message: '请选择权限配置' }
                    ],
                    passw: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                    /* ,
                    ipScope: [
                        { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                        { type: 'string', max: 500, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ] */
                }
            };
        },
        methods: {

            //列表方法
            add() {
                this.title="新增"
                //重置
                this.$refs['formItem'].resetFields();
                this.isShow =true;

            },
            del(currentRows) {
                let data = [];
                for(let i=0; i<currentRows.length ;i++){
                    data.push(currentRows[i].username);
                }
                if(data.length >0){
                    let params={
                        username: data.join(",")
                    };
                    this.loading =true;
                    this.$http.post("/apis/api/user/remove",params).then(res => {
                        if(res.code==0){
                            this.loading = false;
                            //刷新
                            this.$refs.groupTable.changeParams();
                        }
                    });
                }
            },
            submit () {
                this.$refs.formItem.validate((valid) =>{
                    if(valid){
                        this.loading =true;
                        this.$http.post("/apis/api/user/add", {
                            username:this.formItem.groupName,
                            password:this.formItem.passw,
                            auth:this.formItem.ipProperty

                        }).then(res => {
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
            cancel () {
                this.$Modal.remove();
            }
            /*handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove (index) {
                this.index--;
                this.formDynamic.items[index].status = 0;
            }
*/
        }
    }
</script>
