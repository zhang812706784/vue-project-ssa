<template>
    <Row>
        <Row>
            <Button v-for="item in buttonList" v-on:click="fun(item)">{{programSet[item]}}</Button>
        </Row>
        <Row>
            <Row style="height: 300px">
                <tp-ssa-echarts ref="allparamsbar" :allParams="allparamsbar"></tp-ssa-echarts>
            </Row>
            <Row>
            <tp-table :all_params="allparams" ref="allparams"></tp-table>
            </Row>
        </Row>
    </Row>
</template>

<script>
    import TpTable from "../../../components/locale-components/tp-table/tp-table";
    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    export default {
        name: "log_audit",
        components: {TpSsaEcharts, TpTable},
        data(){
            return{
                program:'',
                programSet:{
                    FILTER:'阻断日志',
                    APP_POLICY:'应用安全',
                    ATTACK:'攻击日志',
                    WEB_ACCESS:'WEB访问',
                    IPS:'入侵防御',
                    AV:'病毒日志',
                    FILE_TRANSFER:'文件控制',
                    SCAN:'端口扫描',
                    DEFENSE:'DNS防护'
                },
                buttonList:[],
                allparamsbar: {
                    id: 'siteMax',
                    type: "line",
                    title: "站点数最多的IP",
                    url: '/api/getlines',
                    reload: 0,
                    data: {
                        index: 'ssa_envents*',
                        type: 'nsec',
                        aggField: 'program',
                    }
                }
            }
        },
        created(){
            this.addProgram()
            this.createTable()
        },
        methods:{
            createTable(){
                this.allparams={
                    id :"tableBox",
                    type : "table",
                    ajaxType : "get",
                    checkBox: true,
                    url: '/api/ssa_table',
                    data:{
                        index: "ssa_envents*",
                        type: "nsec",
                        queryObj:this.program
                    },
                    add_btn:false,
                    // del_btn:true,
                    modify_btn:false,
                    cols: [
                        {
                            title: '时间',
                            key: 'GenTime',
                            align: 'center',
                            width: 300,
                            render: (h, params) => {
                                return h( 'div',params.row._source.GenTime);
                            }
                        },
                        {
                            title: '日志类型',
                            key: 'program',
                            align: 'center',
                            width: 300,
                            search:'program',
                            render: (h, params) => {
                                return h( 'div',params.row._source.program);
                            }
                        },
                        {
                            title: '安全等级',
                            key: 'severity',
                            search:'severity',
                            align: 'center',
                            width: 300,
                            render: (h, params) => {
                                return h( 'div',params.row._source.severity);
                            }
                        },
                        {
                            title: '详细信息',
                            key: 'Protocol',
                            align: 'center',
                            width: 750,
                            ellipsis:true,
                            render: (h, params) => {
                                return h( 'div',JSON.stringify(params.row._source));
                                // return h( 'div',{
                                //     domProps: {
                                //         title: JSON.stringify(params.row._source)
                                //     }
                                // },JSON.stringify(params.row._source));
                            }
                        }
                    ]
                }
            },
            addProgram(){
                let programArray=[];
                this.$http.get("/api/getpie",{
                    params: {
                        index: 'ssa_envents*',
                        type: 'nsec',
                        aggField: 'program',
                        size: 20
                    }
                }).then(res => {
                    for(var i of res.data.rows){
                        programArray.push(i.key)
                    }
                    this.buttonList = programArray;
                });
            },
            fun(program){
                this.program = {'program':program};
                this.$refs.allparams.changeParams({
                    queryObj:this.program
                });
            }
        }
    };
</script>

<style scoped>

</style>
