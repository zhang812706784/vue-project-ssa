<template>
    <div class="alarmConfigContent">
        <Row :gutter="1" type="flex" justify="start" align="middle" style="margin-bottom: 10px">
            <Col :sm="8" :md="4" :lg="2" >
                <Modal v-model="modalFlag"
                       :title="$t('编辑配置')"
                       @on-ok="ok"
                       @on-cancel="cancel">

                    <Form ref="formItemRef" :model="formItem" :rules="rule"  label-position="left" :label-width="100">
                        <FormItem prop="configName" :label="$t('配置名称：')" >
                            <Input  v-model="formItem.configName"></Input>
                        </FormItem>
                        <FormItem :label="$t('配置级别：')" prop="alpo">
                            <CheckboxGroup v-model="formItem.alpo">
                                <Checkbox label="高危漏洞">{{ $t('高危漏洞') }}</Checkbox>
                                <Checkbox label="报表信息">{{ $t('报表信息') }}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem :label="$t('告警方式：')" prop="alarmType">
                            <CheckboxGroup v-model="formItem.alarmType">
                                <Checkbox label="邮件提醒">{{ $t('邮件提醒') }}</Checkbox>
                                <Checkbox label="站内信">{{ $t('站内信') }}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem v-show="formItem.alarmType.includes('邮件提醒',0)" prop="addressee" :label="$t('收件人信息：')">
                            <Input  v-model="formItem.addressee"></Input>
                        </FormItem>

                        <FormItem v-show="formItem.alarmType.includes('邮件提醒',0)" prop="cclist" :label="$t('抄送人信息：')">
                            <Input  v-model="formItem.cclist"></Input>
                        </FormItem>

                    </Form>

                </Modal>
            </Col>
        </Row>

        <tp-table ref="reftable" :all_params="tableParams" @add-btn="add"></tp-table>
    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "alarmConfig",
        components: {TpTable},
        data () {
            let  validateReceiver = function(rule, value, callback){
                if(!value){
                    return callback(new Error("请输入收件人信息"));
                }else if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)){
                    return callback(new Error("请输入正确的邮箱格式"))
                }else{
                    callback();
                }
            };
            let  validateCclist = function(rule, value, callback){
                if(!value){
                    return callback(new Error("请输入抄送人信息"));
                }else if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)){
                    return callback(new Error("请输入正确的邮箱格式"))
                }else{
                    callback();
                }
            };
            return {
                modalFlag:false,//模态框
                //table组件参数
                tableParams:{
                    id: 'safeAlarmConfig',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "config",
                        type: "info"
                    },
                    add_btn:true,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '配置名称',
                            render: (h,params) => {
                                return h('div',params.row._source.configName)
                            }
                        },
                        {
                            title: '配置级别',
                            render: (h,params) => {
                                return h('div',params.row._source.alpo)
                            }
                        },
                        {
                            title: '告警方式',
                            render: (h,params) => {
                                return h('div',params.row._source.alarmType)
                            }
                        },
                        {
                            title: '收件人信息',
                            render: (h,params) => {
                                return params.row._source.addressee === ""
                                    ? h('div','（无）'):h('div',params.row._source.addressee)

                            }
                        },
                        {
                            title: '抄送人信息',
                            render: (h,params) => {
                                return params.row._source.cclist === ""
                                    ? h('div','（无）'):h('div',params.row._source.cclist)

                            }
                        },
                        {
                            title: '操作',
                            render: (h,params) => {
                                return h('div',[
                                    h('a',{
                                        on: {
                                            click: ()=> {
                                                this.editeModalDate(params);
                                            }
                                        }
                                    },'编辑'),
                                    h('a',{
                                        style: {
                                            margin:'15px',
                                        },
                                        on: {
                                            click: ()=> {
                                                this.deleteListDate(params);
                                            }
                                        }
                                    },'删除')
                                ])
                            }
                        }
                    ]
                },
                formItem: {//form表单内容项
                    configName: '',
                    alpo: ['高危漏洞'],
                    alarmType: ['邮件提醒'],
                    addressee: '',
                    cclist: ''
                },
                rule: {
                    configName: [{required: true, message: '请输入配置名称', trigger: 'blur'}],
                    // alpo:[{required: true, message: '请选择配置级别', trigger: 'change'},],
                    // alarmType:[{required: true, message: '请选择告警方式', trigger: 'change'}],
                    addressee:[{validator: validateReceiver,trigger: 'blur'}],
                    cclist:[{validator: validateCclist,trigger: 'blur'}]
                }
            }
        },

        methods: {
            editeModalDate(params) {
                this.formItem.alpo=[];
                this.formItem.alarmType=[];
                let data=params.row._source;
                let alpo=data.alpo.toString().split(',');
                let alarmType=data.alarmType.toString().split(',');
                if(alpo.length===2){
                    this.formItem.alpo.push('高危漏洞');
                    this.formItem.alpo.push('报表信息');
                }else if(alpo.length===1){
                    if(alpo.includes('loophole',0)){
                        this.formItem.alpo.push('高危漏洞')
                    }else if(alpo.includes('report',0)){
                        this.formItem.alpo.push('报表信息')
                    }else{this.formItem.alpo=[]}
                }

                if(alarmType.length===2){
                    this.formItem.alarmType.push('邮件提醒');
                    this.formItem.alarmType.push('站内信');
                }else if(alarmType.length===1) {
                    if (alarmType.includes('mail', 0)) {
                        this.formItem.alarmType.push('邮件提醒')
                    } else if (alarmType.includes('popup', 0)) {
                        this.formItem.alarmType.push('站内信')
                    }else{this.formItem.alarmType=[]}
                }

                this.formItem.configName=data.configName;
                this.formItem.addressee=data.addressee;
                this.formItem.cclist=data.cclist;
                this.modalFlag=true;
            },
            deleteListDate(params1) {
                let _this = this;
                this.$http.get('/api/deletealarm2ES',
                    {
                        params: {
                            index: 'config',
                            type:'info',
                            id:params1.row._id
                        }
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.reftable.changeParams()
                    }, 1000);

                })
            },
            objParams() {
                let alpo=this.formItem.alpo;
                let alarmType=this.formItem.alarmType;
                let alpo1='';
                let alarmType1='';
                if(alpo.length===2){
                    alpo1='loophole,report';
                }else if(alpo.length===1){
                    if(alpo.includes('高危漏洞',0)){
                        alpo1='loophole'
                    }else if(alpo.includes('报表信息',0)){
                        alpo1='report'
                    }
                }else{alpo1=''}

                if(alarmType.length===2){
                    alarmType1='mail,popup';
                }else if(alarmType.length===1) {
                    if (alarmType.includes('邮件提醒', 0)) {
                        alarmType1='mail'
                    } else if (alarmType.includes('站内信', 0)) {
                        alarmType1='popup'
                    }
                }else{alarmType1=[]}

                let obj = {
                    configName: this.formItem.configName,
                    alpo: alpo1,
                    alarmType: alarmType1,
                    addressee: this.formItem.addressee,
                    cclist: this.formItem.cclist
                };
                return obj;
            },
            add(){
                this.modalFlag=true;
                this.$refs.formItemRef.resetFields();
            },

            ok() {
                // this.$Message.info('你点击了确定！');
                let _this =  this;
                this.$http.get('/api/savealarm2ES',
                    {
                        params:this.objParams()
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.reftable.changeParams();
                    }, 1000);


                })
            },
            cancel() {
                this.$Message.info('您点击了取消！');
            }
        }
    };
</script>


<style lang="less" scoped>
    @import '../../../styles/common.less';
    @import './../../scene-demo/tables/components/table.less';
</style>
