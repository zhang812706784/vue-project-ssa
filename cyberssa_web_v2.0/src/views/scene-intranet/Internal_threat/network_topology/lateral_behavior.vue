<template>
    <Row>
        <Row>
            <Col span="6" style="height: 1000px">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="查询IP">
                        <Select v-model="formValidate.IP">
                            <Option :value="item" v-for="item in dataArray">{{item}}</Option>
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
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate',formValidate)">查询</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                    </FormItem>
                </Form>
            </Col>
            <Col span="18" style="height: 1000px">
                <tp-ssa-echarts ref="IPSAnalysisMapRef" :allParams="IPSAnalysisMap"></tp-ssa-echarts>
            </Col>
        </Row>
    </Row>
</template>

<script>
    import TpSsaEcharts from "../../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    export default {
        name: "lateral_behavio",
        components: {TpSsaEcharts},
        data() {
            return {
                dataList: new Set(),
                dataArray: [],
                abnormalogtype: ['LOG_IPS', 'LOG_APPSEC_FILECONTROL', 'LOG_FW_DEFEND', 'LOG_FW_FILTER', 'LOG_APPSEC_AV', 'LOG_APPSEC_URLFILTER', 'LOG_LOCALPORTSCAN', 'LOG_FW_BLACKLIST', 'LOG_FW_IPMAC', 'LOG_DAF'],
                normalogtype: ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT'],
                CombQuery: {},
                CombQuerysNot: {},
                formValidate: {
                    IP: '',
                    relations: 'active_access',
                    accessType: 'allAccess'
                },
                ruleValidate: {
                    IP: [
                        {required: true, message: 'The IP cannot be empty', trigger: 'blur'}
                    ],
                    relations: [
                        {required: true, message: 'Please select relations', trigger: 'change'}
                    ],
                    accessType: [
                        {required: true, message: 'Please select accessType', trigger: 'change'}
                    ],
                },
                IPSAnalysisMap: {}
            }
        },
        created() {
            this.getData()
            this.IPSAnalysisMap = {
                //  id: 'attackedDstIpHis',
                id: 'map',
                type: "map",
                title: "外联行为画像",
                url: '/api/getmap',
                reload: 0,
                data: {
                    // CombQuery: {program: ["IPS"]},
                    queryObj:{"threatType":"外部"},
                    maxLine: 50, /*线多了,显示就乱了,控制线的条数,默认只显示10条线*/
                    level1Aggs: "SrcIP", /*一级聚合字段*/
                    level2Aggs: "DstIP", /*一级聚合字段*/
                    level1_topN: 40, /*一级聚合topN*/
                    level2_topN: 40, /*二级聚合topN*/
                }
            }
        },
        methods: {
            handleSubmit(name, params) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.change(params)
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            change(params) {
                console.log(params);
                switch (params.accessType) {
                    case "allAccess":
                        switch (params.relations) {
                            case "active_access":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {}
                                    });
                                    this.CombQuery={}
                                    this.getData();
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {SrcIP: [params.IP]}
                                    });
                                    this.CombQuery={SrcIP: [params.IP]}
                                    this.getData()
                                }
                                break;
                            case "be_visited":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {}
                                    });
                                    this.CombQuery={}
                                    this.getData()
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {DstIP: [params.IP]}
                                    });
                                    this.CombQuery = {DstIP: [params.IP]}
                                    this.getData()
                                }
                                break;
                        }
                        break;
                    case "abnormalAccess":
                        this.CombQuerysNot = {logtype : ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']};
                        switch (params.relations) {
                            case "active_access":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {},
                                        CombQuerysNot:{logtype: ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                    this.CombQuery={}
                                    this.getData()
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {SrcIP: [params.IP]},
                                        CombQuerysNot:{logtype: ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                    this.CombQuery={SrcIP: [params.IP]}
                                    this.getData()
                                }
                                break;
                            case "be_visited":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {}
                                    });
                                    this.CombQuery={}
                                    this.getData()
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {DstIP: [params.IP]}
                                    });
                                    this.CombQuery = {DstIP: [params.IP]}
                                    this.getData()
                                }
                                break;
                        }
                        break;
                    case "normalAccess":
                        this.CombQuery={logtype: ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']};
                        switch (params.relations) {
                            case "active_access":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {logtype:['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                    this.getData()
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {SrcIP: [params.IP],logtype:['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                }
                                this.CombQuery={SrcIP: [params.IP],logtype: ['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']};
                                this.getData()
                                break;
                            case "be_visited":
                                if(params.IP === ""){
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {logtype:['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                    this.getData()
                                }else {
                                    this.$refs.IPSAnalysisMapRef.changeParams({
                                        CombQuery: {DstIP: [params.IP],logtype:['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    });
                                    this.CombQuery = {DstIP: [params.IP],logtype:['LOG_SESSION', 'LOG_FW_DNAT', 'LOG_FW_SNAT']}
                                    this.getData()
                                }
                                break;
                        }
                        break;
                }
            },
            ajaxSearch(){
                return this.$http.get("/api/ssa_table",{
                    params:{
                        index: "ssa_envents*",
                        type: "nsec",
                        CombQuery: this.CombQuery,
                        CombQuerysNot: this.CombQuerysNot,
                        doubleFieldAggr:['SrcIP','DstIP',20]
                    }
                })
            },
            async getData(){
                this.res= (await this.ajaxSearch()).data.buckets;
                this.dataList.clear();
                for (let i = 0; i < this.res.length; i++) {
                    this.dataList.add(
                        this.res[i].key.split("-split-")[0]
                    )
                    this.dataList.add(
                        this.res[i].key.split("-split-")[1]
                    )
                }
                this.dataArray=[...this.dataList];
            }
        }
    }
</script>

<style scoped>

</style>
