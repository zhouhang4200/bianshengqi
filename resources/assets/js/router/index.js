import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const App = resolve => void (require(['../components/Main'], resolve));

const router = new Router({
    mode:'history',
    routes: [
        {
            name: "index",
            menu: false,
            path: "/index",
            meta:{title:'默认'},
            component: resolve => void(require(['../components/index/Index'], resolve)),
        },
        {
            name: "login",
            menu: false,
            path: "/login",
            meta:{title:'登录'},
            component: resolve => void(require(['../components/auth/Login'], resolve)),
        }
    ]
})

// 访问权限
function canVisit(to) {
    return true;
}

//vue-router 前置拦截器
router.beforeEach((to, from, next) => {
    if(to.name === 'login' || to.name === 'register') {
        if (sessionStorage.getItem('name')) {
            next({path:'/index'});
        }
        next();
    } else {
        if (! sessionStorage.getItem('name') || sessionStorage.getItem('name') == null) {
            next({path:'/login'});
            // Vue.component('App', require('../components/Main.vue'));
            // next();
        } else  {
            // Vue.component('App', require('../components/Main.vue'));
            next();
        }
    }
});

// 后置拦截器
router.afterEach((to, from, next) => {

});
export default router;
