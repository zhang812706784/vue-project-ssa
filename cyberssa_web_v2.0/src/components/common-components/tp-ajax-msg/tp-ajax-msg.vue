<template>
    <i style="display: none;"></i>
</template>

<script type="es6">

    /**
     * README
     *
     * @author duanyc
     *
     * 该组件用于当 ajax 请求出错时 将出错信息拼接 并且提醒用户
     *
     * 组件监听每次Ajax请求后的 response code ，当出现成功请求以外的code时页面提醒
     *
     * 后续会增加同步储存错误日志
     *
     * */

    import {mapGetters} from 'vuex';

    export default {
        name: 'tp-ajax-msg',
        computed: {
            ...mapGetters([
                'getErrorCode'
            ])
        },
        watch: {
            getErrorCode (data) {
                //右侧错误
                /*if (!Object.is(data.code, 0)) {
                    this.$Notice.error({
                        title: data.msg,
                        desc: `错误代码 ${data.code}`
                    });
                }*/

            }
        }
    };
</script>
