<template>
    <div id="bigScreen">
        <Row :gutter="5">
           <Col span="5">  <!--第一列-->
                <Row class="chart-row">
                    <Col span="24" class="chart-container" style="height: 280px" >

                        <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                        <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>
                        <Row class="circle-container">
                            <Col span="12">
                                <tp-ssa-echarts :allParams="circle1"></tp-ssa-echarts>
                            </Col>
                            <Col span="12">
                                <tp-ssa-echarts :allParams="circle2"></tp-ssa-echarts>
                            </Col>
                        </Row>

                        <Row class="circle-container">
                            <Col span="12">
                                <tp-ssa-echarts :allParams="circle3"></tp-ssa-echarts>
                            </Col>
                            <Col span="12">
                                <tp-ssa-echarts :allParams="circle4"></tp-ssa-echarts>
                            </Col>
                        </Row>
                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>

                </Row>
                <Row class="chart-row">
                    <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                    <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>

                    <Col span="24" class="chart-container" style="height: 280px">
                        <tp-ssa-echarts ref="refPortApply" :allParams="allParamsPortApply"></tp-ssa-echarts>
                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>
                </Row>
                <Row class="chart-row">
                    <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                    <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>

                    <Col span="24" class="chart-container" style="height: 280px">
                        <tp-ssa-echarts ref="refIpSiteCount" :allParams="allParamsIpSiteCount"></tp-ssa-echarts>
                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>
                </Row>
            </Col>
            <!--地图-->
            <Col span="14" style="height:858px">   <!--第二列-->
            <!--<div v-for="(point,index) in points" style="color: red">
                {{point}}
                {{index}}
            </div>-->
                <!--引入百度地图-->
                <baidu-map class="map" :center="defaultCenter" :zoom="defaultZoom" :mapStyle="{style:'dark'}"  :scroll-wheel-zoom="true">

                    <div v-for="(point,index) in points">

                        <bm-marker :position="point" @click="infoWindowOpen($event,index)">
                            <bm-info-window v-if="markShowFlag" :show="point.show" @close="infoWindowClose($event,index)">

                                <p>
                                    <span>IP个数:</span>
                                    <span>{{point.doc_count ? point.doc_count : 0}}</span>
                                </p>
                                <p>
                                    <span>地址:</span>
                                    <span>{{point.object.ip_GeoPosition.P}}</span>
                                </p>
                                <p>
                                    <span>经纬度:</span>
                                    <span>{{point.textlng}},{{point.textlat}}</span>
                                </p>
                                <p>
                                    <a href="#" @click="jump(index)">查看详情</a>
                                </p>


                            </bm-info-window>
                            <bm-label v-if="markShowFlag" :content="point.textdoc_count" :labelStyle="{color: 'black', fontSize : '10px'}" :offset="{width: 20, height: -10}"/>
                        </bm-marker>
                    </div>

                </baidu-map>

                <!--<baidu-map class="map" :center="defaultCenter" :zoom="defaultZoom">
                    <bm-point-collection :points="points" animation="BMAP_ANIMATION_BOUNCE">

                    </bm-point-collection>
                </baidu-map>-->
            </Col>

            <Col span="5">   <!--第三列-->
                <Row class="chart-row">
                    <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                    <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>

                    <Col span="24" class="chart-container" style="height: 200px">
                        <tp-ssa-echarts ref="refIpLoophole" :allParams="allParamsIpLoophole"></tp-ssa-echarts>
                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>
                </Row>
                <Row class="chart-row">

                    <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                    <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>

                    <Col span="24" class="chart-container" style="height: 430px">

                        <tp-ranking-list :allParams="rankingList"></tp-ranking-list>

                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>
                </Row>
                <Row class="chart-row">
                    <div class="angle_bg" style="top:0;transform: rotate(270deg)"></div>
                    <div class="angle_bg" style="top: 0;right: 0;transform: rotate(360deg)"></div>

                    <Col span="24" class="chart-container" style="height: 210px">
                        <tp-ssa-echarts ref="refLoopholeHigh" :allParams="allParamsLoopholeHigh"></tp-ssa-echarts>
                    </Col>

                    <div class="angle_bg" style="left:0;transform: rotate(180deg)"></div>
                    <div class="angle_bg" style="right: 0"></div>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>

    import TpSsaEcharts from "../../../components/locale-components/tp-ssa-echarts/tp-ssa-echarts";
    import TpRankingList from "../../../components/locale-components/tp-ssa-echarts/tp-ranking-list";
    export default {
        name: "countPandect",
        components: {TpRankingList, TpSsaEcharts},
        data() {
            return {
                barRefs: '',
                msg: '外网资产管家页面',
                timeout: 0,
                circle1: {
                    id: 'siteSum',
                    type: "circle",
                    title: "总网站",
                    url: '/api/ass_loophole/loophole/static_count',
                    data: {
                        offline_attr: '_ass_loophole_static_count'
                    },
                    callback: data => {
                        data.total = data.rows[0].webSiteAllCnt
                    }
                },
                circle2: {
                    id: 'loopholeSum',
                    type: "circle",
                    title: "总漏洞数",
                    url: '/api/ass_loophole/loophole/static_count',
                    data: {
                        offline_attr: '_ass_loophole_static_count'
                    },
                    callback: data => {
                        data.total = data.rows[0].loopholeAllCnt
                    }
                },
                circle3: {
                    id: 'siteNoRecord',
                    type: "circle",
                    title: "未备案网站",
                    url: '/api/ass_loophole/loophole/static_count',
                    data: {
                        offline_attr: '_ass_loophole_static_count'
                    },
                    callback: data => {
                        data.total = data.rows[0].illegalCnt
                    }
                },
                circle4: {
                    id: 'highLoophole',
                    type: "circle",
                    title: "严重漏洞",
                    url: '/api/ass_loophole/loophole/static_count',
                    data: {
                        offline_attr: '_ass_loophole_static_count'
                    },
                    callback: data => {
                        data.total = data.rows[0].loopholeHighCnt
                    }
                },
                allParamsPortApply: {
                    id: 'portApply',
                    type: "bar",
                    title: "端口应用Top10",
                    url: '/api/getbar',
                    reload: 20000,
                    data: {
                        index: 'loophole_result',
                        type: 'lph_scan_result',
                        aggField: 'resultPort'
                    },
                    event: {       //跳转到漏洞分析   漏洞列表
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["resultPort"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'countPandect',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsIpSiteCount: {
                    id: 'ipSiteCount',
                    type: "bar",
                    title: "IP站点数Top10",
                    url: '/api/getbar',
                    reload: 20000,
                    data: {
                        index: 'ipweb_result',
                        type: 'web_info',
                        aggField: 'strIP'
                    },
                    event: {       //跳转到站点分析   站点列表
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["strIP"]: [params.name]}};
                            this.$router.push({
                                name: "sitePage_index",
                                params: {
                                    source: 'countPandect',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsIpLoophole: {
                    id: 'ipLoophole',
                    type: "bar",
                    title: "IP漏洞数Top10",
                    url: '/api/getbar',
                    reload: 20000,
                    data: {
                        index: 'loophole_result',
                        type: 'lph_scan_result',
                        aggField: 'resultHost',
                        page: 1,
                        size: 10
                    },
                    event: {       //跳转到漏洞分析   漏洞列表
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["resultHost"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'countPandect',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                allParamsLoopholeHigh: {
                    id: 'loopholeHigh',
                    type: "pie",
                    title: "漏洞严重性评分分布",
                    url: '/api/getpie',
                    config: {
                        label:{
                            formatter:function (params) {
                               return params.data.name+"分"
                            }
                        }
                    },
                    reload: 20000,
                    data: {
                        index: 'loophole_result',
                        type: 'lph_scan_result',
                        aggField: 'resultSeverity',
                        size: 10
                    },
                    event: {       //跳转到漏洞分析   漏洞列表
                        click: params => {
                            // 查询的字段域 和 字段value
                            let CombQueryDataObject = {CombQuerys: {["resultSeverity"]: [params.name]}};
                            this.$router.push({
                                name: "loopholePage_index",
                                params: {
                                    source: 'countPandect',
                                    CombQueryDataObject: CombQueryDataObject
                                }

                            })
                        }
                    }
                },
                rankingList: {
                    id: 'loophole',
                    title: '漏洞Top 10 排名',
                    url: '/api/getpie',
                    url1: '/api/ssa_table',
                    data: {
                        index: 'loophole_result',
                        type: 'lph_scan_result',
                        aggField: 'nvtName',
                        offline_attr: '_ass_loophole_happen',
                        page: 1,
                        size: 10
                    },
                    labelFlag: true,
                    countFlag: true
                },
                defaultCenter: {
                    // lng: 113.5325,
                    //lat: 34.6836
                    lng: 113.1268217112,
                    lat: 27.8307991014
                },
                defaultZoom: 5,
                markShowFlag: true,
                points: []
            }
        },
        mounted() {

            let me = this;
            this.$http.get('/api/ssa_topntable', {
                params: {
                    offline_attr: '_ass_loophole_ip_position',
                    index: 'ipweb_result',
                    type: 'ip_geo_info',
                    aggField: 'ip_position',
                    showField: 'ip_position',
                    page: 1,
                    size: 100
                }

            }).then(function (response) {

                console.log('a----a')
                console.log(response)
                let data = response;
                let points = [];
                if (data.code === 0 && data.data.total > 0) {
                    /*addMarker('#wordMap', false)*/
                    me.markShowFlag = true;

                    let _data = data.data.rows


                    let dictTmp = {}
                    for (let i = 0; i < _data.length; i++) {


                        let itemDict = _data[i]._source

                        if (itemDict.ip_GeoPosition.D_L) {

                            let tmpKey = itemDict.ip_GeoPosition.D_L

                            if (tmpKey in dictTmp) {
                                dictTmp[tmpKey].doc_count += itemDict.doc_count
                            }
                            else {
                                dictTmp[tmpKey] = {}
                                //begin 应臣原始代码先保留
                                /*dictTmp[tmpKey].D = itemDict.ip_GeoPosition.D_L.split(',')[0]
                  dictTmp[tmpKey].L = itemDict.ip_GeoPosition.D_L.split(',')[1]
                  dictTmp[tmpKey].D = itemDict.ip_GeoPosition.D_L[0]
                  dictTmp[tmpKey].L = itemDict.ip_GeoPosition.D_L[1]*/
                                //end 应臣原始代码先保留
                                dictTmp[tmpKey].lng = itemDict.ip_GeoPosition.D_L[0]
                                dictTmp[tmpKey].lat = itemDict.ip_GeoPosition.D_L[1]
                                dictTmp[tmpKey].object = itemDict
                                dictTmp[tmpKey].doc_count = itemDict.doc_count
                                dictTmp[tmpKey].show = false;
                                dictTmp[tmpKey].textdoc_count = itemDict.doc_count.toString();
                            }
                        }
                    }

                    for (let tmp2Key in dictTmp) {

                        let earchItemDict = dictTmp[tmp2Key]

                        points.push(earchItemDict);
                        console.log('---earchItemDict---');
                        console.log(earchItemDict);


                        /*point = MAP.point(earchItemDict.D, earchItemDict.L)//设置地图点的位置
              mark = MAP.marker(point)//给每一个点创建标记
              map.addOverlay(mark)//// 将标注添加到地图中*/


                        /*mark.setLabel(
                MAP.label(earchItemDict.doc_count, {
                  offset: MAP.size(20, -10)
                })
              )
              registerEvent(mark, earchItemDict, map)*/
                    }

                    /*me.points = [{
              lng: 113.5325,
              lat: 34.6836
            },{
              lng: 110.5325,
              lat: 30.6836
            }];*/

                    /* map.centerAndZoom(point, 5)*///当然也可以根据城市名称设置地图的中心点：

                    // openInfoDefault(firstShow["data"], firstShow["map"]);

                } else {
                    me.markShowFlag = false;
                    let defaultObj = {
                        lng: 113.1268217112,
                        lat: 27.8307991014
                    };
                    points.push(defaultObj);

                }
                me.points = points;

            }).catch(function (error) {

                alert(error);
            });
        },
        methods: {
          infoWindowOpen(event,index){
            console.log(index);
            let _getPosition = event.target.getPosition()
            let show = this.points[index].show;
            this.points[index].show = !show;
            this.points[index].textlng = _getPosition.lng;
            this.points[index].textlat = _getPosition.lat;

          },
          infoWindowClose(event,index){
            this.points[index].show = false;
          },
          jump(index){
            let me = this;
            this.$router.push({
              name:"ipPage_index",
              params: {
                mapKey:{
                  'lng': me.points[index].lng,
                  'lat':  me.points[index].lat
                }
              }

            })
          }
        }
    };
</script>

<style lang="less">
    .angle_bg {
        width: 18px !important;
        height: 18px !important;
        background: url("../../../../static/images/global/angle.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        transform: rotate(90deg);
        margin-bottom: 6px;
    }
    .chart-row {
        .chart-container {
            margin-bottom: 6px;
            margin-left: 0;
            background-color: rgba(255,255,255,0.02);
        }
        .circle-container {
            height: 50%;

            .ivu-col{
                height: 100%;
            }
        }
    }
    .map {
        width: 100%;
        height: 100%;
    }
    .map span{
        font-size: 14px;
    }
    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }

</style>
