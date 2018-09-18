<template>
    <div id="ipDetail">
        <Row >
            <Col span="24" style="height: 80px;">
                <div  style="padding: 10px 10px;float: left;"><Button style="border-radius: 3px" @click="backIpAnalysis" type="ghost" shape="circle" icon="reply">返回</Button></div>
                <div class="topSection"><p>{{ipDetailDate.loopholeAllCnt}}</p><span>漏洞数</span></div>
                <div class="topSection"><p>{{ipDetailDate.loopholeTypeCnt}}</p><span>漏洞类型</span></div>
                <div class="topSection"><p>{{ipDetailDate.highLevelCnt}}</p><span>严重告警数</span></div>
                <div class="topSection"><p>{{ipDetailDate.loopholePorCnt}}</p><span>开放端口数</span></div>
            </Col>
        </Row >

        <Row :gutter="16" >
            <Col span="12"  class="left">
                <Card class="card">
                    <div class="cardList">
                        <ul>
                            <li>
                                <div class="spanTitle">IP地址</div>
                                <div class="spanContent">{{ipDetailDate.uuid}}</div>
                            </li>
                            <li>
                                <div class="spanTitle">地理位置</div>
                                <div class="spanContent">{{ipDetailDate.ip_position}}</div>
                            </li>
                            <li>
                                <div class="spanTitle">经纬度</div>
                                <div class="spanContent">{{ipDetailDate.ip_GeoPosition}}</div>
                            </li>
                            <li>
                                <div class="spanTitle">站点数</div>
                                <div class="spanContent">{{ipDetailDate.siteCount}}</div>
                            </li>
                        </ul>
                        <div class="openPort">
                            <div>开放端口服务</div>
                            <ul>
                                <li v-for="item in ipDetailDate.openPortServer">{{item}}</li>
                            </ul>
                            <span :title="openPortServerTitle">...</span>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span="12" >
                <!--引入百度地图-->
                <baidu-map class="mapInfo" :center="defaultCenter" :zoom="defaultZoom" :mapStyle="{style:'dark'}"  :scroll-wheel-zoom="true">
                    <bm-marker :position="defaultCenter">
                    </bm-marker>
                </baidu-map>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Tabs value="loopholeList" style=" visibility: visible;">

                    <TabPane label="漏洞列表" name="loopholeList">
                        <tp-table ref="refLoopholeTable" :all_params="loopholeTable"></tp-table>
                    </TabPane>

                    <TabPane label="站点详情" name="siteDetail">

                        <tp-table ref="refSiteTable" :all_params="siteTable"></tp-table>

                    </TabPane>

                </Tabs>
            </Col>
        </Row>
    </div>
</template>

<script>
    import TpTable from "../../../../components/locale-components/tp-table/tp-table";
    export default {
        name: "ipListDetail",
        components: {TpTable},
        data() {
            return {
                openPortServerTitle:'',
                openPortServerEndList:[],
                defaultCenter: {
                    lng: 113.1268217112,
                    lat: 27.8307991014
                },
                defaultZoom: 5,
                markShowFlag: true,
                ipDetailDate:{
                    strIP:'',
                    uuid : '待更新',
                    ip_position:'待更新',
                    ip_GeoPosition:'待更新',
                    siteCount:'待更新',
                    openPortServer:[],
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
                        /*ip:this.ipDetailDate.uuid*/
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
                            title: '严重性sss',
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
                            key: 'operation',
                            render: (h,params) => {
                                return h('a', {
                                    domProps:{
                                        href:this.loopholeDetail(params)
                                    }
                                },'详情')
                            }
                        }
                    ]
                },
                // 站点详情
                siteTable: {
                    id: 'siteList',
                    index: true,
                    checkBox: false,
                    url: '/api/ssa_table',
                    type:'table',
                    ajaxType:'get',
                    data:{
                        index: "ipweb_result",
                        type: "web_info",
                        queryObj: {
                            /*"strIP": this.ipDetailDate.uuid*/
                            "strIP": ''
                        }
                    },
                    add_btn:false,
                    del_btn:false,
                    modify_btn:false ,
                    cols: [
                        {
                            title: '域名',
                            render: (h, params) => {
                                return h('div', params.row._source.webdemain);
                            }
                        },
                        {
                            title: '网站IP地址',
                            render: (h, params) => {
                                return h('div', params.row._source.strIP);
                            }
                        },
                        {
                            title: '公司名称',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.webName === "" || params.row._source.legalityInfo.webName == null) {
                                    return h('div', '(无)');
                                } else {
                                    if (params.row._source.legalityInfo.webName.length > 3) {
                                        let webName = params.row._source.legalityInfo.webName.substring(0, 3);
                                        return h('div', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.webName
                                            }
                                        }, webName + '...');
                                    } else {
                                        return h('div', params.row._source.legalityInfo.webName);
                                    }
                                }
                            }
                        },
                        {
                            title: '网站首页',
                            render: (h, params) => {
                                return h('div', params.row._source.webdemain);
                            }
                        },
                        {
                            title: '网站标题',
                            render: (h, params) => {
                                if (params.row._source.title === "" || params.row._source.title == null) {
                                    return h('div', '(无)');
                                } else if (params.row._source.title === "_none_access" || params.row._source.title === "_none_title" || params.row._source.title === "Not Found") {
                                    return h('div', '(无)');
                                } else if (params.row._source.title.indexOf("Error") === "-1") {
                                    return h('div', '(无)');
                                }
                                else {
                                    if (params.row._source.title.length > 3) {
                                        let title = params.row._source.title.substring(0, 3);
                                        return h('div', {
                                            domProps: {
                                                title: params.row._source.title
                                            }
                                        }, title+"...");
                                    } else {
                                        return h('div', params.row._source.title);
                                    }
                                }
                            }
                        },
                        {
                            title: '备案',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.webrecords === "" || params.row._source.legalityInfo.webrecords == null) {
                                    return h('div', '未备案')
                                } else {
                                    if (params.row._source.legalityInfo.webrecords.length > 3) {
                                        let webrecords = params.row._source.legalityInfo.webrecords.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.webrecords
                                            }
                                        }, webrecords + '...')
                                    } else {
                                        return h('div', params.row._source.legalityInfo.webrecords);
                                    }
                                }
                            }
                        },
                        {
                            title: '主办单位',
                            render: (h, params) => {

                                if (params.row._source.legalityInfo.websponsor === "" || params.row._source.legalityInfo.websponsor == null) {
                                    return h('div', '(无)');
                                } else {
                                    if (params.row._source.legalityInfo.websponsor.length > 3) {
                                        let websponsor = params.row._source.legalityInfo.websponsor.substring(0, 3);
                                        return h('label', {
                                            domProps: {
                                                title: params.row._source.legalityInfo.websponsor
                                            }
                                        }, websponsor + '...')
                                    } else {
                                        return h('div', params.row._source.legalityInfo.websponsor);
                                    }
                                }
                            }
                        },
                        {
                            title: '单位性质',
                            render: (h, params) => {
                                if (params.row._source.legalityInfo.websponsorNature === "" || params.row._source.legalityInfo.websponsorNature == null) {
                                    return h('div', '(无)');
                                } else {
                                    return h('div', params.row._source.legalityInfo.websponsorNature)
                                }
                            }
                        },
                        {
                            title: '漏洞数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeAllCnt);
                            }
                        },
                        {
                            title: '漏洞类型',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholeTypeCnt);
                            }
                        },
                        {
                            title: '严重告警数量',
                            render: (h, params) => {
                                return h('div', params.row._source.highLevelCnt);
                            }
                        },
                        {
                            title: '开放端口数',
                            render: (h, params) => {
                                return h('div', params.row._source.loopholePorCnt);
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            backIpAnalysis() {
                // this.$emit("backIP");
                this.$router.go(-1);
                this.$parent.tabFlag='ipList';
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
            if(CombQueryDataObject!==undefined){
                this.ipDetailDate.uuid=CombQueryDataObject.uuid;
                this.ipDetailDate.ip_position=CombQueryDataObject.ip_position;
                this.ipDetailDate.ip_GeoPosition=CombQueryDataObject.ip_GeoPosition;
                this.ipDetailDate.siteCount=CombQueryDataObject.siteCount;
                this.ipDetailDate.loopholeAllCnt=CombQueryDataObject.loopholeAllCnt || '（无）';
                this.ipDetailDate.loopholeTypeCnt=CombQueryDataObject.loopholeTypeCnt || '（无）';
                this.ipDetailDate.highLevelCnt=CombQueryDataObject.highLevelCnt || '（无）';
                this.ipDetailDate.loopholePorCnt=CombQueryDataObject.loopholePorCnt || '（无）';
                this.ipDetailDate.strIP=CombQueryDataObject.strIP;
            }else{
                this.ipDetailDate.uuid='1.196.127.50';//默认
                this.ipDetailDate.ip_position='（无）';
                this.ipDetailDate.ip_GeoPosition='（无）';
                this.ipDetailDate.siteCount='（无）';
                this.ipDetailDate.loopholeAllCnt='（无）';
                this.ipDetailDate.loopholeTypeCnt='（无）';
                this.ipDetailDate.highLevelCnt='（无）';
                this.ipDetailDate.loopholePorCnt='（无）';
                this.ipDetailDate.strIP='1.196.127.50';//默认
            }
            setTimeout(()=>{
                if(source && source === 'ipAnalysis'){
                    this.$refs.refLoopholeTable.changeParams( {
                        ip: this.ipDetailDate.uuid
                    });
                    this.$refs.refSiteTable.changeParams({queryObj:{
                        strIP: this.ipDetailDate.uuid
                    }});
                }
            },1000);
            //开放端口服务
            _this.$http.get('/api/ssa_port',
                {
                    params: {
                        index: "loophole_result",
                        type: "lph_scan_result",
                        queryObj: {
                            resultHost:  _this.ipDetailDate.strIP
                        },
                        page: 1,
                        size: 100
                    }
                }
            ).then(res => {
                _this.openPortServerTitle='';
                _this.ipDetailDate.openPortServer =res;
                _this.ipDetailDate.openPortServer=_this.ipDetailDate.openPortServer.slice(0,7);//只取前五个
                _this.openPortServerEndList=res.slice(7,res.length);//后面的值
                for(let i=0;i<_this.openPortServerEndList.length;i++){
                    _this.openPortServerTitle+=_this.openPortServerEndList[i]+"/"
                }
            });
            //地图
            _this.$http.get('/api/ssa_table',
                {
                    params: {
                        index: "ipweb_db",
                        type: "ip_geo_info",
                        queryObj: {"uuid": _this.ipDetailDate.uuid},
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
    #ipDetail
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
            height: 330px;

            .cardList{

            }
            ul {
                list-style: none;
                float: left;
                width: 350px;
                overflow: hidden;

                li {
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
                        width: 60%;
                        text-align: left;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }

        }

    }
    .openPort{
        width: 100px;
        float: left;
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
