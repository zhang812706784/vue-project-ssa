<template>
    <div id="net_topology" style="height: 100%;width: 100%;"></div>
</template>

<script type="es6">
    import util from "../../../libs/util";

    export default {
        name: "tp-ssa-topology",

        props: {
            allParams: Object,
            VFWPic:{
                type:String,
                default:'image://../../static/images/clouddc-topology/VFW.png'
            },
            VNPic:{
                type:String,
                default:'image://../../static/images/clouddc-topology/VN.png'
            },
            VMPic:{
                type:String,
                default:'image://../../static/images/clouddc-topology/VM.png'
            },
        },
        data() {
            return {};
        },
        methods: {
            get_nodes(data) {
                var nodes = [];
                var tmp_nodes = [];
                for (var root_i in data) {
                    tmp_nodes.push(data[root_i].root);
                    this.setNodeStyle(nodes, data[root_i].root, root_i, 100, (parseInt(root_i) + 1) * 100);

                    var clients = data[root_i].clients;
                    var coord_i = parseInt(root_i) + 1;
                    for (var client_i in clients) {
                        var tmpstring = clients[client_i];
                        if (tmp_nodes.indexOf(clients[client_i]) >= 0) {
                            continue;
                        } else {
                            tmp_nodes.push(clients[client_i])
                        }
                        this.setNodeStyle(nodes, tmpstring, root_i, (parseInt(root_i) + 1) * 140, (parseInt(coord_i) + parseInt(client_i)) * 75);

                        coord_i += 1;
                    }
                }
                return nodes;
            },

            get_links(data) {
                var links = [];
                for (var root_i in data) {
                    var clients = data[root_i].clients;
                    var servers = data[root_i].servers;
                    for (var client_i in clients) {
                        links.push({'source': clients[client_i], 'target': data[root_i].root})
                    }
                    for (var server_i in servers) {
                        links.push({'source': data[root_i].root, 'target': servers[server_i]})
                    }
                }
                return links;
            },

            setNodeStyleVFW(arrNodes,strName,index,x,y){
                arrNodes.push(
                    {
                        "symbol": this.VFWPic,
                        "symbolSize": [8.2*4,9.6*4],
                        'name':strName,
                        'x':x,
                        'y':y,
                        'label': {
                            'normal': {
                                'show': true,
                                textStyle: {
                                    'color': '#f8c2ad',
                                    'fontSize': 8
                                },
                                position:'bottom'
                            }
                        }
                    }
                );
            },

            setNodeStyle(arrNodes, strName, index, x, y) {
                if (strName.indexOf("vfw") >= 0) {
                    /*虚墙*/
                    this.setNodeStyleVFW(arrNodes, strName, index, x, y);
                }
                else if (strName.indexOf("vm") >= 0) {
                    /*虚机*/
                    this.setNodeStylevVM(arrNodes, strName, index, x, y);
                }
                else {
                    /*虚拟网络*/
                    this.setNodeStyleVNetWork(arrNodes, strName, index, x, y);
                }
            },

            setNodeStyleVNetWork(arrNodes,strName,index,x,y){
                arrNodes.push(
                    {
                        "symbol": this.VNPic,
                        "symbolSize": [7.6*4,6.7*4],
                        'name':strName,
                        'x':x,
                        'y':y,
                        'label': {
                            'normal': {
                                'show': true,
                                textStyle: {
                                    'color': '#a5aef3',

                                    'fontSize': 8
                                },
                                position:'bottom'
                            }
                        }
                    }
                );
            },

            setNodeStylevVM(arrNodes,strName,index,x,y){
                arrNodes.push(
                    {
                        "symbol": this.VMPic,
                        "symbolSize": [6.9*4,9.7*4],
                        'name':strName,
                        'x':x,
                        'y':y,
                        'label': {
                            'normal': {
                                'show': true,
                                textStyle: {

                                    'color': '#967e70',
                                    'fontSize': 8
                                },
                                position:'bottom'
                            }
                        }
                    }
                );
            },

            renderNetTopology(data) {

                var g_dictNetPologyData;

                g_dictNetPologyData = data.rows;
                data = g_dictNetPologyData.pologydata;


                var option = {
                    title: {
                        // text: '网络拓扑图'
                    },
                    tooltip: {},
                    // backgroundColor:"#1b1b1b",
                    series: [{
                        type: 'graph',
                        legendHoverLink: true,              //是否启用图例 hover 时的联动高亮。
                        layout: 'force',                    //图的布局。none不采用任何布局\circular采用环形布局\force采用力引导布局
                        focusNodeAdjacency: true,          //鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
                        symbolSize: 45,
                        roam: true,                         // 是否可拖动
                        draggable: true,                     //节点是否可拖拽，只在使用力引导布局的时候有用
                        label: {                             //   图形上的文本标签
                            normal: {
                                show: true
                            }
                        },
                        force: {                              //力引导布局相关的配置项
                            repulsion: 1900,                 // 节点之间斥力
                            layoutAnimation: false,         // 是否抽搐
                            // gravity:0.11,                    // 重力
                            edgeLength: [100, 500]            // 边长度
                        },
                        edgeSymbol: ['circle'],             //边两端的标记类型，可以是一个数组，也可以是一个数字circle、arrow
                        edgeSymbolSize: [2, 2],             //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 8
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#ccc',
                                borderColor: '#1af'
                            }
                        },
                        data: this.get_nodes(data),
                        links: this.get_links(data),
                        lineStyle: {
                            normal: {
                                color: '#a8a8a8',
                                opacity: 0.6,
                                width: 1.5,
                                curveness: -0.1
                            }
                        }
                    }]
                };
                var net_topology = this.$echarts.init(document.getElementById('net_topology'));

                util.stringify(option);

                net_topology.setOption(option);
            }

        },

        mounted() {
            this.$http.get(this.allParams.url).then(res => {
                this.renderNetTopology(res.data)
            });
        }

    };

</script>
