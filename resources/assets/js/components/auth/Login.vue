<template>
    <div class="login-register"
         style="width: 950px;margin:100px auto 0 auto;background: #ffffff;overflow: hidden;border: 1px solid #fff; border-radius: 10px">
        <el-container>
            <div style="width: 500px;padding: 50px 50px 0 50px;">
                <el-tabs
                        v-model="active"
                        id="form"
                        @tab-click="handleTabClick">
                    <el-tab-pane label="登录" name="/login">
                        <el-form
                                :model="formLogin"
                                status-icon
                                :rules="formLoginRules"
                                ref="formLogin"
                                class="demo-ruleForm">
                            <div style="margin-top: 30px">

                                <el-form-item
                                        prop="phone">
                                    <el-input
                                            placeholder="请输入账号"
                                            prefix-icon="icon-user-o"
                                            v-model="formLogin.name">
                                    </el-input>
                                </el-form-item>
                                <el-form-item
                                        :error="loginPasswordErrorMessage"
                                        prop="password">
                                    <el-input
                                            type="password"
                                            placeholder="请输入密码"
                                            prefix-icon="icon-lock-o"
                                            v-model="formLogin.password">
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-button
                                                    type="primary"
                                                    @click="handleSubmitLoginForm('form')"
                                                    style="width: 100%">
                                                确认
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </div>
                        </el-form>

                    </el-tab-pane>
                </el-tabs>
            </div>

            <div>
                <img src="" alt="" style="height: 350px;display: block;">
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Login",
        computed: {
            active: {
                get: function () {
                    return this.$route.path;
                },
                set: function () {
                }
            },
        },
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formRegister.password) {
                    callback(new Error('密码确认错误!'));
                } else {
                    callback();
                }
            };
            return {
                loginPasswordErrorMessage: '',
                formLogin: {
                    name: '',
                    password: '',
                },
                formLoginRules: {
                    name: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                formRegisterRules: {
                    name: [
                        {required: true, message: '请输入', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password_confirmation: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            handleTabClick(tab, event) {
                sessionStorage.setItem('loginRegisterActive', tab.name);
                this.$router.push(tab.name);
            },
            // 提交登录表单
            handleSubmitLoginForm() {
                this.$refs.formLogin.validate((valid) => {
                    if (valid) {
                        this.loginPasswordErrorMessage = '';
                        // this.formLogin.password = encrypt(this.formLogin.password);
                        this.$api.login(this.formLogin).then(res => {
                            if (res.status === 1) {
                                console.log(res.data);
                                // sessionStorage.setItem('token', res.data.token);
                                // sessionStorage.setItem('success', 'success');
                                sessionStorage.setItem('name', res.data);
                                this.$router.push({name:'index', query:{}});
                            } else {
                                this.$message.error(res.message);
                                // this.loginPasswordErrorMessage = res.message;
                                this.formLogin.password = '';
                            }
                        }).catch((error) => {
                            this.formLogin.password = '';
                        });
                    }
                });
            },
        },
        created() {
            // this.initLoginCaptcha();
            // this.initRegisterCaptcha();
        }
    }
</script>

<style lang="less">
    .geetest_holder.geetest_mobile.geetest_ant .geetest_slider .geetest_slider_track .geetest_slider_tip.geetest_multi_slide {
        word-wrap: break-word !important;
        white-space: normal !important;
        text-align: left !important;
        font-size: 12px !important;
        line-height: 40px !important
    }

    .geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_logo {
        width: 0 !important;
    }

    .geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_copyright_tip {
        margin: 0 !important;
    }

    .login-register {
        .el-input__inner {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #f0f2f5
        }

        .el-input__prefix .el-input__icon {
            font-size: 26px;
        }

        .icon-youxiang {
            font-size: 20px;
        }

        /*@keyframes move_wave {*/
        /*0% {*/
        /*transform: translateX(0) translateZ(0) scaleY(1)*/
        /*}*/
        /*50% {*/
        /*transform: translateX(-25%) translateZ(0) scaleY(0.55)*/
        /*}*/
        /*100% {*/
        /*transform: translateX(-50%) translateZ(0) scaleY(1)*/
        /*}*/
        /*}*/
        /*.waveWrapper {*/
        /*overflow: hidden;*/
        /*position: absolute;*/
        /*left: 0;*/
        /*right: 0;*/
        /*!*bottom: 0;*!*/
        /*top: 0;*/
        /*margin: auto;*/
        /*width: 1000px;*/
        /*height: 100px;*/
        /*}*/
        /*.waveWrapperInner {*/
        /*position: absolute;*/
        /*width: 100%;*/
        /*overflow: hidden;*/
        /*height: 100%;*/
        /*bottom: -1px;*/
        /*background-image: linear-gradient(to top, #fd6019 20%, #fd6019 80%);*/
        /*}*/
        /*.bgTop {*/
        /*z-index: 15;*/
        /*opacity: 0.5;*/
        /*}*/
        /*.bgMiddle {*/
        /*z-index: 10;*/
        /*opacity: 0.75;*/
        /*}*/
        /*.bgBottom {*/
        /*z-index: 5;*/
        /*}*/
        /*.wave {*/
        /*position: absolute;*/
        /*left: 0;*/
        /*width: 200%;*/
        /*height: 100%;*/
        /*background-repeat: repeat no-repeat;*/
        /*background-position: 0 bottom;*/
        /*transform-origin: center bottom;*/
        /*}*/
        /*.waveTop {*/
        /*background-size: 50% 100px;*/
        /*}*/
        /*.waveAnimation .waveTop {*/
        /*animation: move-wave 3s;*/
        /*-webkit-animation: move-wave 3s;*/
        /*-webkit-animation-delay: 1s;*/
        /*animation-delay: 1s;*/
        /*}*/
        /*.waveMiddle {*/
        /*background-size: 50% 120px;*/
        /*}*/
        /*.waveAnimation .waveMiddle {*/
        /*animation: move_wave 10s linear infinite;*/
        /*}*/
        /*.waveBottom {*/
        /*background-size: 50% 100px;*/
        /*}*/
        /*.waveAnimation .waveBottom {*/
        /*animation: move_wave 15s linear infinite;*/
        /*}*/
    }
</style>
