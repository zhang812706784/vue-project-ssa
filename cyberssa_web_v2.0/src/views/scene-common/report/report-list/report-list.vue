<template>
    <div class="reportListContent">
        <tp-table ref="refReportList" :all_params="tableParams" ></tp-table>
    </div>
</template>


<script>
    import TpTable from "./../../../../components/locale-components/tp-table/tp-table"
    export default {
        name: "report-list",
        components: {TpTable},
        data () {
            return {
                tableParams:{
                    id: 'reportList',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    columnSelect: true,
                    searchTime: false,
                    data:{
                        index: "report_info",
                        type: "reportList"
                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '报表名称',
                            render: (h, params) =>{
                                return h('div',params.row._source.reportName)
                            }
                        },
                        {
                            title: '报告人',
                            search: 'user',
                            render: (h, params) =>{
                                return h('div',params.row._source.user)
                            }
                        },
                        {
                            title: '报告类型',
                            search: 'type',
                            render: (h, params) =>{
                                return h('div',params.row._source.type)
                            }
                        },
                        {
                            title: '报告格式',
                            search: 'reportFormat',
                            render: (h, params) =>{
                                return h('div',params.row._source.reportFormat)
                            }
                        },
                        {
                            title: '报告生成时间',
                            render: (h, params) =>{
                                return h('div',params.row._source.createTime)
                            }
                        },
                        {
                            title: '模板名称',
                            search: 'modelName',
                            render: (h, params) =>{
                                return h('div',params.row._source.modelName)
                            }
                        },
                        {
                            title: '状态',
                            key: 'status',
                            render: (h,params) => {

                                let [color, text] = ['',''];

                                if(params.row._source.status === 1){
                                    color = '#32D36D';
                                    text = '成功';
                                }else{
                                    color = '#FFF000';
                                    text = '成功';
                                }

                                return  h('span',{
                                    style: {
                                        color:color
                                    }
                                },text)
                            }
                        },
                        {
                            title: '操作',
                            render: (h,params) => {
                                return h('div',[
                                    h('a',{
                                        on: {
                                            click: ()=> {
                                                this.deleteReport(params);
                                            }
                                        }
                                    },'删除'),
                                 h('a',{
                                     style: {
                                         margin:'15px',
                                     },
                                     on: {// public static final String PDF_PATH = "/usr/installed/cyberssa_backend/config/report_file/real-time_task";
                                         click: ()=> {
                                             this.downloadFile(params);
                                         }
                                     },
                                 },'下载')
                                ])
                            }
                        }
                    ]
                },
            }
        },
        methods: {
            //删除操作
            deleteReport(data){
                let reportName = data.row._source.reportName;
                let _this = this;
                // 1.删除本地路径下的文件
                this.$http.get('/api/reportListDeleteDataFromDir',
                    {
                        params: {
                            reportName: reportName,
                        }
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.refReportList.changeParams()
                    }, 1000);

                })
                // 2.删除ES中存储的信息
                this.$http.get('/api/reportListDeleteDateFromES',
                    {
                        params: {
                            reportName: reportName,
                        }
                    }
                ).then(res => {
                    setTimeout(function () {
                        _this.$refs.refReportList.changeParams()
                    }, 1000);

                })
            },
            //下载操作
            downloadFile(params){
                let fileName=params.row._source.reportName;
                window.location.href = "/ssa/java/downLoadFile/downLoadZipFile?&fileName="+fileName+"&filePath=/cyberssa_backend/config/report_file/real-time_task/";
            }
        },
        mounted(){

        }
    };
</script>

<style lang="less" scoped>
    @import '../../../../styles/common.less';
    @import './../../../scene-demo/tables/components/table.less';
    .ivu-tag-checked {
        display:none
    }
    .inputStyle {
        width: 100px;
    }
</style>
