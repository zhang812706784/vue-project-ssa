<template>
  <div class="user-manage">
    <Modal v-model="openDialog" :title="$t(operate && operate === 'add' ?'新增用户' : '修改用户')" @on-ok="ok" @on-cancel="cancel">
      <Form ref="userForm" :model="userFormData" :rules="ruleValidate" label-position="left" :label-width="100">
        <FormItem :label="$t('用户名')" prop="roleType">
          <Input v-model="userFormData.roleType" :placeholder="$t('请输入用户名 2-20位')"  clearable/>
        </FormItem>
        <FormItem :label="$t('登录账号')" prop="name">
          <Input v-model="userFormData.name" :placeholder="$t('请输入账号 5-20位')"  clearable :disabled="operate === 'edit'" />
        </FormItem>
        <FormItem :label="$t('密码')" prop="password">
          <Input v-model="userFormData.password" :placeholder="$t('请输入密码 6-20位')"  clearable/>
        </FormItem>
      </Form>
    </Modal>
    <tp-table ref="userTable" :all_params="userflowlist" @add-btn="add"></tp-table>
    <Modal v-model="confirmDialog" :title="$t('提示')" @on-ok="deleteUser" @on-cancel="cancelDeteleUser">
      <div class="deleteStyle">{{$t('是否要删除登录账号')}} {{operate === 'delete' && selectedUser ? selectedUser._source.name : null}}&nbsp;?</div>
    </Modal>
  </div>
</template>

<script>
import TpTwoStageDrillingPluginFlow from '@/components/locale-components/tp-ssa-echarts/tp-two-stage-drilling-plugin-flow';
import TpTable from '@/components/locale-components/tp-table/tp-table';
import timeFormat from '../filter/timeFormat';

export default {
  name: 'userManage',
  components: {
    TpTable,
    TpTwoStageDrillingPluginFlow
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
        name: [
            {required: true, message: this.$t('登录账号不能为空')},
            {type: 'string', min: 5, message: this.$t('登录账号至少5位')},
            {type: 'string', max: 20, message: this.$t('登录账号最多20位') }
        ],
        roleType: [
            {required: true, message: this.$t('用户名不能为空')},
            {type: 'string', min: 2, message: this.$t('用户名最少2位')},
            {type: 'string', max: 20, message: this.$t('用户名最多20位')}
        ],
        password: [
            {required: true, message: this.$t('密码不能为空')},
            {type: 'string', min: 6, message: this.$t('密码至少6位')},
            {type: 'string', max: 20, message: this.$t('密码至少20位') }
        ]
      }
    };
  },
  created() {
    let token = JSON.parse(window.localStorage.voucher).token;
    this.$http.get('/api/usermgr/user_info',{
        params:{
            token:token,
            _: new Date().getTime()
        }
    }).then(res => {
      this.currentUser = res.data || null;
    });
    this.userflowlist = {
      id: 'user_config_table',
      type: 'table',
      ajaxType: 'post',
      index: true,
      loading: true,
      checkBox: false,
      url: '/api/getUserList',
      data: {
        token: token,
        _: new Date().getTime()
      },
      add_btn: true,
      del_btn: false,
      modify_btn: false,
      cols: [
        {
          title: this.$t('登录账号'),
          render: (h, params) => {
            let { row: { _source: { name } } } = params;
            return h('div', [
              h(
                'span',
                {
                  style: {
                    display:
                      this.currentUser && this.currentUser.name === name
                        ? 'inline-block'
                        : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'red',
                    marginRight: '8px'
                  },
                  domProps: {
                    title: this.$t('[当前用户]')
                  }
                },
                this.$t('[当前用户]')
              ),
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: name
                  }
                },
                name
              )
            ]);
          }
        },
        {
          title: this.$t('用户名'),
          render: (h, params) => {
            let { row: { _source: { roleType } } } = params;
            return h('div', [
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: roleType
                  }
                },
                roleType
              )
            ]);
          }
        },
        {
          title: this.$t('最后修改时间'),
          render: (h, params) => {
            let { row: { _source: { createTime } } } = params;
            return h('div', [
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: createTime
                  }
                },
                timeFormat(parseInt(createTime))
              )
            ]);
          }
        },
        {
          title: this.$t('操作'),
          key: this.$t('操作'),
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params);
                    }
                  }
                },
                this.$t('编辑')
              ),
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.delete(params);
                    }
                  }
                },
                this.$t('删除用户')
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.userForm = this.$refs['userForm'];
    this.userTable = this.$refs['userTable'];
  },
  methods: {
    edit(params) {
      this.operate = 'edit';
      this.openDialog = true;
      this.selectedUser = params.row;
      this.userFormData = JSON.parse(JSON.stringify(this.selectedUser._source));
      this.userFormData.password = null;
    },
    delete(params) {
      this.operate = 'delete';
      this.selectedUser = params.row;
      this.confirmDialog = true;
    },
    add() {
      this.operate = 'add';
      this.userForm.resetFields();
      this.openDialog = true;
    },
    ok() {
      this.userForm.validate(valid => {
        if (valid) {
          let { name, roleType, password, salt, username } = this.userFormData;
          let data, url;
          data = {
            name,
            roleType: roleType,
            asteriskmark: password,
            token: JSON.parse(window.localStorage.voucher).token
          };
          if (this.operate === 'add') {
            data.permitsecret = name;
            url = '/api/regist';
          }
          if (this.operate === 'edit') {
            url = '/api/editorUserMsg';
            data.salt = salt;
            data.id = username;
          }
          this.$http.post(url, data).then(res => {
            if (res.code === 0) {
              setTimeout(() => {
                this.userTable.changeParams();
                this.$Message.success(
                  this.$t(`${this.operate === 'add' ? '添加' : '修改'}成功`)
                );
              }, 1000);
            } else {
              this.$Message.success(
                this.$t(`${this.operate === 'add' ? '添加' : '修改'}失败`)
              );
            }
          });
        }
      });
    },
    deleteUser() {
      this.$http
        .post('/api/deleteUser', {
          userId: this.selectedUser._id,
          token: JSON.parse(window.localStorage.voucher).token
        })
        .then(res => {
          if (res.code === 0) {
            setTimeout(() => {
              this.userTable.changeParams();
              this.$Message.success(this.$t('删除成功!'));
            }, 1000);
          } else {
            this.$Message.success(this.$t('删除失败!'));
          }
        });
    },
    cancel() {
      this.operate = null;
      this.selectedUser = null;
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
