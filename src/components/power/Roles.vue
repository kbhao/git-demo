<template>
  <div>   
      <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  
</el-breadcrumb>

<!--卡片视图-->
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary">添加角色</el-button>
        </el-col>
    </el-row>

    <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id" closable @close="removeRightById(scope.row,item1.id)">
                   <el-col :span="5">
                       <el-tag>{{item1.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                   </el-col>

                   <el-col :span="19">

                      <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id" closable @close="removeRightById(scope.row,item2.id)">
                          <el-col :span="6">
                       <el-tag type="success"> {{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                        
                   </el-col>
                   <el-col :span="18">
                       <el-tag  type="warning" v-for="(item3,) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                           {{item3.authName}}
                       </el-tag>
                   
                   </el-col>
                      
                   </el-row>
                   </el-col>
                   
                   
                </el-row>
            </template>
        </el-table-column>
         
        <el-table-column type="index"></el-table-column>
        
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
            <!---->
            <el-button type="primary"  size="mini" icon="el-icon-edit">编辑</el-button>
             <el-button type="danger"  size="mini" icon="el-icon-delete">删除</el-button>
              <el-button type="warning"  size="mini" icon="el-icon-setting" @click="showSetRightDialog()">分配</el-button>
          
        </el-table-column>
       
    </el-table>
</el-card>
<!--展示对话框-->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%">
<!--树型-->
  <el-tree :data="rightslist" :props="treeProps" default-expand-all
   :default-checked-keys="defKeys"  show-checkbox node-key="id"
   ref="treeRef"
   ></el-tree>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>


</div>
</template>

<script>
export default {
  data(){
      return{
          //所有角色列表的数据
      rolelist:[],
       //控制分配权限对话框的显示与隐藏
       setRightDialogVisible:false,
        rightslist:[],
        treeProps:{
            label:'authName',
            children:'children'
        },
        defKeys:[],
        roleId:''
      }

  },
  created(){
      this.getRolesList()
  },
  methods:{
     async getRolesList(){
       const {data:res} = await this.$http.get('roles')
       if(res.meta.status !== 200){
           return this.$message.error('获取角色失败')
      }
      this.rolelist = res.data
      console.log(this.rolelist);
  },
  //根据ID删除对应的权限
  async removeRightById(role,rightId){
//弹框是否删除
    const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
            return this.$message.info('取消了删除')
        }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200){return this.$message.error('删除失败')
      }
      role.children = res.data
 },
 //展示分配权限的对话框
 async showSetRightDialog(){
    
     //显示之前,获取所有权限的数据
    const {data:res} = await this.$http.get('rights/tree')
     if(res.meta.status !== 200){
         return this.$message.error('获取权限数据失败')
     }
    this.rightslist = res.data 

   this.setRightDialogVisible = true
 },
async allotRights(){
    const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
    ]
  
}
 
}
}
</script>

<style>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom:1px solid #eee;
}
.vcenter{
    display:flex;
    align-items:center;
}

</style>