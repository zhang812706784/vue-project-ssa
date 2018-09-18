<!--Created by zmj on 2018/8/15-->
<template>
    <Card style="height: 100% ;background: transparent;color: #fff" :bordered="false">
        <p style="color: #fff">{{allParams.title}}</p>
        <ul class="log-container">
            <li v-for="item of allParams.logList" v-html="item"></li>
        </ul>
    </Card>
</template>

<script type="es6">
    export default {
        name: "tp-ssa-log",

        props: {
            allParams: Object,
        },
        data () {
            return {};
        },
        methods: {},

        mounted () {
            this.$http.get(this.allParams.url,
                {
                    params: {
                        title: this.allParams.title,
                        offline_attr: '#' + this.allParams.id + '-' + this.allParams.offline_attr,
                        CombQuery: this.allParams.data.CombQuery,
                        page: this.allParams.data.page,
                        size: this.allParams.data.size
                    }
                }
            ).then(res => {
                var dictLogColor = {
                    "6": {name: "紧急", color: "#AE0101"},	//Emergencies	紧急
                    "5": {name: "告警", color: "#FF0000"},	//Alert	告警
                    "4": {name: "严重", color: "#FF3C00"},	//Critical	严重
                    "3": {name: "错误", color: "#FF8400"},	//Errors	错误
                    "2": {name: "警示", color: "#FFBA00"},	//Warnings	警示
                    "1": {name: "通知", color: "#01CF58"},	//Notifications	通知
                    "0": {name: "信息", color: "#32D36D"}   	//Infomation	信息
                };
                let result = res.data.rows;
                let length = 0;
                if (this.allParams.data.length) {
                    length = result.length > this.allParams.data.length ? this.allParams.data.length : result.length;
                }else {
                    length = result.length > 4 ? 4 : result.length;
                }


                let log;
                let msg;
                for (let i = 0; i < length; i++) {
                    result[i].severity = dictLogColor[result[i].severity];
                    msg= result[i].msg;

                    log =
                        `<div class="row">
                                <i style="color:${ result[i].severity.color};font-style: normal">
                                    [${ result[i].severity.name}]
                                </i>
                               <span style="display: inline-block;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-size: 12px;" title="${msg}">${msg}</span>
                        </div>`;
                    this.allParams.logList.push(log);
                }
            });
        }

    };

</script>

<style lang="less">
    .log-container {
        width: 100%;
        list-style: none;
        li {
            .row {
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;

                i {
                    float: left;
                    display: inline-block;
                    width: 40px;
                }

                span {
                    font-size: 13px;
                    float: left;
                    display: inline-block;
                    word-break: break-all;
                    width: calc(~'100% - 40px');
                }
            }
        }
    }
</style>

