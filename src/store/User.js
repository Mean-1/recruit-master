import { reactive } from "@vue/composition-api";


const user = reactive({
    option:[],
    label:[],
    // userid:1111,
    // username:null,
    // email:null,
    // phone:null,
    // gender:null,
    // birthday:null,
    // is_recruit:null,
    // avatar_url:null,
    // create_at:null,
    // isLogin: false,
    // login: () => {
    //     user.isLogin = true;
    //
    // },
    // logout: () => {
    //     user.isLogin = false;
    //     localStorage.clear();
    // },
    setInfo: (userInfo)=>{
        user.label.push(userInfo.label);
        user.option.push(userInfo.option);
        // console.log(userInfo);
        // user.userid = userInfo.id;
        // user.username=userInfo.username;
        // user.password = userInfo.password;
        // user.email = userInfo.email;
        // user.phone = userInfo.phone;
        // user.gender = userInfo.gender;
        // user.is_recruit=userInfo.is_recruit;
        // user.birthday = userInfo.birthday;
        // user.avatar_url = userInfo.avatar_url;
        // user.create_at = userInfo.create_at;

    }
});

export default function useUser(){
    return user;
}