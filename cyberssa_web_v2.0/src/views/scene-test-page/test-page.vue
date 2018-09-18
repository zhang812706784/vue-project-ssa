<template>

   <h1>{{ list2 }}</h1>


</template>

<script type="es6">
    export default {
        name: "test-page",
        data () {
            return {
                list2: [
                    {
                        id: "id1",
                        it: {
                            name: 'bbbb'
                        }
                    },
                    {
                        id: "id2",
                        it:
                            {
                                name: '2222'
                            }
                    },
                    {
                        id: "id3",
                        it:
                            {
                                name: '3333'
                            }
                    },
                    {
                        id: "id4",
                        it:
                            {
                                name: '4444'
                            }
                    }
                ]
            };
        },
        methods: {
        }
    };
</script>

<style lang="less" scoped>
    body {
        font-family: '微软雅黑'
    }

    [v-cloak] {
        display: none;
    }

    #example {
        width: 1000px;
        margin: 0 auto;
    }

    .list-complete-item {
        transition: all 1s;
        height: 50px;
        line-height: 50px;
        background: rgba(0, 0, 0, .5);
        color: #fff;
        text-align: center;
        font-size: 24px;
        margin-top: 10px;
    }

    .styleclass {
        width: 100px;
        float: left;
    }

    .list-complete-enter, .list-complete-leave-active {
        opacity: 0;
        height: 0px;
        margin-top: 0px;
        padding: 0px;
        border: solid 0px;
    }

    .list-complete-sortable-chosen, .list-complete-sortable-ghost {
        opacity: 0;
        height: 0px;
        margin-top: 0px;
        padding: 0px;
        border: solid 0px;
    }

    .dargDiv {
        cursor: move;
        background: tomato;
    }

    .wrods {
        margin-top: 50px;
    }

    p {
        line-height: 24px;
        text-align: center;
    }
</style>
