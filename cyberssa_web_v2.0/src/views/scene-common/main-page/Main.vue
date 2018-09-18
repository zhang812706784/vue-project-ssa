<style lang="less">
    @import "main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">

        <div v-if="!getRouterStatus" class="sidebar-menu-con"
             :style="{width: shrink?'60px':'180px', overflow: shrink ? 'visible' : 'auto'}">

            <div class="logo-container">

                <div v-show="!shrink" class="unShrink-logo">

                    <a href="javascript:;">
                        logo
                    </a>

                    <div class="unShrink-logo-text">
                        <span>{{ getOriginMenu.projectDetail.name }}</span>
                        <span>{{ getOriginMenu.projectDetail.scene }}</span>
                    </div>

                </div>

                <img v-show="shrink" style="margin: 0 auto" src="../../../../static/images/logo-min.png"
                     key="min-logo"/>

            </div>

            <div class="menu-container">
                <!-- :dis-scroll-y="shrink" -->
                <scroll-bar ref="scrollBar" dis-scroll-x>
                    <shrinkable-menu
                            :shrink="shrink"
                            @on-change="handleSubmenuChange"
                            :theme="menuTheme"
                            :before-push="beforePush"
                            :open-names="openedSubmenuArr"
                            :menu-list="menuList">
                    </shrinkable-menu>
                </scroll-bar>

            </div>

        </div>

        <div class="main-header-con"
             :style="{paddingLeft: shrink?'60px':'180px',height: pageConfig.moreFrames ? '89px' : '49px'}">

            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                            @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con" style="padding-right:150px;width:auto">

                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>

                    <!--<lock-screen></lock-screen>-->

                    <message-tip v-model="mesCount"></message-tip>

                    <!--<theme-switch></theme-switch>-->

                    <setting></setting>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">

                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    <DropdownItem name="ownSpace">修改密码</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>

            <div class="tags-con" v-if="pageConfig.moreFrames">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>

        </div>

        <div class="single-page-con"
             :style="{left: shrink?'60px':'180px', top: pageConfig.moreFrames ? '89px' : '49px'}">
            <div class="single-page">
                <!--<keep-alive :include="cachePage">-->
                    <router-view v-if="$store.state.app.isRouteAlive"></router-view>
                <!--</keep-alive>-->
            </div>
        </div>

        <tp-ajax-msg></tp-ajax-msg>

    </div>
</template>
<script>
    import shrinkableMenu
        from '@/components/locale-components/iview-admin/main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from '@/components/locale-components/iview-admin/main-components/tags-page-opened.vue';
    import breadcrumbNav from '@/components/locale-components/iview-admin/main-components/breadcrumb-nav.vue';
    import fullScreen from '@/components/locale-components/iview-admin/main-components/fullscreen.vue';
    import lockScreen from '@/components/locale-components/iview-admin/main-components/lockscreen/lockscreen.vue';
    import messageTip from '@/components/locale-components/iview-admin/main-components/message-tip.vue';
    import themeSwitch
        from '@/components/locale-components/iview-admin/main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import scrollBar from '@/components/locale-components/iview-admin/scroll-bar/vue-scroller-bars/index';

    import {mapGetters} from 'vuex';
    import Config from '@/main-config';
    import TpAjaxMsg from '@/components/common-components/tp-ajax-msg/tp-ajax-msg';
    import setting from '../../../components/common-components/setting/setting';

    export default {
        components: {
            TpAjaxMsg,
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch,
            scrollBar,
            setting
        },
        data () {
            return {
                pageConfig: Config,
                objectDom: '',
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                menuList: []
            };
        },
        computed: {
            ...mapGetters([
                'getRouterStatus',
                'getOriginMenu',
                'getMenuList',
                'getPriMenu'
            ]),
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            openedSubmenuArr () {

            }
        },

        methods: {
            reload () {
                this.$store.commit('setIsRouteAlive', false);

                this.$nextTick(() => {
                    this.$store.commit('setIsRouteAlive', true);
                })
            },
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {
                this.shrink = !this.shrink;
                this.openedSubmenuArr = [];
                setTimeout(() => {
                    this.scrollBarResize();
                    this.resizeObject();
                }, 300);
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');

                    /* this.$store.commit('setIsRouteAlive', true); */
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                    this.reload();
                } else if (name === 'loginout') {

                    // 给后台发送退出登录请求，后台切断后台的session
                    this.$http.get('/apis/api/user/logout').then(res => {
                        // 退出登录
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        this.$router.push({
                            name: 'login'
                        });
                    });


                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.warn(`============ change menu ============`);
                // console.log(val);
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            scrollBarResize () {
                this.$refs.scrollBar.resize();
            },
            resizeObject () {
                this.objectDom.contentDocument.defaultView.addEventListener('resize', () => {
                    this.scrollBarResize();
                });
            }
        },
        mounted () {

            this.init();

            window.addEventListener('resize', this.scrollBarResize);

            this.objectDom = document.querySelector('object');

            this.resizeObject();

            this.$store.commit('setPriMenu');
            /* this.menuList = !Config.defaultMenu ? this.getOriginMenu.router : this.getMenuList; */
            this.menuList = !Config.defaultMenu ? this.getPriMenu.router : this.getMenuList;

        },
        created () {

            this.$store.commit('setOpenedList');

        },
        dispatch () {
            window.removeEventListener('resize', this.scrollBarResize);
        }
    };
</script>
