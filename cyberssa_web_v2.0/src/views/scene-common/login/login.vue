<style lang="less">
    @import 'login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">

        <div class="login-con">

            <Card :bordered="false">

                <div class="header" slot="title">

                    <div class="logo-container">
                        <span></span>
                    </div>

                    <span class="detail">工业蜜罐</span>

                </div>

                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">

                            <Input v-model="form.userName" placeholder="请输入用户名" icon="person">
                            <!--<span slot="prepend">-->
                            <!--<Icon :size="16" type="person"></Icon>-->
                            <!--</span>-->
                            </Input>

                        </FormItem>

                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" icon="locked">
                            <!--<span slot="prepend">-->
                            <!--<Icon :size="14" type="locked"></Icon>-->
                            <!--</span>-->
                            </Input>
                        </FormItem>

                        <FormItem class="btn-container">
                            <Button @click="handleSubmit" @keyup.enter="handleSubmit" size="large" type="primary" long>
                                登录
                            </Button>
                        </FormItem>

                    </Form>
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                </div>

            </Card>

        </div>

        <tp-ajax-msg></tp-ajax-msg>

    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import TpAjaxMsg from '../../../components/common-components/tp-ajax-msg/tp-ajax-msg';

    export default {
        components: {TpAjaxMsg},
        data () {
            return {
                form: {
                    userName: 'zhang',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {

                        //因为没有接口暂时将登录写成死的

                            let res = {
                                "code": 0,
                                "data": {
                                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6IjY5ZDlhMiIsInBhc3N3b3JkIjoiZDIyZTdkYmQ4OWFiN2NmZmRlY2E0NzIzYjM2OWJlOWEiLCJyb2xlVHlwZSI6Iuezu-e7n-euoeeQhuWRmCIsImNyZWF0ZVRpbWUiOjE1MzY4OTE5MjQzODAsInNhbHQiOiJxV2FpRXM0WHRja1N1aVdPIiwiaWF0IjoxNTM2ODkxOTI0LCJleHAiOjE1MzY4OTU1MjR9.moK2WpV5ZQMNWBFEv8lDfICLjrL1tDrsoqTlE4o8plM",
                                    "timeout": 3600,
                                    "access": 2
                                },
                                "msg": "登陆成功"
                            };

                            this.$store.commit('setPriAccess', 2);

                            this.$store.commit('login', {
                                timeout: res.data.timeout,
                                userName: this.form.userName,
                                pwd: this.form.password,
                                token: res.data.token
                            });

                            this.$store.commit('setLocaleStorage', {
                                key: 'voucher',
                                value: {
                                    timeout: res.data.timeout,
                                    token: res.data.token
                                }
                            });

                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                            Cookies.set('access', res.data.access);

                            this.$router.push({
                                name: 'home_index'
                            });

                            return;

                            //这里是真正的登录
                        this.$http.post('/apis/api/user/login', {
                            username: this.form.userName,  // 用户名暂时写死
                            password: this.form.password // 密码暂时写死

                        }).then(response => {

                            console.warn(`============ success ============`);

                            console.log(response);
                            if (response.code === 0) {
                                // 暂时性用态势感知的token,后台没有返回token
                                let res = {
                                    "code": 0,
                                    "data": {
                                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6IjY5ZDlhMiIsInBhc3N3b3JkIjoiZDIyZTdkYmQ4OWFiN2NmZmRlY2E0NzIzYjM2OWJlOWEiLCJyb2xlVHlwZSI6Iuezu-e7n-euoeeQhuWRmCIsImNyZWF0ZVRpbWUiOjE1MzY4OTE5MjQzODAsInNhbHQiOiJxV2FpRXM0WHRja1N1aVdPIiwiaWF0IjoxNTM2ODkxOTI0LCJleHAiOjE1MzY4OTU1MjR9.moK2WpV5ZQMNWBFEv8lDfICLjrL1tDrsoqTlE4o8plM",
                                        "timeout": 3600,
                                        "access": response.data
                                    },
                                    "msg": "登陆成功"
                                };

                                this.$store.commit('setPriAccess', response.data);

                                this.$store.commit('login', {
                                    timeout: res.data.timeout,
                                    userName: this.form.userName,
                                    pwd: this.form.password,
                                    token: res.data.token
                                });

                                this.$store.commit('setLocaleStorage', {
                                    key: 'voucher',
                                    value: {
                                        timeout: res.data.timeout,
                                        token: res.data.token
                                    }
                                });

                                this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                                Cookies.set('access', res.data.access);

                                this.$router.push({
                                    name: 'home_index'
                                });

                            }

                        });

                    }
                });
            }
        }
    };
</script>
