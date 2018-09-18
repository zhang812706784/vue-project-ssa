/**
 *Created by zmj on 2018/8/21
 */
import axios from "axios";

export let getAPI1=function () {
    return axios.get("")
}
export let getConfig=function () {
    return axios.get("./config.json")
}
