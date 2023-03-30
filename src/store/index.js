import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: "",
        user:"",
        login_id: "",
        login_role: "",
        onlyReadResume: false,
    },
    mutations: {
        //设置token，user对象
        setLogin(state) {
            // console.log(window.sessionStorage.getItem("token")+"/");
            // state.tokenHead = window.sessionStorage.getItem("tokenHead");
            state.token = window.sessionStorage.getItem("token");
            state.user=window.sessionStorage.getItem("user");
        },
        //移除token，user对象
        removeLogin(state) {
            // state.tokenHead = window.sessionStorage.removeItem("tokenHead");
            state.token = window.sessionStorage.removeItem("token");
            state.user=window.sessionStorage.removeItem("user");
        },
        //设置角色
        // setRole(state) {
        //     state.login_role = window.localStorage.getItem("login_role");
        //     console.log(window.localStorage.getItem("login_role")+"/////");
        // },
        // setLogin(state) {
        //     state.login_id = window.localStorage.getItem("login_id");
        //     state.login_role = window.localStorage.getItem("login_role");
        // },
        // removeLogin(state) {
        //     state.login_id = window.localStorage.removeItem("login_id");
        //     state.login_role = window.localStorage.removeItem("login_role");
        // },
        setOnlyReadResume(state) {
            state.onlyReadResume = true;
        },
        recoverOnlyReadResume(state) {
            state.onlyReadResume = false;
        },
    },
    actions: {},
    getters: {},
    modules: {}
})

export default store;