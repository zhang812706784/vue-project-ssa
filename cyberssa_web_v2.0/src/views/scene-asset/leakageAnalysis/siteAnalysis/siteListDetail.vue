<template>
    <div id="siteDetail">
        <Row >
            <Col span="24" style="height: 80px;">
                <div  style="padding: 10px 10px;float: left"><Button style="border-radius: 3px" @click="backSiteAnalysis" type="ghost" shape="circle" icon="reply">返回</Button></div>
                <div class="topSection"><p>{{this.siteDetailDate.loopholeAllCnt}}</p><span>漏洞数</span></div>
                <div class="topSection"><p>{{this.siteDetailDate.loopholeTypeCnt}}</p><span>漏洞类型</span></div>
                <div class="topSection"><p>{{this.siteDetailDate.highLevelCnt}}</p><span>严重告警数</span></div>
                <div class="topSection"><p>{{this.siteDetailDate.loopholePorCnt}}</p><span>开放端口数</span></div>
            </Col>
        </Row >

        <Row :gutter="16" >
            <Col span="12" class="left">
                <Card class="card">
                    <ul>
                        <li>
                            <div class="spanTitle">域名</div>
                            <div class="spanContent">{{this.siteDetailDate.domain}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">网站IP地址</div>
                            <div class="spanContent">{{this.siteDetailDate.strIP}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">公司名称</div>
                            <div class="spanContent">{{this.siteDetailDate.companyName}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">网站首页</div>
                            <div class="spanContent">{{this.siteDetailDate.webdemain}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">网站标题</div>
                            <div class="spanContent">{{this.siteDetailDate.title}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">备案</div>
                            <div class="spanContent">{{this.siteDetailDate.webRecords}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">主办单位</div>
                            <div class="spanContent">{{this.siteDetailDate.websponsor}}</div>
                        </li>
                        <li>
                            <div class="spanTitle">单位性质</div>
                            <div class="spanContent">{{this.siteDetailDate.websponsorNature}}</div>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col span="12">
                <!--引入百度地图-->
                <baidu-map class="mapInfo" :center="defaultCenter" :zoom="defaultZoom" :mapStyle="{style:'dark'}" :scroll-wheel-zoom="true">
                    <bm-marker :position="defaultCenter">
                    </bm-marker>
                </baidu-map>
            </Col>
        </Row>
        <Tabs value="siteDetail" style=" visibility: visible;">

            <TabPane label="站点详情" name="siteDetail">

                <tp-table ref="refLoopholeTable" :all_params="loopholeTable"></tp-table>

            </TabPane>

        </Tabs>
    </div>
</template>

<script>
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "siteListDetail",
        components: {TpTable},
        data() {
            return {
                defaultCenter: {
                    lng: 113.1268217112,
                    lat: 27.8307991014
                },
                defaultZoom: 5,
                markShowFlag: true,
                siteDetailDate:{
                    domain:'域名',
                    strIP : '网站IP地址',
                    companyName:'公司名称',
                    webdemain:'网站首页',
                    title:'网站标题',
                    webRecords:'备案',
                    websponsor:'主办单位',
                    websponsorNature:'单位性质',
                    loopholeAllCnt: '0',
                    loopholeTypeCnt: '0',
                    highLevelCnt: '0',
                    loopholePorCnt: '0'
                },
                //漏洞列表
                loopholeTable: {
                    id: 'loopholeList',
                    index: true,
                    checkBox: false,
                    url: '/api/ass_loophole/loophole/loophole_list',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        /*ip: siteDetailDate.strIP*/
                        ip:''
                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '漏洞名称',
                            render: (h, params) =>{
                                return h('div',params.row._source.nvtName)
                            }
                        },
                        {
                            title: '严重性',
                            render: (h, params) =>{
                                if (params.row._source.resultSeverity <= 5.0) {
                                    return h('div','低')
                                } else if (params.row._source.resultSeverity >= 8.0) {
                                    return h('div','高')
                                } else {
                                    return h('div','中')
                                }
                            }
                        },
                        {
                            title: '主机',
                            render: (h, params) =>{
                                return h('div',params.row._source.resultHost)
                            }
                        },
                        {
                            title: '位置',
                            render: (h, params) =>{
                                return h('div',params.row._source.resultPort)
                            }
                        },
                        {
                            title: '操作',
                            render: (h,params) => {
                                return h('a', {
                                    domProps:{
                                        href:this.loopholeDetail(params)
                                    }
                                },'详情')
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            backSiteAnalysis() {
                this.$router.go(-1);
            },
            //漏洞详情
            loopholeDetail(params1) {
                let _this = this;
                let str='';
                let _data=params1.row._source;
                this.$http.get('/api/sysmgr/get_conf',
                    {
                        params: {
                            type: 'openvas'
                        }
                    }
                ).then(res => {//res: host port
                    str='https://' + res.data.rows.info.host + ':' + res.data.rows.info.port + '/omp?cmd=get_result&result_id=' + _data.resultUuid
                });
                return str;
            }
        },
        created(){
            let _this = this;
            let source = this.$route.params.source;
            let CombQueryDataObject = this.$route.params.CombQueryDataObject;
            if(CombQueryDataObject!==undefined) {
                this.siteDetailDate.domain = CombQueryDataObject.domain;
                this.siteDetailDate.strIP = CombQueryDataObject.strIP;
                this.siteDetailDate.companyName = CombQueryDataObject.companyName;
                this.siteDetailDate.webdemain = CombQueryDataObject.webdemain;
                this.siteDetailDate.title = CombQueryDataObject.title;
                this.siteDetailDate.webRecords = CombQueryDataObject.webRecords;
                this.siteDetailDate.websponsor = CombQueryDataObject.websponsor;
                this.siteDetailDate.websponsorNature = CombQueryDataObject.websponsorNature;

                this.siteDetailDate.loopholeAllCnt = CombQueryDataObject.loopholeAllCnt || '（无）';
                this.siteDetailDate.loopholeTypeCnt = CombQueryDataObject.loopholeTypeCnt || '（无）';
                this.siteDetailDate.highLevelCnt = CombQueryDataObject.highLevelCnt || '（无）';
                this.siteDetailDate.loopholePorCnt = CombQueryDataObject.loopholePorCnt || '（无）';
            }else{
                this.siteDetailDate.domain = '（无）';
                this.siteDetailDate.strIP = '61.158.145.3';
                this.siteDetailDate.companyName = '（无）';
                this.siteDetailDate.webdemain = '（无）';
                this.siteDetailDate.title = '（无）';
                this.siteDetailDate.webRecords = '（无）';
                this.siteDetailDate.websponsor = '（无）';
                this.siteDetailDate.websponsorNature = '（无）';

                this.siteDetailDate.loopholeAllCnt = '（无）';
                this.siteDetailDate.loopholeTypeCnt = '（无）';
                this.siteDetailDate.highLevelCnt = '（无）';
                this.siteDetailDate.loopholePorCnt = '（无）';
            }
            setTimeout(()=>{
                if(source && source === 'siteAnalysis'){
                    this.$refs.refLoopholeTable.changeParams( {
                        ip: this.siteDetailDate.strIP
                    });
                }
            },1000);

            //地图
            _this.$http.get('/api/ssa_table',
                {
                    params: {
                        index: "ipweb_db",
                        type: "ip_geo_info",
                        queryObj: {"strIP": _this.siteDetailDate.strIP},
                        page: 1,
                        size: 10
                    }
                }
            ).then(res => {
                if (res.data.rows[0] === undefined) {
                    _this.defaultCenter={
                        lng: 113.1268217112,
                        lat: 27.8307991014
                    };
                } else {
                    let point=res.data.rows[0]._source.ip_GeoPosition.D_L.split(",");
                    //_this.point=["113.1268217112", "27.8307991014"];
                    _this.defaultCenter.lng=point[0];
                    _this.defaultCenter.lat=point[1];
                }
            })
        },
    }
</script>

<style lang="less">
    #siteDetail
    {
        padding: 10px 50px;
        width: 100%;
        color: #fff;
        background-color: rgba(255,255,255,0.1);
    }

    .topSection {
        float: left;
        width: 20%;
        box-sizing: border-box;
        text-align: center;
        /*border: 1px solid red;*/
    }
    .topSection p {
        font-size: 25px;
    }
    .left {
        font-size: 14px;

        .card{
            background: transparent;

            ul {
                list-style: none;

                li {
                    //border-bottom: 1px solid rgba(0, 0, 0, 0.5);
                    width: 100%;
                    height: 32px;
                    margin-top: 5px;

                    div {
                        float: left;
                        margin: auto 5px;
                    }
                    .spanTitle {
                        width: 20%;
                        text-align: center;
                    }
                    .spanContent {
                        width: 75%;
                        text-align: left;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }

    .mapInfo{
        height:330px;
    }

    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }
</style>
