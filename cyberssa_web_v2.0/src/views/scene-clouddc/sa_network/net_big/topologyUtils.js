/**
 *Created by zmj on 2018/8/14
 */
export function get_nodes(data) {
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
}
export function  get_links(data) {
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
}
export  function setNodeStyleVFW(arrNodes,strName,index,x,y){
    arrNodes.push(
        {
            // "symbol": "rect",
            // "symbol": 'image://http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png',
            "symbol": 'image://../../../../static/images/clouddc-topology/VFW.png',
            "symbolSize": [8.2*4,9.6*4],
            'name':strName,
            'x':x,
            'y':y,
            'label': {
                'normal': {
                    'show': true,
                    textStyle: {
                        'color': '#b26c72',
                        'fontSize': 8
                    },
                    position:'bottom'
                }
            }
        }
    );
}
export function setNodeStyle(arrNodes, strName, index, x, y) {
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
}
export function setNodeStyleVNetWork(arrNodes,strName,index,x,y){
    arrNodes.push(
        {
            // "symbol": "rect",
            // "symbol": 'image://http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png',
            "symbol": 'image://../../../../static/images/clouddc-topology/VN.png',
            "symbolSize": [7.6*4,6.7*4],
            'name':strName,
            'x':x,
            'y':y,
            'label': {
                'normal': {
                    'show': true,
                    textStyle: {
                        'color': '#558e94',
                        'fontSize': 8
                    },
                    position:'bottom'
                }
            }
        }
    );
}
export function setNodeStylevVM(arrNodes,strName,index,x,y){
    arrNodes.push(
        {
            // "symbol": "rect",
            // "symbol": 'image://http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png',
            "symbol": 'image://../../../../static/images/clouddc-topology/VM.png',
            // "symbol": 'image://../../../public/img/VM.png',

            "symbolSize": [6.9*4,9.7*4],
            'name':strName,
            'x':x,
            'y':y,
            'label': {
                'normal': {
                    'show': true,
                    textStyle: {
                        'color': '#ad8400',
                        'fontSize': 8
                    },
                    position:'bottom'
                }
            }
        }
    );
}
