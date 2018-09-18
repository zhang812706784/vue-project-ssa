/**
 * Created by duanyc on 2018/7/31
 */

/**
 * 配置字段
 *
 * development   :  当前是否为开发模式   ->> true or false
 * host          :  ip                 ->> 直接填写 IP 或 getIPAddress()
 * port          :  端口               ->> 直接填写
 * defaultRouter :  当前路由场景        ->> 修改后重新运行项目 将会覆盖所选路由配置至 /src/router/router-env/env.js
 * moreFrames    :  是否多级文档显示    ->> false or true
 * defaultMenu   :  是否默认菜单        ->> 默认菜单为二级菜单，如填写 false 则菜单将会渲染成三级菜单
 * proxy         :  服务代理           ->> 按照样例编写
 *
 * */

let Config = require("../../config/.tmp_config.json");
module.exports = Config;
