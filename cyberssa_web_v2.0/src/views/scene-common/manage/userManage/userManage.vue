<template>
  <div class="user-manage">
    <Modal v-model="openDialog" :title="$t('修改密码')" @on-ok="ok" @on-cancel="cancel">
      <Form ref="userForm" :model="userFormData" :rules="ruleValidate" label-position="left" :label-width="100">
        <FormItem :label="$t('用户名')" prop="roleType">
          <Input v-model="userFormData.roleType"  disabled  clearable/>
        </FormItem>
        <FormItem :label="$t('密码')" prop="password">
          <Input v-model="userFormData.password"  clearable/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
    import Cookies from 'js-cookie';

export default {
  name: 'userManage',
  components: {
  },
  data: function() {
    return {
      confirmDialog: false,
      openDialog: false,
      userflowlist: {},
      selectedUser: null,
      userFormData: {
        name: null,
        roleType: null,
        password: null
      },
      currentUser: null,
      operate: null,
      ruleValidate: {
        roleType: [
            {required: true, message: this.$t('用户名不能为空')}
        ],
        password: [
            {required: true, message: this.$t('密码不能为空')}
        ]
      }
    };
  },
  created() {
  },
  mounted() {
    this.userForm = this.$refs['userForm'];
    this.userTable = this.$refs['userTable'];
    this.openDialog = true;
    this.userFormData.roleType = Cookies.get('user');
    this.userFormData.password = null;
  },
  methods: {
      ok() {
        let { password,username } = this.userFormData;
        let data, url;
        let _this = this;
        data = {
            /* roleType: roleType, */
            password: password
            /* token: JSON.parse(window.localStorage.voucher).token */
        };

        url = '/apis/api/user/resetpass';

        this.$http.post(url, data).then(res => {
            // 给后台发送退出登录请求，后台切断后台的session
            _this.$http.get('/apis/api/user/logout').then(res => {
                // 退出登录
                _this.$store.commit('logout', _this);
                _this.$store.commit('clearOpenedSubmenu');
                _this.$router.push({
                    name: 'login'
                });
            });

        });
    },
    cancel() {
      this.operate = null;
      this.selectedUser = null;
        this.$router.push({
            name: 'home_index'
        });
    },
    cancelDeteleUser() {
      this.selectedUser = null;
    }
  }
};
</script>
<style lang="less">
  .deleteStyle{
    color:#fff;
    font-size:14px;
  }
</style>
