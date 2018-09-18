var fs = require('fs');
var path = require('path');

// 获取本机ip
const getIPAddress = () => {

    let interfaces = require('os').networkInterfaces();

    for (let devName in interfaces) {

        let iFace = interfaces[devName];

        for (let i = 0; i < iFace.length; i++) {
            let alias = iFace[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) return alias.address;
        }

    }
};

function func_GetBaseconfig(srcbaseconfigPath) {
    var requirPath='tmp_cy.js';
    var baseconfigPath='./config/'+requirPath;
    var jsSrcString;

    if( !fs.existsSync(srcbaseconfigPath) ){
        console.log( srcbaseconfigPath + " not exist!");
        return {};
    }
    else {
        jsSrcString=fs.readFileSync(srcbaseconfigPath);
    }

    /*复制config_base.js文件*/
    fs.writeFileSync(baseconfigPath, jsSrcString+"" );
    /*判断文件是否一致*/
    var jsDstString=fs.readFileSync(baseconfigPath);
    if( jsDstString+"" != jsSrcString+"" )
    {
        console.log( "The file "+ baseconfigPath + " must be the copy of " + srcbaseconfigPath + "!");
        process.exit();
    }
    return require("./"+requirPath);
}

var paths = path.resolve(__dirname,'./../../cyberssa_backend/config/config_base.js')
var config=func_GetBaseconfig(paths);

config.cr_log=function( strMessage1,strMessage2) {
    console.log("###["+__pfilename+":"+ __pline+"]###");
    if( strMessage1 ) {console.log(strMessage1);}
    if( strMessage2 ) {console.log(strMessage2);}
};

config.config_for_ui={
    development: true,
    host: "localhost",
    port: 8421,
    /* defaultRouter: 'clouddc', */
    defaultRouter: 'mgdemo',
    moreFrames: false,
    defaultMenu: false,
    proxy: {
        /* '/api': {
            target:'https://localhost:9999',
            // target: 'https://172.20.23.123:9999',
            // target: 'https://172.20.23.124:9999',
            //target: 'https://192.168.115.27:9999',
            // target: 'https://172.20.22.26:9999',
            pathRewrite: {'^/api': ''},
            changeOrigin: true,
            secure: false
        }, */
        '/apis': {
            target: 'http://192.168.51.106:80',
            pathRewrite: {'^/apis': ''},
            changeOrigin: true,
            secure: false
        },
        '/ssa/java': {
            target: 'http://localhost:8090',
            pathRewrite: {'^/ssa/java': ''},
            changeOrigin: true,
            secure: false
        }
    }
};

/* config_for_ui局部调整 */
function func_ModifyConfigForUi() {
    if (config.Ptype) {
        config.config_for_ui.defaultRouter = config.Ptype;
    }
    config.config_for_ui.host = getIPAddress();


    /* if( config.config_for_ui.proxy['/api'].target === 'https://locahost:9999'){
        config.config_for_ui.proxy['/api'].target = "https://"+getIPAddress()+":9999";
    } */
    if (config.config_for_ui.proxy['/apis'].target === 'http://192.168.51.106:80') {
        config.config_for_ui.proxy['/apis'].target = "http://192.168.51.106:80";
    }
    if (config.config_for_ui.proxy['/ssa/java'].target === 'http://locahost:8090') {
        config.config_for_ui.proxy['/ssa/java'].target = "http://" + getIPAddress() + ":8090";
    }
    console.log(config.config_for_ui.proxy['/apis'].target);
    fs.writeFileSync("./config/.tmp_config.json", JSON.stringify(config.config_for_ui,null,4));
    config.mainConfig = require('../src/main-config');
}

/* config_for_ui局部调整 */
func_ModifyConfigForUi();

module.exports = config;

