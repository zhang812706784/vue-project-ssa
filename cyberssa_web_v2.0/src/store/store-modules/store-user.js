import Cookies from 'js-cookie';

const user = {
    state: {
        userName: '',
        pwd: '',
        token: '',
        errorMsg: {
            code: 0,
            msg: '成功'
        }
    },
    mutations: {
        setLocaleStorage (state, obj) {

            localStorage.setItem(obj.key, JSON.stringify(obj.value));

        },
        removeLocaleStorage (state, key) {
            localStorage.removeItem(key);
        },
        login (state, obj) {

            state.userName = obj.userName;
            state.pwd = obj.pwd;
            state.token = obj.token;
            Cookies.set('user', state.userName, {expires: (obj.timeout / 60 / 60 / 24).toFixed(3) * 1});

        },
        logout (state, vm) {

            Cookies.remove('user');
            // Cookies.remove('password');
            Cookies.remove('access');
            Cookies.remove('voucher');

            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');

            themeLink.setAttribute('href', '');

            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';

            if (localStorage.theme) {
                theme = localStorage.theme;
            }

            localStorage.clear();

            if (theme) {
                localStorage.theme = theme;
            }

        },
        // ajax code
        alertErrorMsg (state, obj) {
            state.errorMsg = obj;
        }
    },
    getters: {
        getErrorCode: state => state.errorMsg
    }
};

export default user;
