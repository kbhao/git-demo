<template>
  <div class="login_container">
     <div class="login_box">
         <div class="avatar_box">
             <img src="../assets/logo.png" alt="">
         </div>
     <!-- 表单区域-->
     <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
  <el-form-item prop="username" >
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
  </el-form-item>

  <el-form-item prop="password">
    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
  </el-form-item>

  <el-form-item class="btns" >
    <el-button type="primary" @click="login">登录</el-button>
     <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
     </el-form>
     </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
           loginForm:{
               username:'admin',
               password:'123456',

           },
           loginFormRules:{
          username:[
              {required:true,message:"请输入账号",trigger:"blur"},
              {min:3,max:5,message:"长度在3到10之间",trigger:"blur"}
          ],
          password:[
              {required:true,message:"请输入密码",trigger:"blur"},
              {min:3,max:6,message:"长度在6到10之间",trigger:"blur"}
              ],
           }

        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
               const {data:res} = await this.$http.post("login",this.loginForm)
             if(res.meta.status !== 200) return this.$message.error('登录失败!')
             this.$message.success("登录成功")
             window.sessionStorage.setItem("token",res.data.token);
             this.$router.push("/home")
        
           })
        }
    }

}
</script>

<style>
.login_container{
    background-color:#2b4b6b;
    height:100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color:#fff;
    border-radius:3px;
    position:absolute;
    left :50%;
    top: 50%;
    transform:translate(-50%,-50%);
}
.avatar_box{
    height:130px;
    width:130px;
    border:1px solid #eee;
   border-radius:50%;
   padding:10px;
   box-shadow:0 0 10px #ddd;
   position:absolute;
   left:50%;
   transform:translate(-50%,-50%);
   background-color:#fff;
}
.avatar_box img{
      
        width:100%;
        height:100%;
      border-radius:50%;
      background-color:#eee;
}
.login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 20px;
    box-sizing:border-box;
}
.btns{
    display:flex;
    justify-content:flex-end;
}
</style>