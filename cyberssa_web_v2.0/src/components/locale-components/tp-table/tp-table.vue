<template>
    <Row>

        <Row>
            <Col span="1" class="buttonGroup" v-if="all_params.add_btn=== true" >
                <Button @click="add" class="btnStyle btn_reset" >新增</Button>
            </Col>

            <Col span="1" class="buttonGroup" v-if="all_params.del_btn=== true" >
                <Button @click="del" class="btnStyle btn_reset" >删除</Button>
            </Col>

            <Col v-if="searchUnitList.length" span="3" class="search-container" v-for="(oneListObj,index) of searchUnitList" >
                <div>
                    <label for="'tableBox'+oneListObj.key" class="searchLabel">{{oneListObj.name}}</label>
                    <input id="'tableBox'+oneListObj.key" key="oneListObj.key" class="searchInput" v-model="searchValueObj[oneListObj.key]">
                </div>
            </Col>

            <Col v-if="searchUnitList.length" span="6" style="margin-top:-3px;">
                <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期" style="width: 200px" @on-change="changeDate"></DatePicker>
                <Button class="btnStyle btn_1" id="tableBoxsearchBtn" v-on:click="searchClick" >查询</Button>
                <Button id="tableBoxresetBtn" class="btnStyle btn_reset" v-on:click="resetClick" >重置</Button>
            </Col>

        </Row>
        <Row>

            <Col span="24">
                <Table highlight-row :checkBox="checkBox" border :columns="all_params.cols" :data="dataContent"
                       @on-selection-change="onSelect" ref="selection"></Table>
            </Col>

        </Row>

        <Row>
            <!--翻页-->
            <Col span="24">
                <Page :ref="randomRef" v-if="pagingOption.showPaging" :total="total" style="margin-top:5px;float: right"
                      :show-total="pagingOption.showTotal"
                      show-sizer
                      :page-size-opts="[10, 20, 30, 40, 50]"
                      @on-page-size-change="changePageSize"
                      @on-change="getData"></Page>
            </Col>

        </Row>

    </Row>
</template>

<script>
    import Util from '@/libs/util'

    export default {
        data: function () {
            return {
                id: this.all_params.id,
                type:this.all_params.type,
                page: 1,
                size: 10,
                currentSelect:'',
                randomRef: this._.random(0, 9999).toString(36),
                dataContent: [],
                loading: false,
                searchUnitList:[],
                searchValueObj:{},
                bTime:null,
                eTime:null,
                total: 0,
                initPage: 1
            };
        },
        props: {
            all_params: Object,
            height: {
                type: Number,
                default: 500
            },
            pagingOption: {
                type: Object,
                default: function () {
                    return {
                        showPaging: true,
                        showTotal: true
                    };
                }
            },
            checkBox: {
                type: Boolean,
                default: true
            }
        },
        methods: {

            add() {
                this.$emit('add-btn', '');
            },

            modify() {
                this.$emit('modify-btn', '');
            },

            del() {
                this.$emit('del-btn', this.currentSelect);
            },



            tableStypePrepare() {
                if (!(this.all_params.index && this.all_params.index == false)) {
                    /*如果第0元素或第1元素为'序号'，则说明已经增加了  '序号'，不需要再加了,避免重复*/
                    if(!( this.all_params.cols[0].title ==  '序号'
                        ||  this.all_params.cols[1].title ==  '序号'))
                    {
                        this.all_params.cols = [{
                            title: '序号',
                            width: 80,
                            align: 'center',
                            render: (h, params) => {
                                return h('span', `${(params.index + 1) + (this.page === 1 ? 0 : (this.page - 1) * this.size)}`);
                            },

                        }, ...this.all_params.cols];
                    }
                }
                if (this.all_params.checkBox) {
                    /*如果第0元素为'selection'，不需要再加了,避免重复*/
                    if( this.all_params.cols[0].type != 'selection')
                    {
                        this.all_params.cols.unshift({
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        });
                    }
                }

            },

            changeParamsOnly(dataDict) {
                if (dataDict) {
                    let givenparams = this.all_params.data;
                    for (let key in dataDict) {
                        givenparams[key] = dataDict[key];
                    }

                }
            },

            changeParams(dataDict) {
                this.dataContent = [];
                this.changeParamsOnly(dataDict);
                this.getData(this.page);
            },

            changePageSize(size) {
                console.warn(`============ change size ${size} ============`);
                this.size = size;
                this.getData(1);

            },
            getData(pageNum) {

                this.tableStypePrepare();
                this.page = pageNum;

                const _this = this;
                this.loading = true;
                this.getPagingInfo(pageNum);

                /*离线数据处理特征变量处理，此处要和echart等控件统一*/
                let obj = this.all_params.data;
                let vm = this.all_params;
                obj.offline_attr = obj.offline_attr_p ? `#${vm.id}-${ obj.offline_attr_p}` : `#${vm.id}`;

                let httpRequestData = JSON.parse(JSON.stringify(this.all_params.data));

                /*添加search參數和排序參數*/
                this.addSearchParams(httpRequestData, this.all_params.ajaxType);

                if (this.all_params.ajaxType == "get") {
                    _this.$http.get(this.all_params.url, httpRequestData).then(res => {
                        // 数据渲染前的处理
                        if (res.data instanceof Array) {
                            let obj = {
                                rows: res.data
                            };
                            res.data = obj;

                        }
                        if (this.all_params.callback) {
                            this.all_params.callback(res.data)
                        }

                        // console.log("111111111111111111111111111111111111111111111");
                        // console.log(_this.size);
                        // console.log(res.data.total);

                        _this.pagingOption.showPaging=false;
                        if( _this.size < res.data.total )
                        {
                            _this.pagingOption.showPaging=true;
                        }

                        // 保存取到的所有数据
                        if (res != "" && res.data.rows) {
                            _this.dataContent = res.data.rows;
                            _this.total = res.data.total;
                        } else {
                            _this.dataContent = ""
                            _this.total = 0;
                        }

                        _this.loading = false;
                        if(this.all_params.checkAll){
                            setTimeout(() => {
                                this.$refs.selection.selectAll(true);
                            }, 100);
                        }
                    });
                } else {
                    _this.$http.post(this.all_params.url, httpRequestData).then(res => {
                        // 数据渲染前的处理
                        if (this.all_params.callback) {
                            this.all_params.callback(res.data)
                        }

                        // 保存取到的所有数据
                        if (res != "" && res.data.rows) {
                            _this.dataContent = res.data.rows;
                            _this.total = res.data.total;
                        } else {
                            _this.dataContent = ""
                            _this.total = 0;
                        }
                        _this.loading = false;
                        if(this.all_params.checkAll){
                            setTimeout(() => {
                                this.$refs.selection.selectAll(true);
                            }, 100);
                        }
                    });
                }
                this.$emit('getPageSize',this.page,this.size);
            },
            getPagingInfo(page) {
                //post
                this.all_params.data.page = page;
                this.all_params.data.size = this.size;

                Util.addOfflineParams(this, this.all_params.data);

                if (this.all_params.ajaxType == "get") {
                    //如果是get请求需要把内容放进
                    if (!("params" in this.all_params)) {
                        let params = {};
                        for (let key in this.all_params.data) {
                            params[key] = this.all_params.data[key];
                        }
                        this.all_params.data.params = params;
                    }
                }

            },
            onSelect(selection) {
                this.currentSelect = selection;
                if (this.all_params.checkBoxOnchange) {
                    this.all_params.checkBoxOnchange(selection)
                }
            },
            renderSearchBox() {
                for (let itemCol of this.all_params.cols) {
                    if (itemCol.search) {
                        this.searchUnitList.push({
                                key: itemCol.search,
                                name: itemCol.title
                            }
                        )
                        this.$set(this.searchValueObj, itemCol.search, "")
                    }
                }
                return;
            },
            changeDate(params){
                this.bTime = new Date(params[0]).getTime();
                this.eTime = new Date(params[1]).getTime();
            },
            addSearchParams(httpRequestDataParam, ajaxType) {
                var serBody = {};
                var serBodyLength = 0;
                let httpRequestData=null;

                if (ajaxType == "get") {
                    httpRequestData=httpRequestDataParam.params
                }
                else {
                    httpRequestData=httpRequestDataParam;
                }

                /*增加搜索條件*/
                for (let item in this.searchValueObj) {
                    console.log(this.searchValueObj[item])
                    if (this.searchValueObj[item] != "") {
                        serBody[item] = this.searchValueObj[item];
                        serBodyLength++;
                    }
                }
                if (serBodyLength > 0) {
                    httpRequestData.search = this.searchValueObj;
                }

                /*增加搜索時間*/
                if(this.bTime != null )
                {
                    httpRequestData.begTime = this.bTime;
                    httpRequestData.endTime = this.eTime;
                }
            },
            searchClick() {
                this.getData(1);
            },
            resetClick() {
                for (let item in this.searchValueObj) {
                    this.searchValueObj[item] = "";
                }
                this.bTime=null;
                this.bTime=null;

                this.getData(1);
            },
            getPageAndSize(_this){
                debugger;
                let obj = {
                    page:_this.page,
                    size:_this.size
                };
                return obj
            },
        },
        mounted () {
            this.getData(this.initPage);

        },
        created () {
            this.renderSearchBox();
        },
    };
</script>

<style lang="less" scoped>

    .margin(@border_width:10px) {
        margin-bottom: @border_width;
    }
    .butFunction {
        border: 1px solid #ccc;
        border-radius: 3px;
        width:54px;
    }

    .search-container{
        height: 100%;
        padding-left: 10px;
        padding-bottom: 10px;
        .searchLabel {
            color:#fff;
            margin-right:5px;
        }
        .searchInput{
            background-color: transparent;
            border: 1px solid #ccc;
            border-radius: 5px;
            height:26px;
            color: #fff;
            outline-style: none;
        }
    }

    .btnStyle {
        width:70px;
        border-radius: 4px;
        margin-left:10px;
    }
    .ipt_box {
        margin-right:10px;
    }

</style>
