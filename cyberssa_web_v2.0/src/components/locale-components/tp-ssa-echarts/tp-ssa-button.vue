<!--Created by zmj on 2018/9/5-->
<template>
    <Row>
        <Button v-for="(item,key) in allParams.eventList" v-on:click="changeProgram(key)" >{{key}}({{item}})</Button>
    </Row>
</template>

<script type="es6">
    export default {
        name: "tp-ssa-button",

        props: {
            allParams: Object,
        },
        data () {
            return {};
        },
        methods: {

            changeProgram(searchField){

                if (searchField === "全部"){

                    this.$refs.IPSPerceiveLogRef.changeParams({
                        search:{
                        },
                    });
                } else{
                    this.$refs.IPSPerceiveLogRef.changeParams({
                        search:{
                            EventType:searchField
                        },
                    });
                }

            },

        },

        mounted () {

            this.$http.get(this.allParams.url,{
                params:{
                    queryObj:this.allParams.data.queryObj
                }
            }).then(res => {

                for(let index in res.data.rows)
                {
                    let item=res.data.rows[index];
                    this.allParams.eventList[item.key]=item.doc_count;
                }
                this.allParams.eventList["全部"]=res.data.doc_count;
            });

        }

    };

</script>
