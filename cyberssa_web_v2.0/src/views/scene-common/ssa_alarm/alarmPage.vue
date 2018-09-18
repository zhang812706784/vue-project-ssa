<template>
    <div class="alarmPageContent">
        <tp-table ref="reftable" :all_params="tableParams"></tp-table>
    </div>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "alarmPage",
        components: {TpTable},
        data () {
            return {
                tableParams:{
                    id: 'alarmPage',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "config",
                        type: "alarm"
                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '告警时间',
                            key: 'time',
                            search:'time',
                            render: (h,params) => {
                                return h('div',params.row._source.time)
                            }
                        },
                        {
                            title: '告警人',
                            key: 'address',
                            render: (h,params) => {
                                return h('div',params.row._source.address)
                            }
                        },
                        {
                            title: '告警模块',
                            key: 'alpo',
                            search:'alpo',
                            render: (h,params) => {
                                return h('div',params.row._source.alpo)
                            }
                        },
                        {
                            title: '是否查看',
                            key: 'status',
                            search:'status',
                            render: (h, params) => {
                                let color = '';
                                if (params.row._source.status === "已查看") {
                                    color = '#7fffd4'
                                } else {
                                    color = '#90201F'
                                }
                                return h('span', {
                                    style: {
                                        color: color
                                    }
                                }, params.row._source.status)
                            }
                        },
                        {
                            title: '告警标题',
                            key: 'title',
                            render: (h,params) => {
                                return h('div',params.row._source.title)
                            }
                        },
                        {
                            title: '告警内容',
                            key: 'text',
                            render: (h,params) => {
                                return h('div',params.row._source.text)
                            }
                        },
                        {
                            title: '告警配置',
                            key: 'configName',
                            render: (h,params) => {
                                return h('div',params.row._source.configName)
                            }
                        },
                        {
                            title: '附件信息',
                            key: 'filepath',
                            render:(h,params) => {
                                let fileName = params.row._source.filepath.split("/");
                                return h('div',filename[filename.length - 1])
                            }
                        },
                        {
                            title: '操作',
                            key: 'operation',
                            render: (h,params) => { //暂时未实现逻辑功能
                                return h('div',[
                                    h('a',{
                                        on: {
                                            click: ()=> {
                                                console.log(params);
                                            }
                                        }
                                    },'详情'),
                                    h('a',{
                                        style: {
                                            margin:'15px',
                                        },
                                        on: {
                                            click: ()=> {
                                                this.deleteListDate(params)
                                            }
                                        }
                                    },'删除')
                                ])
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            toDetailDate(params) {
                let data=params.row;
                let _this = this;
                let obj={
                    'index':data._index,
                    'type':data._type,
                    'id':data._id,
                    'time': data._source.time,
                    'address':data._source.address,
                    'alpo':data._source.alpo,
                    'status':data._source.status,
                    'statusnumber':data._source.statusnumber,
                    'title':data._source.title,
                    'text':data._source.text,
                    'filepath':data._source.filepath,
                    'configName':data._source.configName,
                    'detail':data._source.detail
                };
                this.$http.get('/api/changestatus',
                    {
                        params:obj
                    }
                ).then(res=>{
                    setTimeout(function () {
                        _this.$refs.reftable.changeParams()
                    },1000);

                })
            },
            deleteListDate(params) {
                let _this = this;
                this.$http.get('/api/deletealarm2ES',
                    {
                        params: {
                            // index:  params.row._index,
                            // type: params.row._type,
                            index: 'config',
                            type:'info',
                            id: params.row._id
                        }
                    },false
                ).then(res=>{
                    setTimeout(function () {
                        _this.$refs.reftable.changeParams()
                    },1000);

                })
            },
        }
    };
</script>

<style lang="less" scoped>
    @import '../../../styles/common.less';
    @import './../../scene-demo/tables/components/table.less';
</style>
