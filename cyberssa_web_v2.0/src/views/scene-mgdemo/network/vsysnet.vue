<template>

    <Row>
        <Row>
            <Col>
                <div class="title">
                    虚拟机网络拓扑
                </div>
            </Col>
        </Row>
        <Row>
            <!--虚拟网络右边布局-->
            <Col span="17" class="left">

                <div class="imgCon">
                    <!--<img src="../../../../static/images/mg-demo/fanghu.png">-->
                    <img v-bind:src=src>
                </div>

            </Col>

            <Col span="7" class="right">
                <!--虚拟网络配置-->
                <Form :label-width="80" inline>

                    <FormItem label="网络" style="width: 300px">
                        <Select v-model="networkSelectVal" style="width: 200px" @on-change="selectChange()">
                            <Option v-for="item in networkList" :value="item.value" :key="item.value">
                                {{item.label}}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="开/关机" class="switchCon">
                        <i-switch v-model="switchFlag" size="large" @on-change="siwtchNo" :disabled="switch_disable">
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </i-switch>
                    </FormItem>


                    <FormItem label="挂起" class="switchCon">
                        <i-switch v-model="suspendVM" :disabled="suspendDisable"
                                  size="large" @on-change="suspendVM_Task">
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </i-switch>
                    </FormItem>


                </Form>
            </Col>
        </Row>


    </Row>
</template>

<script type="es6">
    /*import TpTwoStageDrillingPluginFlow
        from "../../../components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-flow";
    import TpTable from "../../../components/locale-components/tp-table/tp-table";*/

    export default {
        name: "test-import-echarts",
        /*components: {TpTwoStageDrillingPluginFlow, TpTable},*/
        data() {
            return {
                //下拉列表
                networkList:[],
                networkSelectVal:0,
                //刚开始请求的时的初始数据
                originalData:[],
                //开关按钮状态 true -- on  false -- off
                switchFlag:false,
                //挂起按钮状态 true -- on  false -- off  暂时没用
                suspendVM:false,
                suspendDisable:false,
                switch_disable : false,
                src:'../../../../static/images/mg-demo/0.png'

            };
        },
        created() {



        },
        methods: {
            //重组下拉框的数据
            selectData(odata){

                let tempData = odata.data;
                this.originalData = tempData;
                for(let i=0;i<tempData.length;i++){
                    let obj = {
                        value: tempData[i].id,
                        label: tempData[i].name
                    }
                    this.networkList.push(obj);
                }
            },
            //第一个开关按钮到change事件
            siwtchNo(status){
                let url = `/apis/api/pot`;
                let me = this;
                console.log('开关');
                if(status){
                    //开启
                    url = `${url}/poweron/${this.networkSelectVal}`;
                    console.log('开');

                }else{
                    //关闭
                    console.log('关');
                    url = `${url}/poweroff/${this.networkSelectVal}`;
                    if(this.suspendVM){
                        this.$Notice.warning({
                            title: 'Notification title',
                            desc: '关闭失败，请先关闭挂起开关！'
                        });
                        me.switchFlag = true;
                        return;
                    }

                }
                this.$http.get(url)
                    .then(function (res) {
                    })
                    .then(function (response) {
                        console.log(response);
                    });


            },
            //挂起
            suspendVM_Task(status){
                let url = `/apis/api/pot`;
                let me = this;
                if(status){
                    //开启
                    url = `${url}/suspend/${this.networkSelectVal}`;
                    if(!this.switchFlag){
                        this.$Notice.warning({
                            title: '错误',
                            desc: '开启失败，请先开启网络虚拟机开关！'
                        });
                    }
                    this.$http.get(url)
                        .then(function (res) {
                            me.suspendVM = true;
                        })
                        .catch(function (response) {
                        });
                } else {
                    //关闭
                    url = `${url}/unsuspend/${this.networkSelectVal}`;

                    this.$http.get(url)
                        .then(function (res) {
                        })
                        .catch(function (response) {
                            console.log(response);
                        });
                }

            },
            //下拉框设置
            selectChange(){
                this.src=`../../../../static/images/mg-demo/${this.networkSelectVal}.png`;
            }
        },
        mounted() {
            let _this = this;
            debugger;
            if(_this.$store.state.app.priAccess <=1){
                _this.switch_disable = true;
                _this.suspendDisable = true;
            }

            _this.$http.get('/apis/api/pot/list')
                .then(function (res) {
                    //下拉框
                    console.log('下拉框')
                    console.log(res);
                    _this.selectData(res);

                })
                .catch(function (response) {

                });

        }

    };


</script>

<style lang="less">
    .ivu-form .ivu-form-item-label{
        color: #FFFFFF;
        margin-right: 10px;
    }

    .left,.right{
        padding-top: 10px;
    }
    .title{
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #666666;
    }
    img{
        width: 800px;
        height: 600px;
    }
    .imgCon{
        text-align: center;
    }

    .switchCon{
        width: 90%;
    }

</style>

