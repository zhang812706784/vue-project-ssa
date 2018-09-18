<template>
    <div>
        <Button type="ghost" @click=modalShow class="selectBtn">{{ $t('筛选') }}</Button>
        <Modal v-model="modalShowFlag"
               :title="$t('页面查询配置')"
               @on-ok="ModalOk"
               @on-cancel="ModalCancel"
               class-name="selectModal"
        >
            <div class="page_query">
                <div class="item_row "
                     v-for="(oneListObj,index) in objfiledUrlGotList">
                    <div class="left">{{all_params.aggFieldlist[index]}}</div>
                    <div class="right">
                        <!--<span class="item_card" :id="'SelectAllby'+index"-->
                        <!--@click.self="selectItemAllClick(index,oneListObj,$event)">全部</span>-->
                        <span class="item_card "
                              v-for="(item,i) in oneListObj.list"
                              :title="item.key"
                              :id="'Selectby_'+index+'_'+i"
                              @click.self="selectItemClick(index,oneListObj,item,$event)"
                        >{{item.key}}</span>
                        <input type="text" class="usm_input" :id="'inputSearchby'+index" placeholder="自定义搜索条件">
                    </div>
                    <div style="width: 100%;height: 20px;"></div>
                </div>
            </div>
            <!--{{objfiledUrlGotList}}-->
        </Modal>
    </div>

</template>

<script>
    export default {
        name: "tp-ssa-selectbtn",
        // all_params={
        //     url: '/api/getbar',
        //     index: 'ipweb_result',
        //     type: 'ip_geo_info',
        //     aggFieldlist:{
        //         'uuid':"IP地址",
        //         'ip_position':"IP地区",
        //     },
        // },
        props: {
            all_params: Object,
        },
        data() {
            return {
                firstShowFlag: true,
                selectedFlag: false,//是否选中标志
                modalShowFlag: false,//模态框是否显示
                objfiledUrlGotList: {},  //filed1 Ip地址url get后的值，供选择使用
                objSelectedValuelist: {},//filed1 Ip地址 选择后返回的key值
                objfiledUrlGotList_Confirm: {},//点击确定后的选择
            };
        },
        methods: {
            ObjectClone(obj) {
                function clone(obj) {
                    var copy;

                    // Handle the 3 simple types, and null or undefined
                    if (null == obj || "object" != typeof obj) return obj;

                    // Handle Date
                    if (obj instanceof Date) {
                        copy = new Date();
                        copy.setTime(obj.getTime());
                        return copy;
                    }

                    // Handle Array
                    if (obj instanceof Array) {
                        copy = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            copy[i] = clone(obj[i]);
                        }
                        return copy;
                    }

                    // Handle Object
                    if (obj instanceof Object) {
                        copy = {};
                        for (var attr in obj) {
                            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                        }
                        return copy;
                    }

                    throw new Error("Unable to copy obj! Its type isn't supported.");
                }

                return clone(obj)

            },
            selectItemStyleChangeTarget(isSel, elementTarget) {
                if (isSel) {
                    elementTarget.className = 'item_card selectedFlag';
                }
                else {
                    elementTarget.className = "item_card";
                }
            },

            selectItemStyleChange(isSel, strElementById) {
                let elementTarget = document.getElementById(strElementById);
                this.selectItemStyleChangeTarget(isSel, elementTarget);
            },

            ModalOk() {
                let retData={};
                this.objfiledUrlGotList_Confirm = this.ObjectClone(this.objfiledUrlGotList);
                for (let index in this.objfiledUrlGotList) {
                    let oneListObj = this.objfiledUrlGotList[index];
                    let elementTarget = document.getElementById('inputSearchby' + index);

                    let tmpList=[];
                    for(let itme of this.objSelectedValuelist[index]){
                        tmpList.push(itme.key)
                    }
                    if( elementTarget.value != ""){
                        tmpList.push(elementTarget.value)
                    }
                    if(tmpList.length >0 ){
                        retData[index]=tmpList;
                    }
                }

                if((JSON.stringify(retData) == "{}"))
                {
                    retData=null;
                }

                this.$emit('select-confirm', retData);
            },
            ModalCancel() {

            },
            modalShow() {
                this.modalShowFlag = true;
                this.objfiledUrlGotList = this.ObjectClone(this.objfiledUrlGotList_Confirm);
                /*根据this.objfiledUrlGotList初始化选项样式*/
                if (this.firstShowFlag) {
                    this.firstShowFlag = false;
                    return;
                }

                for (let index in this.objfiledUrlGotList) {
                    let oneListObj = this.objfiledUrlGotList[index];
                    let oneList = oneListObj.list;

                    // /*修改全选的样式*/
                    // let itemAll = oneListObj.allItme;
                    // this.selectItemStyleChange(itemAll.isSel, 'SelectAllby' + index);

                    /*修改其他选项的样式*/
                    for (let i in oneList) {
                        let item = oneList[i];
                        this.selectItemStyleChange(item.isSel, 'Selectby_' + index + '_' + i);
                    }
                    /*更新this.objSelectedValuelist[index]*/
                    this.objSelectedValuelist[index] = oneList.filter(item => item.isSel);
                }
            },

            selectItemClick(index, oneListObj, item, e) {
                let oneList = oneListObj.list;
                let allItem = oneListObj.allItme;
                item.isSel = !item.isSel;

                /*更新this.objSelectedValuelist[index]*/
                this.objSelectedValuelist[index] = oneList.filter(item => item.isSel);

                /*修改当前选择项的样式*/
                this.selectItemStyleChangeTarget(item.isSel, e.target);
                // /*修改“全部”按钮的样式*/
                // allItem.isSel = (this.objSelectedValuelist[index].length == oneList.length);
                // this.selectItemStyleChange(allItem.isSel, 'SelectAllby' + index);
            },

            // selectItemAllClick (index, oneListObj, e) {
            //     let itemAll = oneListObj.allItme;
            //     let oneList = oneListObj.list;
            //
            //     /*修改当前选择项(all)的样式*/
            //     itemAll.isSel = !itemAll.isSel;
            //     this.selectItemStyleChangeTarget(itemAll.isSel, e.target);
            //     /*all选中时，input不能输入*/
            //     let elementTarget = document.getElementById('inputSearchby'+index);
            //     if(itemAll.isSel)
            //     {
            //         elementTarget.disabled=true;
            //     }
            //     else
            //     {
            //         elementTarget.disabled=false;
            //     }
            //
            //     /*修改其他选项的样式*/
            //     for (let i in oneList) {
            //         let item = oneList[i];
            //         item.isSel = itemAll.isSel;
            //         this.selectItemStyleChange(item.isSel, 'Selectby_' + index + '_' + i);
            //     }
            //     /*更新this.objSelectedValuelist[index]*/
            //     this.objSelectedValuelist[index] = oneList.filter(item => item.isSel);
            //
            // }
        },
        created() {
            let aggFieldlist = this.all_params.aggFieldlist;

            for (let key in aggFieldlist) {
                let tmpobjfiledUrlGotList = [];
                let data = {
                    index: this.all_params.index,
                    type: this.all_params.type,
                    aggField: key,
                };
                this.$http.get(this.all_params.url, {params: data}).then(res => {
                        let maxSelectNR = 11;
                        if (maxSelectNR > res.data.rows.length) {
                            maxSelectNR = res.data.rows.length;
                        }
                        if (res.code === 0 && maxSelectNR > 0) {
                            for (let i = 0; i < maxSelectNR; i++) {
                                let _data = res.data.rows[i];//key doc_count
                                _data.isSel = false;
                                tmpobjfiledUrlGotList.push(_data);
                            }
                        }
                        this.objfiledUrlGotList[key] = {
                            "list": tmpobjfiledUrlGotList,
                            //"allItme": {"key": "全部", "doc_count": 0, "isSel": false},
                            "SearchStr": "",
                        };
                        this.objSelectedValuelist[key] = [];
                        this.objfiledUrlGotList_Confirm[key] = this.ObjectClone(this.objfiledUrlGotList[key]);
                    }
                );
            }
        }
    };
</script>

<style lang="less" scoped>
    @import '../../../../src/styles/common.less';
    .selectBtn {
        border: 1px solid #D0D4D8;
        border-radius: 3px;
    }
    .page_query {
        width: 100%;
        height: 400px;
        color: #888888;

        .item_row {
            width: 100%;
            margin: 10px auto;
            box-sizing: border-box;

            div {
                float: left
            }

            .left {
                width: 18%;
                height: 100%;
            }

            .right {
                width: 82%;

                .item_card {
                    height: 26px;
                    float: left;
                    min-width: 120px;
                    display: inline-block;
                    text-align: center;
                    border: 1px solid #282941;
                    font-size: 12px;
                    padding: 0 8px;
                    margin: 0 8px 8px 0;
                    cursor: pointer;
                    box-sizing: border-box;
                    white-space: pre;

                }
                .usm_input {
                    width: 95%;
                    height: 35px;
                    line-height: 35px;
                    border-radius: 0;
                    color: #fff;
                    border: 1px solid #282941;
                    background-color: transparent;
                }

                .selectedFlag {
                    color: #fff;
                    border-color: #fff;
                }
            }

        }
    }

</style>

