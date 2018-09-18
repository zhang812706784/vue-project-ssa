<template>
    <div class="reportModelContent">
        <Row :gutter="10" type="flex" justify="start" align="middle">
            <Col :md="4" :lg="2" style="margin-bottom: 20px">
                <!--<Button type="ghost" @click="add">{{ $t('新增模板') }}</Button>-->
                <Modal v-model="modalFlag"
                       :title="$t('添加模板')"
                       @on-ok="ok"
                       @on-cancel="cancel">
                    <Form ref="formItem" :model="formItem" :rules="rule" label-position="left" :label-width="100">
                        <FormItem prop="modelName" :label="$t('模板名称：')">
                            <Input v-model="formItem.modelName"></Input>
                        </FormItem>
                        <FormItem prop="reportTitle" :label="$t('报表标题：')">
                            <Input v-model="formItem.reportTitle"></Input>
                        </FormItem>
                        <FormItem :label="$t('报表内容项：')">
                            <Select v-model="formItem.reportContentKeys" style="width:200px">
                                <Option v-for="item in this.reportStr.reportContentKeys">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Form>

                </Modal>
            </Col>
        </Row>

        <tp-table ref="reftable" :all_params="tableParams"  @add-btn="add" ></tp-table>

    </div>
</template>

<script>

    import TpTable from "./../../../../components/locale-components/tp-table/tp-table"

    export default {
        name: "report-model",
        components: {TpTable},
        data() {
            return {
                modalFlag: false,
                reportStr: {
                    reportContentKeys:[
                        "IPS报表"
                    ],
                    // reportContentKeys: [
                    //     "漏洞严重性评分分布",
                    //     "漏洞类型最多网站",
                    //     "端口暴露最多的站点",
                    //     "漏洞最多的网站",
                    //     "域名最多的公司Top10",
                    //     "站点备案分布",
                    //     "高危漏洞最多的IP",
                    //     "按备案网站类型统计",
                    //     "高危漏洞最多的网站",
                    //     "端口暴露最多的IP",
                    //     "IP地域信息",
                    //     "漏洞类型分布",
                    //     "站点最多的IP",
                    //     "漏洞类型最多的IP",
                    //     "漏洞端口分布",
                    //     "站点数最多的IP",
                    //     "漏洞最多的IP",
                    //     "漏洞扫描方式分布",
                    //     "漏洞最多的地区"],
                    reportContentValues: ["IPS"]
                },
                formItem: {
                    modelName: '',
                    reportTitle: '',
                    reportContentKeys: ''
                },
                //table组件参数
                tableParams: {
                    id: 'reportModel',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type: 'table',
                    ajaxType: 'get',
                    data: {
                        index: "report_info",
                        type: "reportModel"
                    },
                    add_btn: true,
                    del_btn: false,
                    modify_btn: false,
                    cols: [
                        {
                            title: '模板名称',
                            search: 'modelName',
                            render: (h, params) => {
                                return h('div', params.row._source.modelName)
                            }
                        },
                        {
                            title: '报表标题',
                            render: (h, params) => {
                                return h('div', params.row._source.reportTitle)
                            }
                        },
                        {
                            title: '报表内容项',
                            render: (h, params) => {
                                if (params.row._source.reportContentKeys) {
                                    let str = "";
                                    for (let i = 0; i < params.row._source.reportContentKeys.length; i++) {
                                        str += params.row._source.reportContentKeys[i] + ",";
                                    }
                                    let str1 = str.substring(0, 30);
                                    return h('div', {
                                        domProps: {
                                            title: str
                                        }
                                    }, str1 + '...');
                                }
                                else {
                                    return h('div', '(无)')
                                }
                            }

                        },
                        {
                            title: '创建时间',
                            render: (h, params) => {
                                return h('div', params.row._source.createTime)
                            }
                        },
                        {
                            title: '执行次数',
                            render: (h, params) => {
                                return h('div', params.row._source.useCount)
                            }
                        },
                        {
                            title: '详情',
                            render: (h, params) => {
                                return h('a', {
                                    domProps: {
                                        href: './../report/report-list#/reportList/index',
                                        text: '详情'
                                    }
                                })
                            }
                        },
                        {
                            title: '操作',
                            render: (h, params) => {
                                return h('div', [
                                    h('a', {
                                        on: {
                                            click: () => {
                                                this.editeModalDate(params);
                                            }
                                        }
                                    }, '编辑'),
                                    h('a', {
                                        style: {
                                            margin: '15px',
                                        },
                                        on: {//有问题
                                            click: () => {
                                                this.deleteListDate(params);
                                            }
                                        }
                                    }, '删除')
                                ])
                            }
                        }
                    ]
                },
                rule: {
                    modelName: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'}
                    ],
                    reportTitle: [
                        {required: true, message: '请输入报表标题', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            editeModalDate(params) {
                this.formItem.modelName = params.row._source.modelName;
                this.formItem.reportTitle = params.row._source.reportTitle;
                this.reportStr.reportContentKeys = params.row._source.reportContentKeys;
                this.reportStr.reportContentValues = params.row._source.reportContentValues;
                this.modalFlag = true;
            },
            deleteListDate(params1) {
                let id = params1.row._id;
                let _this = this;
                this.$http.get('/api/reportModelDeleteDate',
                    {
                        params: {
                            _id: id,
                        }
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.reftable.changeParams()
                    }, 1000);

                })
            },

            objParams() {
                // =====================暂时全选报表内容项
                let obj = {
                    modelName: this.formItem.modelName,
                    reportTitle: this.formItem.reportTitle,
                    useCount: 0,
                    reportContentKeys: this.reportStr.reportContentKeys,
                    reportContentValues: this.reportStr.reportContentValues,
                    createTime: new Date().Format("yyyy-MM-dd hh:mm:ss")
                };
                return obj;
            },

            add() {
                this.modalFlag = true;
                this.$refs.formItem.resetFields();
            },

            ok() {
                // this.$Message.info('你点击了确定！');
                let _this = this;
                this.$http.get('/api/reportModelSaveDate',
                    {
                        params: this.objParams()
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
        }
    };
</script>

<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import './../../../scene-demo/tables/components/table.less';
</style>
