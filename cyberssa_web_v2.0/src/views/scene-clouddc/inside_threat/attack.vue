
<style lang="less">

</style>

<template>

    <div>

        <tp-table :all_params="all_params" @add-btn="add"></tp-table>
        <Row :gutter="5" type="flex" justify="start" align="middle">
            <Col :md="4" :lg="2" style="margin-bottom: 20px">
                <Modal v-model="isShow"
                       title="新增"
                       @on-ok="submit"
                       @on-cancel="cancel">
                    <slot name="content">
                        <Form ref="formItem" :model="formItem" label-position="left" :label-width="100">
                            <FormItem :label="$t('IP组名称：')" prop="group_name">
                                <Input v-model="formItem.group_name" clearable placeholder="Enter something..."/>
                            </FormItem>
                            <FormItem :label="$t('IP属性：')" prop="ipProperty">
                                <Select v-model="formItem.ipProperty">
                                    <Option value="1">{{$t('服务器')}}</Option>
                                    <Option value="2">{{$t('终端')}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem :label="$t('责任人：')" prop="responser" >
                                <Input v-model="formItem.responser"  placeholder="Enter something..." clearable/>
                            </FormItem>
                            <FormItem :label="$t('邮箱：')" prop="email" >
                                <Input v-model="formItem.email" placeholder="Enter something..." clearable/>
                            </FormItem>
                        </Form>
                    </slot>
                </Modal>
            </Col>
        </Row>

    </div>

</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";

    export default {
        components: {TpTable},
        data:function(){
            return {
                isShow :false,
                formItem: {
                    group_name: '',
                    ipProperty: '',
                    responser: '',
                    email: '',
                    select: '',
                    ipScope: '',
                    remark: ''
                },
                all_params:{
                    checkBox: true,
                    url: '/api/ssa_table',
                    type:'get',
                    data:{
                        index: "original",
                        type: "ngfw",
                        CombQuerys: {"program": ["IPS","ATTACK"]}

                    },
                    add_btn:true,
                    // del_btn:true,
                    modify_btn:true,
                    cols: [
                        {
                            title: '攻击事件',
                            key: 'Content'
                        },
                        {
                            title: '源IP',
                            key: 'SrcIP'
                        },
                        {
                            title: '目的IP',
                            key: 'DstIP'
                        },
                        {
                            title: '应用协议',
                            key: 'Protocol'
                        },
                        {
                            title: '探针名称',
                            key: 'd_name'
                        },
                        {
                            title: '日志源',
                            key: 'host'
                        },
                        {
                            title: '攻击类型',
                            key: 'type'
                        },
                        {
                            title: '日志生成时间',
                            key: 'GenTime'
                        },
                        {
                            title: '事件ID',
                            key: 'EventID'
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
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.remove(params.index)
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            //列表方法
            add () {
                this.isShow =true;
            },
            batchDelete () {
                /*if (this.selectedItem) {
                    const userIds = new Array()
                    this.selectedItem.forEach((k, v) => {
                        userIds.push(k.userId)
                    })
                    this.$http.delete('/sysUser/deleteBatch', userIds).then(res => {
                        WT.toast.success("删除成功")
                        this.reloadDataGrid()
                    })
                }*/

            },
            submit () {
                alert("ok");


            },
            cancel () {
                this.$Modal.remove();
            }

        }
    }
</script>

