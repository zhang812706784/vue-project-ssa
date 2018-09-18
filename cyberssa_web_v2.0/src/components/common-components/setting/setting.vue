<template>
  <div class="setting">
    <Dropdown trigger="click" @on-click="goPage">
      <a href="javascript:void(0)">
        <Icon type="ios-gear" size="22" style="color: rgb(73, 80, 96);margin-top: -2px;vertical-align: middle;"></Icon>
        <Icon type="arrow-down-b"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item, index) in settingList" :key="index" :name="item.name">
          {{item.title}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script type="es6">
export default {
  name: 'setting',
  props: {},
  data() {
    return {
      settingList: [
        { title: '用户管理', name: 'userManage' },
        { title: '系统管理', name: 'systemManage' }
      ]
    };
  },
  methods: {
    goPage(item) {
      this.$router.push({
        name: item
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.setting {
  display: inline-block;
  width: 40px;
  height: 100%;
  padding-top: 12px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}
</style>
