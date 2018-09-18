/**
 * Created by duanyc on 2018/8/13
 */

const tool = {};

// 地图方法处理 老代码复制来的 稍作修改 勿动
tool.map = {

    /**
     * 生成地图上线两端的地理位置坐标数组:线属性
     * @param data
     * @returns {Array}
     * 格式[{"value":152,"coords":[[-10.1,110.33],[-10.1,110.33]]},
     *      {"value":152,"coords":[[-10.1,110.33],[-10.1,110.33]]},
     *      {"value":152,"coords":[[-10.1,110.33],[-10.1,110.33]]},
     *      ]
     */
    getLineList: (data) => {

        let coord_data = [];

        let dictlines = data.lines;

        for (let key in dictlines) {

            let strLineText = key + ':<br>';
            let dictTuple = dictlines[key].tuple;

            for (let subkey in dictTuple) {
                strLineText += dictTuple[subkey][0] + '->' + dictTuple[subkey][1] + ':' + dictTuple[subkey][2] + '<br>';
            }

            coord_data.push({
                name: strLineText,
                // value:dictlines[key].weight,
                coords: dictlines[key].coords, //坐标数据
                // label:{
                //     normal:{
                //         show:false,
                //         position:"middle",
                //         formatter:'{b}'
                //     }
                // }
            });

        }

        return coord_data;
    },

    /**
     * 生成地图上各个点的属性(的地名词与权值的对应关系)
     * 数据格式
     * {
     *    showSymbol:true,
     *    name: points[i].name,   （地名）
     *    value: points[i].value, （地理位置经纬度）
     *    symbolSize: 10 + points[i].weight/1000,
     *    itemStyle: {
     *        normal: {color: '#FFD24D'},
     *        emphasis: {label:{position:'top'}}
     *    }
     * }
     * @param data
     * @returns {Array}
     */

    getPointList: (listOptionSeries, data, max, min) => {
        let dictPoints = data.points;
        let tGeoDt = listOptionSeries;

        function scalLevel (data) {
            let level = (data / max).toFixed(1);
            level = level * 5 + 5;

            return level;
        }

        for (let name in dictPoints) {

            tGeoDt.push({
                // showSymbol:true,
                // name: name, /*地名*/
                // value: dictPoints[name].coord,  /*地理位置经纬度*/
                // symbolSize: 10 + dictPoints[name].src_weight/10,/*权值*/
                // itemStyle: {
                //     normal: {
                //         color: '#FFD24D'
                //     },
                //     emphasis: {
                //         label:{position:'top'}
                //     }
                // },
                // tooltip:{
                //     enterable:true,//显示可见
                //     // formatter:tGeoDt[0].symbolSize//getSymbolSize(dictPoints)
                //     formatter:function () {//格式化输出symbolSize的大小
                //         return parseInt(tGeoDt[0].symbolSize);  //tGeoDt[0].symbolSize  dictPoints[name].src_weight
                //     }
                // }
                ///////////////////////////////////////////////////////////////////////////////////
                /*散射效果系列参数*/
                // {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 1,

                // effectType:"ripple",
                // showEffectOn:"render",
                rippleEffect: {
                    period: 3, /*散射频率*/
                    // scale: Math.sqrt(dictPoints[name].src_weight)/2,//10 + dictPoints[name].src_weight/100000, /*权值*//*散射大小*/
                    scale: scalLevel(dictPoints[name].src_weight + dictPoints[name].dst_weight),//10 + dictPoints[name].src_weight/100000, /*权值*//*散射大小*/

                    brushType: 'stroke',
                },
                //地名显示
                label: {
                    normal: {
                        show: false,
                        position: 'top',
                        color: '#333333',
                        formatter: '{b}'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f4e925',
                        // shadowBlur: 10,
                        // opacity:5,
                        // shadowColor: '#333'
                    }
                },
                silent: false,
                data: [
                    {
                        showSymbol: true,
                        name: name, /*地名*/
                        value: dictPoints[name].coord.concat(dictPoints[name].src_weight + dictPoints[name].dst_weight), /*地理位置经纬度*/
                        // value:Math.sqrt(dictPoints[name].src_weight)/2,
                        symbolSize: 5, /*权值*/
                        itemStyle: {
                            normal: {
                                color: '#FFD24D'
                            },
                            emphasis: {
                                label: {position: 'top'}
                            }
                        },
                        tooltip: {
                            enterable: true,//显示可见
                            formatter: function (params) {
                                var count;
                                for (var i in params.value) {
                                    count = params.value[i];
                                }
                                // alert(JSON.stringify(params));/*可以根据param中的参数自定义显示信息和格式*/
                                var value = params.name + ':' + count.toString();
                                return value;
                            },
                        }
                    }
                ]

                // }
            });
        }
        return tGeoDt;
    }
};

// 老代码 ！
// 流量数字格式化，例，1024==1KB
tool.bytesFormat = function (bytes) {
    if (bytes === 0) return '0 B';

    let unitSize = 1024;

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // Math.floor():函数返回一个数的自然对数
    // Math.log():函数返回一个数的自然对数
    const index = Math.floor(Math.log(bytes) / Math.log(unitSize));

    const num = (bytes / Math.pow(unitSize, index)).toPrecision(3);

    return num + ' ' + sizes[index];
    //toPrecision(3) 后面保留一位小数，如1.0GB
    //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

// 老代码 ！
// 流量速率数字格式化
tool.bytesRateFormat = function (bytes, timeLong) {
    if (!timeLong)										// 如果timeLong为空，就默认以分为计数单位
    {
        return bytesFormat(bytes) + '/m';
    } else {												// 如果timeLong不为空
        let timeNum = parseInt(timeLong);				// 取timeLong的数字，如 12h，取 12
        let tranBytes = bytesFormat(bytes * timeNum);		// 将timeLong的数字乘以流量并格式化

        return tranBytes + '/' + timeLong.substr(-1);		// 添加timeLong的单位
    }
};

// 老代码 ！
// 数量数字格式化
tool.countFormat = function (count) {
    if (count <= 0) {
        return 0;
    }

    if (count < 10000) {
        return count;
    }

    count = Math.round((count / 10000) * 100) / 100;
    return count + '万';
};

// 格式化 yAxis
tool.parseYAxis = function (vm) {
    if (vm.option.yNumType) {

        const filter = name => {

            let reData = '';

            switch (vm.option.yNumType) {

                case 'bytes':
                    reData = tool.bytesFormat(name);
                    break;
                case 'rate':
                    reData = tool.bytesRateFormat(name);
                    break;
                default:
                    reData = tool.countFormat(name);
                    break;
            }

            return reData;

        };

        if (vm._.isArray(vm.option.yAxis) && !vm.option.yAxis[0].axisLabel.formatter) {
            vm.option.yAxis[0].axisLabel.formatter = filter;
        } else {
            vm.option.yAxis.axisLabel.formatter = filter;
        }

    }
};

// 老代码 ！
// 拓补图
tool.topology = {

    /**
     *
     *    VFWPic:{
                type:String,
                default:'image://../../../../../static/images/clouddc-topology/VFW.png'
            },
     VNPic:{
                type:String,
                default:'image://../../../../../static/images/clouddc-topology/VN.png'
            },
     VMPic:{
                type:String,
                default:'image://../../../../../static/images/clouddc-topology/VM.png'
            },
     * */

    get_nodes (data, option) {
        var nodes = [];
        var tmp_nodes = [];
        for (var root_i in data) {
            tmp_nodes.push(data[root_i].root);
            tool.topology.setNodeStyle(nodes, data[root_i].root, root_i, 100, (parseInt(root_i) + 1) * 100, option);

            var clients = data[root_i].clients;
            var coord_i = parseInt(root_i) + 1;
            for (var client_i in clients) {
                var tmpstring = clients[client_i];
                if (tmp_nodes.indexOf(clients[client_i]) >= 0) {
                    continue;
                } else {
                    tmp_nodes.push(clients[client_i]);
                }
                tool.topology.setNodeStyle(nodes, tmpstring, root_i, (parseInt(root_i) + 1) * 140, (parseInt(coord_i) + parseInt(client_i)) * 75, option);

                coord_i += 1;
            }
        }
        return nodes;
    },

    get_links (data) {
        var links = [];
        for (var root_i in data) {
            var clients = data[root_i].clients;
            var servers = data[root_i].servers;
            for (var client_i in clients) {
                links.push({'source': clients[client_i], 'target': data[root_i].root});
            }
            for (var server_i in servers) {
                links.push({'source': data[root_i].root, 'target': servers[server_i]});
            }
        }
        return links;
    },

    setNodeStyle (arrNodes, strName, index, x, y, option) {

        if (strName.indexOf("vfw") >= 0) {
            /*虚墙*/
            this.setNodeStyleVFW(arrNodes, strName, index, x, y, option);
        }
        else if (strName.indexOf("vm") >= 0) {
            /*虚机*/
            this.setNodeStylevVM(arrNodes, strName, index, x, y, option);
        }
        else {
            /*虚拟网络*/
            this.setNodeStyleVNetWork(arrNodes, strName, index, x, y, option);
        }
    },

    setNodeStyleVFW (arrNodes, strName, index, x, y, option) {
        arrNodes.push(
            {
                "symbol": option.VFWPic || 'image://../../../../../static/images/clouddc-topology/VFW.png',
                "symbolSize": [8.2 * 4, 9.6 * 4],
                'name': strName,
                'x': x,
                'y': y,
                'label': {
                    'normal': {
                        'show': true,
                        textStyle: {
                            'color': '#f8c2ad',
                            'fontSize': 8
                        },
                        position: 'bottom'
                    }
                }
            }
        );
    },

    setNodeStyleVNetWork (arrNodes, strName, index, x, y, option) {
        arrNodes.push(
            {
                "symbol": option.VNPic || 'image://../../../../../static/images/clouddc-topology/VN.png',
                "symbolSize": [7.6 * 4, 6.7 * 4],
                'name': strName,
                'x': x,
                'y': y,
                'label': {
                    'normal': {
                        'show': true,
                        textStyle: {
                            'color': '#a5aef3',

                            'fontSize': 8
                        },
                        position: 'bottom'
                    }
                }
            }
        );
    },

    setNodeStylevVM (arrNodes, strName, index, x, y, option) {
        arrNodes.push(
            {
                "symbol": option.VMPic || 'image://../../../../../static/images/clouddc-topology/VM.png',
                "symbolSize": [6.9 * 4, 9.7 * 4],
                'name': strName,
                'x': x,
                'y': y,
                'label': {
                    'normal': {
                        'show': true,
                        textStyle: {

                            'color': '#967e70',
                            'fontSize': 8
                        },
                        position: 'bottom'
                    }
                }
            }
        );
    },
};

export default tool;
