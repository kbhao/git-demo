<template>
  <el-container class="home-container">
  <el-header> <div> <img src="../assets/logo.png" alt="">
      <span>电商管理系统</span>
  </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <!--侧边区-->
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
       <div class="toggle-button" @click="toggleCollapse">|||</div>

        <el-menu  background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        
     <!-- erjicaidan -->
     <!---二级列表-->
     <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" 
     @click="saveNavState('/' + subItem.path)"> 

         <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>

        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>


    <el-main>
        <router-view></router-view>
        
        </el-main>
  </el-container>
</el-container>
      
  
</template>

<script>
export default {
    data(){
        return{
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-yonghu',
                '103':'iconfont icon-shangpin',
                '101':'iconfont icon-quanxian',
                '102':'iconfont icon-dingdan',
                '145':'iconfont icon-shuju'
            },
            isCollapse:false,
            activePath:''
        }
    },
    created(){
     this.getMenuList();
     this.activePath = window.sessionStorage.getItem('activePath')
    },
 methods:{
     logout(){
         window.sessionStorage.clear();
         this.$router.push("/login");
     },
     async getMenuList(){
         const {data:res} = await this.$http.get('menus')
         if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
         this.menulist = res.data
         console.log(res);
     },
     toggleCollapse(){
         this.isCollapse = !this.isCollapse
     },
     saveNavState(activePath){
         window.sessionStorage.setItem('activePath',activePath)
         this.activePath = activePath
     }
     
 }
}
</script>

<style>
.el-header{
    background-color:#373d41;
    display:flex;
    justify-content:space-between;
    padding-left:0;
    align-items:center;
    color:#fff;
    font-size:20px;
  
}
.el-aside{
    background-color:#333744;
}
.el-main{
    background-color:#EAEDF1
}
.home-container{
    height:100%;
}
.el-header
 img{
    width:30px;
    height:30px;
    padding-top:10px
}
 .el-header div {
        display:flex;
        align-items:center;
      
    }
     .el-header span{
            margin-left:15px;
        }
        .iconfont{
            margin-right:10px;
        }
        .el-aside .el-menu{
            border-right:none;

        }
        .toggle-button{
            background-color:#4a5064;
            font-size:10px;
            line-height:24px;
            color:#fff;
            text-align:center;
            letter-spacing:0.2em;
            cursor:pointer;
        }
</style>