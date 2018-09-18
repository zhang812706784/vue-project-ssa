<template>
    <Row>
        <Col span="6" style="height: 1000px">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="查询分支">
                    <Select v-model="formValidate.branchName">
                        <Option :value="item" v-for="item in branchArray">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="访问关系" prop="relations">
                    <RadioGroup v-model="formValidate.relations">
                        <Radio label="active_access">主动访问</Radio>
                        <br>
                        <Radio label="be_visited">被访问</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="访问类型" prop="accessType">
                    <RadioGroup v-model="formValidate.accessType">
                        <Radio label="allAccess">所有访问</Radio>
                        <br>
                        <Radio label="abnormalAccess">异常访问</Radio>
                        <br>
                        <Radio label="normalAccess">正常访问</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="显示条数" prop="size">
                    <Input v-model="formValidate.size" placeholder="输入显示条数"></Input>
                </FormItem>
                <FormItem label="源端口" prop="SrcPort">
                    <Input v-model="formValidate.SrcPort" placeholder="输入源端口"></Input>
                </FormItem>
                <FormItem label="目的端口" prop="DstPort">
                    <Input v-model="formValidate.DstPort" placeholder="输入目的端口"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate',formValidate)">查询</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Col>
        <Col span="18" style="height: 1000px" id="myChart">
        </Col>
    </Row>
</template>
<script>
    export default {
        name: 'ec_behavior',
        data() {
            return {
                dataList: new Set(),
                branchArray:["北京总部", "天津分支", "杭州分支", "上海分支"],
                dataArray: [],
                relartion: new Set(),
                CombQuery: {"threatType":["内部"]},
                CombQuerysNot: {},
                doubleFieldAggr:['SrcbranchName','DstbranchName',20],
                formValidate: {
                    branchName: '',
                    relations: 'active_access',
                    SrcPort: '',
                    accessType: 'allAccess',
                    DstPort: '',
                    size:20,
                },
                ruleValidate: {
                    branchName: [
                        {required: true, message: 'The IP cannot be empty', trigger: 'blur'}
                    ],
                    relations: [
                        {required: true, message: 'Please select relations', trigger: 'change'}
                    ],
                    // SrcPort: [
                    //     { required: true, message: 'The SrcPort cannot be empty', trigger: 'blur' }
                    // ],
                    // DstPort: [
                    //     { required: true, message: 'The DstPort cannot be empty', trigger: 'blur' }
                    // ],
                    accessType: [
                        {required: true, message: 'Please select accessType', trigger: 'change'}
                    ],
                },
                size:20
            }
        },
        created(){
            this.getData()
        },
        methods: {
            async getData(){
                this.res= (await this.ajaxsearch()).data.buckets;
                this.dataList.clear();
                this.relartion.clear();
                for (let i = 0; i < this.res.length; i++) {
                    this.dataList.add(
                        this.res[i].key.split("-split-")[0]
                    )
                    this.dataList.add(
                        this.res[i].key.split("-split-")[1]
                    )
                    this.relartion.add(
                        this.res[i].key.split("-split-")[0] + ":" + this.res[i].key.split("-split-")[1]
                    )
                }
                this.dataList.delete("null")
                this.dataArray=[...this.dataList];
                this.drawLine()
            },
            drawLine() {
                let pp = []
                this.dataArray.forEach(x => {
                    pp.push({
                        name: x
                    })
                })
                let rela = []
                this.relartion.forEach(x => {
                    rela.push({
                        source: x.split(":")[0],
                        target: x.split(":")[1]
                    })
                })
                this.drawechart(pp, rela)
            },
            drawechart(dataArray, link) {

                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                let option = {
                    title: {
                        text: '横向行为画像',
                        textStyle:{
                            fontSize:30,
                        }
                    },
                    legend: [{
                        //selectedMode: 'single',
                        data: dataArray,
                        show: false
                    }],
                    animationDurationUpdate: 2,
                    animationEasingUpdate: 'quinticInOut',

                    series: [{
                        type: 'graph',
                        top:'10%',
                        width: '70%',
                        height: '70%',
                        ribbonType: true,
                        layout: 'circular',
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [0, 10],
                        circular: {
                            rotateLabel: true
                        },

                        force: {
                            initLayout: 'circular',
                            repulsion: 50,
                            gravity: 0.5,
                            edgeLength: 500,
                            layoutAnimation: true,
                        },

                        roam: false,
                        focusNodeAdjacency: true,
                        hoverAnimation: true,
                        label: {
                            normal: {
                                position: 'center',
                                fontWeight: 'bold',
                                fontSize: 18,
                                formatter: '{b}',
                                normal: {
                                    textStyle: {

                                        fontFamily: '宋体'
                                    }
                                }
                            }
                        },
                        draggable: true,
                        itemStyle: {
                            normal: {
                                label: {
                                    rotate: true,
                                    show: true,
                                },

                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#e53935',
                                width: 2,
                                type: 'solid',
                                opacity: 0.2,
                                curveness: 0.3,
                            },
                        },
                        categories: dataArray,
                        data: dataArray,
                        links: link
                    }]
                };
                myChart.clear();
                myChart.setOption(option);
            },
            handleSubmit(name, params) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        console.log(params);
                        this.executequery(params)
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            executequery(params) {
                this.CombQuery = {};
                this.CombQuerysNot = {};
                switch (params.relations) {
                    case "active_access":
                        if(params.branchName !==""){
                            this.CombQuery.SrcbranchName = [params.branchName];
                            this.CombQuery.threatType = ['内部'];
                        }
                        switch (params.accessType) {
                            case "allAccess":
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                            case "normalAccess":
                                this.CombQuery.logtype = ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT'];
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                            case "abnormalAccess":
                                this.CombQuerysNot.logtype = ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT'];
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                        }
                        break;
                    case "be_visited":
                        this.CombQuery.DstbranchName = [params.branchName];
                        this.CombQuery.threatType = ['内部'];
                        switch (params.accessType) {
                            case "allAccess":
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                            case "normalAccess":
                                this.CombQuery.logtype = ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT'];
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                            case "abnormalAccess":
                                this.CombQuerysNot.logtype = ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT'];
                                if (params.SrcPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.SrcPort = Number(params.SrcPort);
                                }
                                if (params.DstPort.replace(/(^s*)|(s*$)/g, "").length !== 0) {
                                    this.CombQuery.DstPort = Number(params.DstPort);
                                }
                                this.doubleFieldAggr = ['SrcgroupName','DstgroupName',this.size]
                                this.size = params.size
                                this.getData()
                                break;
                        }
                        break;
                }
            },
            ajaxsearch() {
                return this.$http.get("/api/ssa_table", {
                    params: {
                        index: "ssa_envents*",
                        type: "nsec",
                        CombQuery: this.CombQuery,
                        CombQuerysNot: this.CombQuerysNot,
                        doubleFieldAggr:this.doubleFieldAggr
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
