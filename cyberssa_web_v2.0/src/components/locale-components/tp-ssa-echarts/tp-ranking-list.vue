<template>
    <div class="ranking" :bordered="false">
        <div v-show="list.length">
            <p>{{allParams.title}}</p>
            <ul class="container">
                <li v-for="(item,index) in list">
                    <div v-if="allParams.labelFlag"  class="labelTxt" :class= getClass(item)>{{ txt(item) }}</div>
                    <div class="mainItem" :title=copyKey[index]>{{ copyKey[index] }}</div>
                    <div v-if="allParams.countFlag" class="count" >{{ copyCount[index] }}个</div>
                </li>
            </ul>
        </div>
        <div v-show="!list.length">
            <img  class="back-img" src="../../../../static/images/echarts/null.png">
        </div>

    </div>
</template>

<script type="es6">
    export default {
        name: "tp-ranking-list",
        props: {
            allParams: Object
        },
        data () {
            return {
                list: [],
                copyKey:[],
                copyCount:[],
            };
        },
        methods: {
            getClass(item) {
                if(item <= 5.0) {
                    return 'level_1';
                } else if(item >= 8.0){
                    return 'level_3';
                } else {
                    return 'level_2';
                }
            },
            txt(item){
                if(item <= 5.0) {
                    return '低';
                } else if(item >= 8.0){
                    return '高';
                } else {
                    return '中';
                }
            }
        },
        mounted () {
            this.$http.get(this.allParams.url, {params: this.allParams.data}).then(res => {
                if (res.code === 0 && res.data.rows.length > 0) {
                    for (let i = 0; i < res.data.rows.length; i++) {
                        let _data = res.data.rows[i];
                        this.copyKey.push(_data.key);
                        this.copyCount.push(_data.doc_count);
                        this.$http.get(this.allParams.url1, {
                            params: {
                                index: 'loophole_result',
                                type: 'lph_scan_result',
                                queryObj: {'nvtName': _data.key},
                                page: 1,
                                size: 10
                            }
                        }).then(res1 => {
                            let level = res1.data.rows[0]._source.resultSeverity;
                            this.list.push(level);

                        })
                    }
                }
            });
        }
    };
</script>

<style lang="less" scoped>
    .ranking {
        width: 100%;
        height: 100%;
        background: transparent;
        color: #fff;
        box-sizing: border-box;

        .back-img{
                width: 180px;
                height: 125px;
                opacity: .3;
                margin:40% 25%;
        }

        p {
            border-bottom: 1px solid rgba(0, 0, 0,0.5);
            margin: 10px;
        }
        .container {
            list-style-type: none;
            padding: 0;
            overflow: hidden;

            li {
                border-bottom: 1px solid rgba(0, 0, 0,0.5);
                width: 100%;
                height: 32px;
                margin-top: 6px;

                div {
                    float: left;
                    margin: auto 5px;
                    text-align: center;
                }
                .labelTxt{
                    width:15%;
                    border-radius: 3px;
                }
                .mainItem {
                    width:65%;
                    text-align: left;
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &:hover {
                        color: #4287F7;
                        text-decoration: underline;
                    }
                }
                .count {
                    width: 10%;
                }
            }
        }
        .level_1 {
            border:1px solid #32D36D;
            color: #32D36D;
        }
        .level_2 {
            border: 1px solid #FFBA00;
            color: #FFBA00;
        }
        .level_3 {
            border:1px solid #AE0101;
            color: #AE0101;
        }

    }
</style>
