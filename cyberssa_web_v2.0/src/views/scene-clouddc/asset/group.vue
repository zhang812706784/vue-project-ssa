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
                    <FormItem :label="$t('IP组名称：')" prop="groupName">
                        <Input v-model="formItem.groupName" clearable placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('IP属性：')" prop="ipProperty">
                        <Select v-model="formItem.ipProperty">
                            <Option :value="1" :key="1">{{$t('服务器')}}</Option>
                            <Option :value="2" :key="2">{{$t('终端')}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('责任人：')" prop="responser" >
                        <Input v-model="formItem.responser"  placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('邮箱：')" prop="email" >
                        <Input v-model="formItem.email" placeholder="Enter something..." clearable/>
                    </FormItem>
                    <FormItem :label="$t('IP范围：')" prop="ipScope" >
                        <Input v-model="formItem.ipScope" :autosize="true" type="textarea" placeholder="Enter something..."/>
                    </FormItem>
                    <FormItem :label="$t('备注：')" prop="remark" >
                        <Input v-model="formItem.remark" :autosize="true" type="textarea" placeholder="Enter something..."/>
                    </FormItem>
                    <!--<Form ref="formDynamic" :model="formDynamic" label-position="left" :label-width="100">
                        <FormItem
                                v-for="(item, index) in formDynamic.items"
                                v-if="item.status"
                                :key="index"
                                :label="'IP段 ' + item.index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Row>
                                <Col span="20">
                                    <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
                                </Col>
                                <Col span="4" >
                                    <Button type="error" @click="handleRemove(index)">删除</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAdd" icon="plus-round">Add item</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>-->
                </Form>
            </slot>
        </Modal>

    </div>

</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";

    export default {
        components: {TpTable},
        data:function(){
            return {
                index:1,
                title:'',
                formDynamic: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                isShow :false,
                formItem: {
                    id:'',
                    groupName: '',
                    ipProperty: '',
                    responser: '',
                    email: '',
                    ipScope: '',
                    remark: ''
                },
                all_params:{
                    id: 'group_tab',
                    index: true,
                    loading:true,
                    checkBox: true,
                    url: '/ssa/java/asset/group/groupList',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "asset",
                        type: "group"
                    },
                    add_btn:true,
                    del_btn:true,
                    modify_btn:true,
                    cols: [
                        {
                            title: 'IP组名称',
                            key: 'groupName'
                        },
                        {
                            title: 'IP属性',
                            key: 'ipProperty',
                            render: (h, params) => {
                                return h('div', params.row.ipProperty === 1 ? '服务器' : '终端');
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
                        }
                    ]
                },
                ruleValidate: {
                    groupName: [
                        { required: true, message: 'IP组名称不能为空', trigger: 'blur' }
                    ],
                    ipProperty: [
                        { required: true, message: '请选择IP属性'}
                    ],
                    ipScope: [
                        { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                        { type: 'string', max: 500, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
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
                    data.push(currentRows[i].id);
                }
                if(data.length >0){
                    let params={
                        data: data.join(",")
                    };
                    this.loading =true;
                    this.$http.post("/ssa/java/asset/group/deleteGroup",params).then(res => {
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
                        this.$http.post("/ssa/java/asset/group/createGroup", this.formItem).then(res => {
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
