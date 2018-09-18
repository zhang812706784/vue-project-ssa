<style lang="less">
    @import "./home.less";
    @import "../../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="24">
                <Row :gutter="5">

                    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
                        <!--<Button size="large" type="primary" @click="testEvent">点击</Button>-->
                    <!--</Col>-->

                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                                id-name="user_created_count"
                                :end-val="count.createUser"
                                iconType="android-person-add"
                                color="#2d8cf0"
                                intro-text="今日新增用户"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                                id-name="visit_count"
                                :end-val="count.visit"
                                iconType="ios-eye"
                                color="#64d572"
                                :iconSize="50"
                                intro-text="今日浏览量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                                id-name="collection_count"
                                :end-val="count.collection"
                                iconType="upload"
                                color="#ffd572"
                                intro-text="今日数据采集量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                                id-name="transfer_count"
                                :end-val="count.transfer"
                                iconType="shuffle"
                                color="#f25e43"
                                intro-text="今日服务调用量"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            今日服务调用地理分布
                        </p>
                        <div class="map-con">
                            <Col span="10">
                                <map-data-table :cityData="cityData" height="281"
                                                :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="14" class="map-incon">
                                <Row type="flex" justify="center" align="middle">
                                    <home-map :city-data="cityData"></home-map>
                                </Row>
                            </Col>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        数据来源统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        各类用户服务调用变化统计
                    </p>
                    <div class="data-source-row">
                        <user-flow></user-flow>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    上周每日服务调用量(万)
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row>
    </div>
</template>

<script>
    import cityData from './map-data/get-city-value.js';
    import homeMap from './components/map.vue';
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    import serviceRequests from './components/serviceRequests.vue';
    import userFlow from './components/userFlow.vue';
    import countUp from './components/countUp.vue';
    import inforCard from './components/inforCard.vue';
    import mapDataTable from './components/mapDataTable.vue';
    import toDoListItem from './components/toDoListItem.vue';

    export default {
        name: 'home',
        components: {
            homeMap,
            dataSourcePie,
            visiteVolume,
            serviceRequests,
            userFlow,
            countUp,
            inforCard,
            mapDataTable,
            toDoListItem
        },
        data () {
            return {
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                cityData: cityData,
                showAddNewTodo: false,
                newToDoItemValue: ''
            };
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        methods: {

            testEvent () {

                // console.log(this.$store.state.app.routers = []);

                // this.$store.commit('RewriteConfigFile', 'test');

                // console.log(this.$router);

                // this.$router.options.routes.push(
                //     {
                //         path: '/router2',
                //         icon: 'icon-shangwanghangweiganzhi',
                //         title: '页面2-测试页面',
                //         name: 'testPage',
                //         component: Main,
                //         children: [
                //             {
                //                 path: 'index',
                //                 title: '测试页面',
                //                 name: 'testPage_index',
                //                 component: () => import('@/views/testPage/test-page.vue')
                //             }
                //         ]
                //     }
                // );

                // const routerP = [{
                //     path: '/router2',
                //     icon: 'icon-shangwanghangweiganzhi',
                //     title: '页面2-测试页面',
                //     name: 'router2-testPage',
                //     component: Main,
                //     children: [
                //         {
                //             path: 'index',
                //             title: '测试页面',
                //             name: 'router2_testPage_index',
                //             component: () => import('@/views/testPage/test-page.vue')
                //         }
                //     ]
                // }];

                // this.$router.options.routes.push(routerP[0]);

                // this.$router.addRoutes(routerP);

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
                }).then(res => {
                    console.log(res);
                })

            }

        }
    };
</script>
