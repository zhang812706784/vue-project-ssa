<template>
    <div>

        <template v-for="(item, index) in menuList">

            <!-- 三级菜单 -->
            <template v-if="!pageConfig.defaultMenu">

                <div class="shrink-menu"
                     style="text-align: center"
                     :key="index"
                     :style="{borderBottom:menuList.length - 1 === index ? '' : '0.6px solid rgba(136, 136, 136, .8)'}">

                    <template v-for="childItem in item.children">

                        <Dropdown transfer
                                  v-if="childItem.children.length !== 1"
                                  placement="right-start"
                                  @on-click="changeMenu">

                            <Button class="shrink-menu-button" type="text"
                                    style="width: 70px;margin-left: -5px;padding:10px 0;">

                                <span class="iconfont" :class="childItem.icon"></span>

                                <!--<span><Icon type="ios-minus -empty"></Icon></span>-->

                            </Button>

                            <DropdownMenu style="width: 200px;" slot="list">

                                <template v-for="(child, i) in childItem.children">
                                    <DropdownItem :name="child.name" :key="i">

                                        <span style="padding-left:10px;">{{ itemTitle(child) }}</span>

                                    </DropdownItem>
                                </template>

                            </DropdownMenu>

                        </Dropdown>

                        <Dropdown transfer v-else placement="right-start" @on-click="changeMenu">

                            <Button @click="changeMenu(childItem.children[0].name)"
                                    style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">

                                <span class="iconfont" :class="childItem.children[0].icon || childItem.icon"
                                      style="color: #B9C1C9;"></span>

                            </Button>

                            <DropdownMenu style="width: 200px;" slot="list">

                                <DropdownItem :name="childItem.children[0].name" :key="'d' + index">

                                    <!--<span class="iconfont" :class="item.children[0].icon || item.icon"></span>-->

                                    <span style="padding-left:10px;">{{ itemTitle(childItem.children[0]) }}</span>

                                </DropdownItem>

                            </DropdownMenu>

                        </Dropdown>

                    </template>

                </div>

            </template>

            <!-- 二级菜单 -->
            <template v-else>

                <div class="shrink-menu" style="text-align: center;" :key="index">

                    <Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index"
                              @on-click="changeMenu">

                        <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">

                            <!--<Icon :size="20" :color="iconColor" :type="item.icon"></Icon>-->

                            <span class="iconfont" :class="item.icon"></span>

                            <!--<span class=""><Icon type="ios-minus-empty"></Icon></span>-->

                        </Button>

                        <DropdownMenu style="width: 200px;" slot="list">

                            <template v-for="(child, i) in item.children">
                                <DropdownItem :name="child.name" :key="i">
                                    <!--<Icon :type="child.icon"></Icon>-->
                                    <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                                </DropdownItem>
                            </template>

                        </DropdownMenu>

                    </Dropdown>

                    <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">

                        <Button @click="changeMenu(item.children[0].name)"
                                style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">

                            <!--<Icon :size="20" :color="iconColor" :type="item.children[0].icon || item.icon"></Icon>-->

                            <span class="iconfont" :class="item.children[0].icon || item.icon"
                                  style="color: #B9C1C9;"></span>

                        </Button>

                        <DropdownMenu style="width: 200px;" slot="list">

                            <DropdownItem :name="item.children[0].name" :key="'d' + index">

                                <!--<Icon :type="item.children[0].icon || item.icon"></Icon>-->

                                <!--<span class="iconfont" :class="item.children[0].icon || item.icon"></span>-->

                                <span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>

                            </DropdownItem>

                        </DropdownMenu>

                    </Dropdown>

                </div>

            </template>

        </template>

    </div>
</template>

<script>
    import Config from '@/main-config';

    export default {
        name: 'sidebarMenuShrink',
        data () {
            return {
                pageConfig: Config,
            };
        },
        props: {
            menuList: {
                type: Array
            },
            iconColor: {
                type: String,
                default: 'white'
            },
            menuTheme: {
                type: String,
                default: 'darck'
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
            }
        }
    };
</script>

<style lang="less">

    .shrink-menu {

        .ivu-btn-text {
            color: #D0D4D8;
        }

        .shrink-menu-button {
            /*background-color: blueviolet;*/
        }

    }

</style>
