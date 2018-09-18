<template>
    <Row class="plugin">

        <Col span="24" v-if="status" :id="random">

            <div class="echarts-container" :class="{'echarts-mark': !hasData}" :id="id">
                <div class="echarts-mark-img" v-if="!hasData"></div>
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
     <!-- 调用形式 (参考 tp-ssa-echarts.vue - template) -->
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

    import Option from './option/option';
    import Util from '@/libs/util';
    import Tool from './tool/';

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
                random: '',
                events: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'globalout'],
                status: true,
                hasData: true,
                reloadInterval: '',
                $chart: '',
                chartWidth: '',
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
            },
            chartWidth () {
                if (this.$chart) {
                    try {
                        this.$chart.resize();
                    } catch (e) {
                    }
                }
            }
        },
        methods: {
            remount () {
                this.status = false;

                setTimeout(() => {
                    this.status = true;
                }, 100);
            },

            // reload template
            reloadTemplate () {

                clearInterval(this.reloadInterval);

                if (this.reload * 1 === 0) {

                    this.remount();

                } else {

                    this.reloadInterval = setInterval(() => {

                        this.remount();

                    }, this.reload * 1);

                }

            },

            // 事件注册
            registerEvent () {

                this.events.forEach(event => {

                    this.$chart.off(event);

                    this.$chart.on(event, params => this.$emit(`event-${event}`, params));

                });

            },

            // 数据分发处理
            switchData () {

                const handle = this.handle();

                if (this.type !== 'circle') {
                    this._.merge(this.option, {
                        title: {text: this.$t(this.title)}
                    });
                }

                // 合并处理
                this._.merge(this.option, handle[this.type]());

                // 测试代码
                if (this.type === 'bar') {
                    // Util.stringify(this.option);
                }

            },

            // 数据分发处理
            handle () {

                const vm = this;

                // 分类处理
                if (this.type !== 'circle') this.sessionData = this.sessionData.rows;

                // 以下分类处理单独类型data
                // 同时 return 的所有对象的key都为 调用参数的type
                // 例 type: 'bar'
                return {
                    // 测试预留
                    test: () => {
                        // console.log(123);
                    },
                    // 柱状图
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

                            assignData.series[0].data.push(
                                item.subaggs ? item.subaggs.value : item.doc_count
                            );

                        });

                        Tool.parseYAxis(vm);

                        return assignData;
                    },
                    // 横向柱状图
                    crossBar: () => {
                        const assignData = {
                            yAxis: {
                                data: []
                            },
                            series: [{
                                data: []
                            }]
                        };

                        vm.sessionData.forEach(item => {

                            assignData.yAxis.data.push(item.key);

                            assignData.series[0].data.push(
                                item.subaggs ? item.subaggs.value : item.doc_count
                            );

                        });

                        Tool.parseYAxis(vm);

                        return assignData;
                    },
                    // 饼图
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
                    // 圆形数据图
                    circle: () => ({
                        series: [{
                            data: [
                                {name: this.title},
                                {name: `${this.sessionData.total}`}
                            ]
                        }]
                    }),
                    // 趋势图 兼容老版本数据格式
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

                            vm.option = {};

                            this._.merge(vm.option, Option.line_old);

                            this._.merge(this.option, {
                                title: {text: this.$t(this.title)}
                            });

                            vm.sessionData.forEach(item => {
                                vm.option.series[0].data.push({value: [item.key, item.doc_count]});
                            });

                        }

                        Tool.parseYAxis(vm);

                        return assignData;
                    },
                    // 世界地图
                    map: () => {

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

                    },
                    // 拓补图
                    topology: () => ({
                        series: [{
                            data: Tool.topology.get_nodes(vm.sessionData.pologydata, vm.option),
                            links: Tool.topology.get_links(vm.sessionData.pologydata),
                        }]
                    })
                };
            },

            eventListener () {
                const resizeDom = document.getElementById(this.random);

                if (resizeDom) this.chartWidth = resizeDom.offsetWidth;
            },

            checkResponse (res) {

                // topology 只检查 pologydata 字段
                if (this.type === 'topology') {

                    const _ob = res.data.rows;

                    if (this._.isObject(_ob)) {
                        if (this._.isEmpty(_ob.pologydata)) res.data.rows = [];
                    }

                }

            },

            // init echarts
            build () {

                // 默认配置修改
                if (!this.ajax.type) this.ajax.type = 'get';

                if (!this.ajax.data) this.ajax.data = {};

                this.ajax.type = this.ajax.type.toLocaleLowerCase();

                // 该方法为态势感知离线数据添加的函数，如功能相违，注释即可
                Util.addOfflineParams(this, this.ajax.data);

                this.$http[this.ajax.type](this.ajax.url, this.ajax.type === 'get' ? {params: this.ajax.data} : this.ajax.data)
                    .then(res => {

                        // console.warn(`============ echarts-plugin ajax response ~ current draw type is ${ this.type } ~ ============`);
                        // console.log(res);

                        this.checkResponse(res);

                        this.sessionData = res.data;

                        if (this.ajax.callback) this.ajax.callback.call(this, res.data);

                        this.option = {};

                        this._.merge(this.option, Option[this.type], this.config);

                        // 空数据判断
                        if (this._.isPlainObject(this.sessionData.rows) ?
                            !this._.isEmpty(this.sessionData.rows) : this.sessionData.rows.length !== 0) {

                            this.hasData = true;

                            this.$chart = this.$echarts.init(document.querySelector(`#${this.id}`));

                            // 分发处理数据
                            this.switchData();

                            this.$chart.setOption(this.option);

                            this.registerEvent();

                            const _tag = document.getElementById(this.random);

                            this.chartWidth = _tag.offsetWidth;

                        } else {

                            this.hasData = false;

                        }

                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        },
        mounted () {

            this.random = `listener_${_.random(99 * 100, 99 * 1111, false).toString(36)}_${_.random(2, 500)}`;

            // console.log(this.id, this.random);

            this.build();

            if (this.reload) this.reloadTemplate();

            window.addEventListener('resize', this.eventListener);

        },
        beforeDestroy () {

            if (this.$chart) this.$chart.dispose();

            window.removeEventListener('resize', this.eventListener);

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
            }

            .echarts-mark {
                display: flex;
                align-items: center;
                justify-content: center;

                &-img {
                    width: 180px;
                    height: 125px;
                    opacity: .3;
                    background-image: url('../../../../static/images/echarts/null.png');
                    background-size: 100% 100%;
                }
            }
        }

    }

</style>
