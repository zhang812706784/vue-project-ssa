<template>

    <!--  @event-click="allParams.event.click || emptyEvent"
                @event-dblclick="allParams.event.dblclick || emptyEvent"
                @event-mousedown="allParams.event.mousedown || emptyEvent"
                @event-mouseup="allParams.event.mouseup || emptyEvent"
                @event-mouseover="allParams.event.mouseover || emptyEvent"
                @event-mouseout="allParams.event.mouseout || emptyEvent"
                @event-globalout="allParams.event.globalout || emptyEvent" -->

    <Row class="template-container" v-if="this.status">
        <tp-echarts-plugin
                ref="plugin"
                :id="allParams.id"
                :title="allParams.title"
                :reload="allParams.reload"
                :type="allParams.type"
                :ajax="ajax"
                :config="allParams.config"
                @event-click="click"
                @event-dblclick="dblclick"
                @event-mousedown="mousedown"
                @event-mouseup="mouseup"
                @event-mouseover="mouseover"
                @event-mouseout="mouseout"
                @event-globalout="globalout"
        ></tp-echarts-plugin>
    </Row>

</template>

<script type="es6">

    /**
     * README
     *
     * @author duanyc
     *
     * 字段配置样例：
     *          allParams: {
                    id: 'chart1',
                    type: "bar",
                    title: "被攻击目的IPtop10",
                    url: '/api/cr_sec/virus/dstip',
                    ajaxType: 'get',
                    reload: 0,
                    data: {
                        test: '123'
                    },
                    event: {
                        click: (params) => {
                            console.log(params);
                        },
                        dblclick: (params) => {
                            console.log(params);
                        }
                    },
                    config: {
                        // VFWPic: '',  // 拓补图图片地址配置
                        // VNPic: '',   // 拓补图图片地址配置
                        // VMPic: ''    // 拓补图图片地址配置
                        // yNumType: 'bytes',  // 格式化y轴数据
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                lineStyle: {
                                    color: '#57617B'
                                }
                            }
                        },
                        grid: {
                            left: '4%'
                        }
                    }
                },
     * */

    /**
     * README
     *
     * @author duanyc
     *
     * allParams 字段参数：
     *
     * @param id:           echarts元素id
     * @param type:         echarts元素绘画类型
     * @param title:        echarts元素title
     * @param url:          ajax查询接口地址
     * @param ajaxType:     ajax查询类型
     * @param data:         ajax查询参数
     * @param reload:       多久后刷新
     * @param config:       echarts配置
     *
     * event :
     * @event click:        选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event dblclick:     选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mousedown:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseup:      选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseover:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseout:     选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event globalout:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     *
     * */

    import TpEchartsPlugin from "../../common-components/tp-echarts-plugin/tp-echarts-plugin";

    export default {
        name: "tp-ssa-echarts",
        components: {TpEchartsPlugin},
        data () {
            return {
                events: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'globalout'],
                status: false,
                ajax: {
                    url: this.allParams.url,
                    type: this.allParams.ajaxType,
                    data: this.allParams.data,
                    callback: this.allParams.callback || undefined
                }
            };
        },
        props: {
            allParams: Object
        },
        methods: {

            // 以下为事件注册
            click (dt) {
                this.registerEvent('click', dt);
            },
            dblclick (dt) {
                this.registerEvent('dblclick', dt);
            },
            mousedown (dt) {
                this.registerEvent('mousedown', dt);
            },
            mouseup (dt) {
                this.registerEvent('mouseup', dt);
            },
            mouseover (dt) {
                this.registerEvent('mouseover', dt);
            },
            mouseout (dt) {
                this.registerEvent('mouseout', dt);
            },
            globalout (dt) {
                this.registerEvent('globalout', dt);
            },

            // 空对象
            emptyEvent () {

            },

            // 注册事件
            registerEvent (event, dt) {

                if (!this.allParams.event) this.allParams.event = {};

                this.allParams.event[event] ? this.allParams.event[event].call(this, dt) : this.emptyEvent.call(this, dt);

            },

            // 修改参数
            changeParamsOnly (obj = {}) {
                for (let key in obj) {

                    if (this._.isArray(obj[key])) this.ajax.data[key] = obj[key];

                    if (this._.isObject(obj[key])) this.ajax.data[key] = obj[key];

                }

                this._.merge(this.allParams.data, obj);

                this.ajax.data = this.allParams.data;

                if (this.allParams.url !== '') this.status = true;
            },

            // 修改参数
            changeParams (obj = {}) {
                this.changeParamsOnly(obj);
                this.reload();
            },

            // 重新加载组件
            reload () {
                this.$refs.plugin.remount();
            }
        },
        created () {
            if (this.allParams.url !== '') this.status = true;
        }

    };
</script>
<style lang="less">

    .template-container {
        width: 100%;
        height: 100%;
    }

</style>
