<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu id="menuDomId" ref="sideMenu" :accordion="true" :active-name="$route.name" :open-names="openNames"
          :class="checkMenuType"
          :theme="menuTheme"
          width="auto"
          @on-select="changeMenu"
          @on-open-change="selectOpen">

        <template v-for="item in menuList">
         
            <!-- 三级菜单 -->
            <template v-if="!projectConfig.defaultMenu">

                <MenuGroup class="testGroup" :title="itemTitle(item)">

                    <template v-if="item.children.length > 0" v-for="secondMenu in item.children">

                        <MenuItem v-if="secondMenu.children.length <= 1" :name="secondMenu.children[0].name"
                                  :key="'menuitem' + secondMenu.name">

                            <i class="iconfont" :class="secondMenu.children[0].icon || secondMenu.icon"></i>

                            <span class="layout-text"
                                  :key="'title' + secondMenu.name">{{ itemTitle(secondMenu.children[0]) }}</span>

                        </MenuItem>

                        <Submenu v-else :name="secondMenu.name" :key="secondMenu.name">

                            <template slot="title">

                                <!--<span class="position-hr">-->
                                    <!--<Icon type="ios-minus-empty"></Icon>-->
                                <!--</span>-->

                                <i class="iconfont" :class="secondMenu.children[0].icon || secondMenu.icon"></i>

                                <span class="layout-text">{{ itemTitle(secondMenu)}}</span>

                                <Icon class="ivu-menu-submenu-title-icon" :key="'icon' + secondMenu.name"
                                      :type="currentSelect === secondMenu.name ? menuSelectIcon : 'ios-plus-empty'"
                                      size="16"></Icon>

                            </template>

                            <template v-for="childItem in secondMenu.children">

                                <MenuItem v-if="!childItem.hideInMenu" :name="childItem.name" :key="'menuitem' + childItem.name"
                                          style="padding-left: 25px;">

                                    <!--<Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>-->

                                    <span class="position-hr">
                                    <Icon type="ios-minus-empty"></Icon>

                                </span>

                                    <span class="layout-text"
                                          :key="'title' + childItem.name">{{ itemTitle(childItem) }}</span>

                                </MenuItem>
                            </template>

                        </Submenu>

                    </template>

                </MenuGroup>

            </template>

            <!-- ------------------------------------------------------------------- -->

            <!-- 二级菜单 -->
            <template v-else>
           
                <MenuItem v-if="item.children.length <= 1" :name="item.children[0].name" :key="'menuitem' + item.name">

                    <i class="iconfont" :class="item.children[0].icon || item.icon"></i>

                    <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>

                </MenuItem>

                <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">

                    <template slot="title">

                        <span class="iconfont" :class="item.icon" style="margin-right: 6px"></span>

                        <span class="layout-text">{{ itemTitle(item) }}</span>

                        <Icon class="ivu-menu-submenu-title-icon" :key="'icon' + item.name"
                              :type="currentSelect === item.name ? menuSelectIcon : 'ios-plus-empty'"
                              size="16"></Icon>

                    </template>

                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="'menuitem' + child.name">

                            <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>

                        </MenuItem>
                    </template>

                </Submenu>

            </template>

        </template>

    </Menu>
</template>

<script>
    import Config from '@/main-config';

    export default {
        name: 'sidebarMenu',
        data () {
            return {
                checkMenuType: 'hide-dropdown-arrow',
                projectConfig: Config,
                menuSelectIcon: 'ios-plus-empty',
                currentSelect: ''
            };
        },
        props: {
            menuList: Array,
            iconSize: Number,
            menuTheme: {
                type: String,
                default: 'dark'
            },
            openNames: {
                type: Array
            }
        },
        methods: {
            changeMenu (active) {
                this.$emit('on-change', active);
            },
            itemTitle (item) {
                if (typeof item.title === 'object') {
                    return this.$t(item.title.i18n);
                } else {
                    return item.title;
                }
            },
            selectOpen (name) {

                this.currentSelect = name[0];

                this.menuSelectIcon = name.length === 0 ? 'ios-plus-empty' : 'ios-minus-empty';

            },
            appendObjectDom () {

                const obj = document.createElement('object');

                obj.setAttribute('style',
                    `display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%;
                overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;`
                );
                obj.type = 'text/html';
                obj.data = 'about:blank';

                document.querySelector('#menuDomId').appendChild(obj);

            }
        },
        mounted () {
            
            this.appendObjectDom();

        },
        updated () {
            this.$nextTick(() => {
                if (this.$refs.sideMenu) {
                    this.$refs.sideMenu.updateOpened();
                }
            });
        }

    };
</script>
