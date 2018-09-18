import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '云智',
    scene: 'abc模块123'
};

export const router = [
    {
        path: '/access',
        icon: 'icon-guanliyukongzhi',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            {
                path: 'index',
                title: '权限管理二级',
                name: 'access_index',
                component: () => import('@/views/scene-demo/access/access.vue')
            }
        ]
    },
    {
        path: '/access-test',
        icon: 'icon-anquanzujian',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                title: '权限测试页',
                name: 'accesstest_index',
                access: 0,
                component: () => import('@/views/scene-demo/access/access-test.vue')
            }
        ]
    },
    {
        path: '/international',
        icon: 'icon-fangwenfenxi_1',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            {
                path: 'index',
                title: {i18n: 'international'},
                name: 'international_index',
                component: () => import('@/views/scene-demo/international/international.vue')
            }
        ]
    },
    {
        path: '/component',
        icon: 'icon-ruqinfanghu',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '富文本编辑器',
                component: () => import('@/components/locale-components/iview-admin/text-editor/text-editor.vue')
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: () => import('@/components/locale-components/iview-admin/markdown-editor/markdown-editor.vue')
            },
            {
                path: 'image-editor',
                icon: 'crop',
                name: 'image-editor',
                title: '图片预览编辑',
                component: () => import('@/components/locale-components/iview-admin/image-editor/image-editor.vue')
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: () => import('@/components/locale-components/iview-admin/draggable-list/draggable-list.vue')
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '城市级联',
                component: () => import('@/components/locale-components/iview-admin/area-linkage/area-linkage.vue')
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: () => import('@/components/locale-components/iview-admin/file-upload/file-upload.vue')
            },
            {
                path: 'scroll-bar',
                icon: 'android-upload',
                name: 'scroll-bar',
                title: '滚动条',
                component: () => import('@/components/locale-components/iview-admin/scroll-bar/scroll-bar-page.vue')
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                component: () => import('@/components/locale-components/iview-admin/count-to/count-to.vue')
            },
            {
                path: 'split-pane-page',
                icon: 'ios-pause',
                name: 'split-pane-page',
                title: 'split-pane',
                component: () => import('@/components/locale-components/iview-admin/split-pane/split-pane-page.vue')
            }
        ]
    },
    {
        path: '/form',
        icon: 'icon-yonghuhuaxiang-',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [
            {
                path: 'artical-publish',
                title: '文章发布',
                name: 'artical-publish',
                icon: 'compose',
                component: () => import('@/views/scene-demo/form/article-publish/article-publish.vue')
            },
            {
                path: 'workflow',
                title: '工作流',
                name: 'workflow',
                icon: 'arrow-swap',
                component: () => import('@/views/scene-demo/form/work-flow/work-flow.vue')
            }

        ]
    },
    {
        path: '/tables',
        icon: 'icon-anquandaping-',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [
            {
                path: 'dragableTable',
                title: '可拖拽排序',
                name: 'dragable-table',
                icon: 'arrow-move',
                component: () => import('@/views/scene-demo/tables/dragable-table.vue')
            },
            {
                path: 'editableTable',
                title: '可编辑表格',
                name: 'editable-table',
                icon: 'edit',
                component: () => import('@/views/scene-demo/tables/editable-table.vue')
            },
            {
                path: 'searchableTable',
                title: '可搜索表格',
                name: 'searchable-table',
                icon: 'search',
                component: () => import('@/views/scene-demo/tables/searchable-table.vue')
            },
            {
                path: 'exportableTable',
                title: '表格导出数据',
                name: 'exportable-table',
                icon: 'code-download',
                component: () => import('@/views/scene-demo/tables/exportable-table.vue')
            },
            {
                path: 'table2image',
                title: '表格转图片',
                name: 'table-to-image',
                icon: 'images',
                component: () => import('@/views/scene-demo/tables/table-to-image.vue')
            }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'icon-zichanhuaxiang-',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            {
                path: 'mutative-router',
                title: '动态路由',
                name: 'mutative-router',
                icon: 'link',
                component: () => import('@/views/scene-demo/advanced-router/mutative-router.vue')
            },
            {
                path: 'argument-page',
                title: '带参页面',
                name: 'argument-page',
                icon: 'android-send',
                component: () => import('@/views/scene-demo/advanced-router/argument-page.vue')
            }
        ]
    },
    {
        path: '/error-page',
        icon: 'icon-shangwanghangweiganzhi',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            {
                path: 'index',
                title: '错误页面',
                name: 'errorpage_index',
                component: () => import('@/components/locale-components/iview-admin/error-page/error-page.vue')
            }
        ]
    }
];
