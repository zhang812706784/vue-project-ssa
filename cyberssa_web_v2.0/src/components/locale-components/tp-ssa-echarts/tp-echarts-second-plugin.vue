<template>
    <Row class="plugin">

        <Col span="24" v-if="status">

            <div class="echarts-container" :id="id">
                <div class="echarts-container-null" v-if="!hasData"></div>
            </div>

        </Col>

    </Row>

</template>

<script type="es6">

    /**
     * README
     *
     * @author duanyc
     *
     <!-- 调用形式 -->
     <tp-echarts-plugin
     id="chart1"
     type="bar"
     title="被攻击目的IPtop10"
     :ajax="bar"
     :config="testConfig"
     @event-click="testEvent"
     ></tp-echarts-plugin>
     * */

    /**
     * README
     *
     * @author duanyc
     *
     * echarts-plugin 说明
     *
     * @prop id:            必填 原生属性
     * @prop type:          必填 激活 echarts 类型
     * @prop ajax:          必填 设置当前 echarts 查询接口， 该字段内填写对象与jQuery.ajax填写字段相同
     * @prop title:         选填 快速为 echarts 添加 title ，可选择在 config 字段中设置
     * @prop config:        选填 设置当前 echarts 绘画参数，填写格式与正常配置 echarts 格式相同
     *
     * event :
     * @use   @event-click
     * @event click:        选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event dblclick:     选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mousedown:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseup:      选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseover:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event mouseout:     选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     * @event globalout:    选填 为当前 echarts 设置事件。callback: echarts 原生事件 params
     *
     * */

    import Option from '../../common-components/tp-echarts-plugin/option/option';
    import Util from '@/libs/util';
    import Tool from '../../common-components/tp-echarts-plugin/tool/index';

    export default {
        name: "tp-echarts-plugin",
        props: {
            id: String,
            type: String,
            title: String,
            reload: Number,
            config: Object,
            ajax: Object
        },
        data () {
            return {
                events: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'globalout'],
                status: true,
                hasData: true,
                reloadInterval: '',
                $chart: '',
                sessionData: '',
                option: {}
            };
        },
        watch: {
            status (dt) {

                if (dt) {
                    this.$nextTick(() => {
                        this.build();
                    });
                }

            },
            reload () {
                this.reloadTemplate();
            }
        },
        methods: {
            completeAssign (target, ...sources) {

                sources.forEach(source => {
                    let descriptors = Object.keys(source).reduce((descriptors, key) => {
                        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
                        return descriptors;
                    }, {});

                    Object.getOwnPropertySymbols(source).forEach(sym => {
                        let descriptor = Object.getOwnPropertyDescriptor(source, sym);
                        if (descriptor.enumerable) {
                            descriptors[sym] = descriptor;
                        }
                    });

                    Object.defineProperties(target, descriptors);
                });

                return target;
            },
            reloadTemplate () {

                const rl = () => {
                    this.status = false;

                    setTimeout(() => {
                        this.status = true;
                    }, 100);
                };

                clearInterval(this.reloadInterval);

                if (this.reload * 1 === 0) {

                    rl();

                } else {

                    this.reloadInterval = setInterval(() => {

                        rl();

                    }, this.reload * 1);

                }

            },
            registerEvent () {

                this.events.forEach(event => {

                    this.$chart.off(event);

                    this.$chart.on(event, params => this.$emit(`event-${event}`, params));

                });

            },
            switchData () {

                const handle = this.handle();

                this._.merge(this.option, handle[this.type]());

                // 测试代码
                if (this.type === 'map') {
                    // Util.stringify(this.option);
                }

            },
            handle () {

                // 以下内容vm代替this纯属我需要debugger

                const vm = this;

                this._.merge(this.option, {
                    title: {text: this.$t(this.title)}
                });

                return {
                    bar: () => {
                        const assignData = {
                            xAxis: [{
                                data: []
                            }],
                            series: [{
                                data: []
                            }]
                        };

                        vm.sessionData.forEach(item => {

                            assignData.xAxis[0].data.push(item.key);

                            assignData.series[0].data.push(item.doc_count);

                        });

                        return assignData;
                    },
                    pie: () => {

                        const assignData = {
                            series: [{
                                data: []
                            }]
                        };

                        vm.sessionData.forEach(item => {

                            assignData.series[0].data.push({
                                name: item.key,
                                value: item.doc_count
                            });

                        });

                        return assignData;

                    },
                    line: () => {

                        const assignData = {
                            series: []
                        };

                        if (!vm._.isArray(vm.sessionData)) {

                            assignData.legend = {
                                data: []
                            };

                            for (let obKey in vm.sessionData) {

                                let arr = [];

                                assignData.legend.data.push(obKey);

                                vm.sessionData[obKey].forEach(item => {

                                    arr.push({
                                        value: [item.key, item.value]
                                    });

                                });

                                assignData.series.push({
                                    name: obKey,
                                    data: arr
                                });

                            }

                        } else {

                            vm.option = Option.line_old;

                            vm.sessionData.forEach(item => {
                                vm.option.series[0].data.push({value: [item.key, item.doc_count]});
                            });

                            // console.log(vm.option);

                        }

                        return assignData;
                    },
                    map: () => {

                        console.log(vm.option);

                        console.log(this.option);

                        const assignData = {
                            dataRange: {
                                min: 0,
                                max: 10000,
                            },
                            series: [{
                                data: []
                            }]
                        };

                        assignData.series[0].data = Tool.map.getLineList(this.sessionData);

                        let pointArr = [];

                        for (let i in this.sessionData.points) {

                            if (this.sessionData.points[i].dst_weight) {
                                pointArr.push(this.sessionData.points[i].dst_weight);
                            }

                            if (this.sessionData.points[i].src_weight) {
                                pointArr.push(this.sessionData.points[i].src_weight);
                            }
                        }

                        let maxPoints = parseInt(Math.max.apply(null, pointArr) * 1.2);
                        let minPoints = parseInt(Math.min.apply(null, pointArr) * 0.8);

                        assignData.dataRange.max = maxPoints;
                        assignData.dataRange.min = minPoints;

                        Tool.map.getPointList(assignData.series, this.sessionData, maxPoints, minPoints);

                        return assignData;

                    }
                };
            },
            build () {

                if (!this.ajax.type) this.ajax.type = 'get';

                if (!this.ajax.data) this.ajax.data = {};

                this.ajax.type = this.ajax.type.toLocaleLowerCase();

                // 该方法为态势感知离线数据添加的函数，如功能相违，注释即可
                Util.addOfflineParams(this, this.ajax.data);

                this.$http[this.ajax.type](this.ajax.url, this.ajax.type === 'get' ? {params: this.ajax.data} : this.ajax.data)
                    .then(res => {

                        console.warn(`============ echarts-plugin ajax response ~ current draw type is ${ this.type } ~ ============`);
                        console.log(res);

                        this.sessionData = res.data.rows;

                        this.option = {};

                        this.completeAssign(this.option, Option[this.type], {});

                        this._.merge(this.option, this.config);

                        if (this._.isPlainObject(this.sessionData) ? !this._.isEmpty(this.sessionData) : this.sessionData.length !== 0) {

                            this.hasData = true;

                            this.$chart = this.$echarts.init(document.querySelector(`#${this.id}`));

                            this.switchData();

                            this.$chart.setOption(this.option);

                            this.registerEvent();

                            window.addEventListener('resize', () => {
                                this.$chart.resize();
                            });

                        } else {

                            this.hasData = false;

                        }

                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        mounted () {

            this.build();

            if (this.reload) this.reloadTemplate();

        }
    };
</script>

<style lang="less" scoped>

    .plugin {
        width: 100%;
        height: 100%;

        .ivu-col {
            height: 100%;

            .echarts-container {
                width: 100%;
                height: 100%;

                &-null {
                    width: 100%;
                    height: 100%;
                    position: relative;

                    &:before {
                        content: '';
                        width: 80%;
                        height: 70%;
                        position: absolute;
                        top: 10%;
                        left: 8%;
                        opacity: .6;
                        background-image: url('../../../../static/images/echarts/null.png');
                        background-size: cover;
                        background-position: center;
                    }
                }
            }
        }

    }

</style>
