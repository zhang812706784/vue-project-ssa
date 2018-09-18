import store from '@/store';
import axios from 'axios';
import qs from 'qs';
import Map from './code-map/code-map';
import cookie from 'js-cookie';

axios.defaults.timeout = 30000;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = (data, headers) => qs.stringify(data);

// request
axios.interceptors.request.use(
    config => {
        let [reqUrl, url] = [config.url.split('/'), ''];

        url = reqUrl[reqUrl.length - 1];

        /*if (url !== 'login.do') {*/
        if (url !== 'login') {

            const voucher = JSON.parse(localStorage.getItem('voucher'));

            config.headers.Authorization = voucher.token;

        }

        // console.warn('=============================');
        // console.log(cookie.get('user'));
        // console.log(config);
        // console.log(location);

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// response
axios.interceptors.response.use(
    response => {

        /*
        *
        * response format
        *
        * {
        *   code: 0,
        *   data: {},
        *   msg: '成功'
        * }
        *
        * */

        // 如后台返回格式有问题 则不检索，项目接口问题
        if (response.data.data) {

            const res = response.data;

            res.msg = Map[res.code] || '当前错误代码暂未定义';

            if (res.code !== 0) {

                store.commit('alertErrorMsg', {
                    code: res.code,
                    msg: res.msg
                });

            }
        }

        return response.data;

    },
    function (error)  {

        console.log(error);

        if (error.response) {
            switch (error.response.status) {
                case 401:
                // replace
            }
        }
        return Promise.reject(error.response.data);
    }
);

export default axios;
