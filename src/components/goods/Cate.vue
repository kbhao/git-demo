<template>
  <div>
<!--面包屑-->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
 
</el-breadcrumb>
<!--  fen       ge    fu   -->

<!-- 卡片视图区-->
<el-card>
    <el-row>
        <el-col>

<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>

        </el-col>
    </el-row>


<!--表格-->
<tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" show-index index-text="#" :expand-type="false" border 
:show-row-hover="false">
<template slot="isok" slot-scope="scope">  <i class="el-icon-close" 
v-if="scope.row.cat_deleted === false" style="color:lightgreen;"
></i> 
<i class="el-icon-check" v-else tyle="color:red;">
    </i>
    
    </template>


<template slot="order" slot-scope="scope">
<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
<el-tag type="success" size="mini" v-if="scope.row.cat_level ===1">二级</el-tag>
<el-tag type="warning" size="mini" v-else>三级</el-tag></template>


<!--操作-->
<template slot="opt" slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
       <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button></template>
</tree-table>

<!--分页区域-->
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10,15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!--添加分类的对话框-->
<el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%"
  >
<!--添加分类的表单-->
<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <!--表单中的父类框-->
   <el-form-item label="父级分类" >
       <!--props用来指定配置对象 options用来指定数据源-->
     <el-cascader expand-trigger="hover"
    v-model="selectedKeys" 
    :options="parentCateList"
     :props="cascaderProps"
    @change="parentCateChanged" clearable change-on-select
    @close="addCateDialogClosed"
    ></el-cascader>
  </el-form-item>
</el-form>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogClosed">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>







  </div>
</template>

<script>
export default {
    data(){
        return{
            //查询条件
            querInfo:{
                //请求全部数据
                type:3,
                //一页数据
                pagenum:1,
                //一页五条
                pagesize:5
            },
            //商品分类的数据列表，默认为空
            catelist:[],
            total:0,
            columns:[{
                label:'分类名称',
                prop:'cat_name',
            },{
                label:'是否有效',
                type:'template',
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
             {
                label:'操作',
                type:'template',
                template:'opt'
            }
            ],
            //控制添加分类对话框的显示
            addCateDialogVisible:false,
            //添加分类的表单数据对象
            addCateForm:{
                cat_name:'',
                //父级分类的ID
                cat_pid:0,
                //分类的等级，默认要添加的是1级分类
                cat_level:0
            },
            addCateFormRules:{
                cat_name:[
                    {
                        required:true,
                        message:'请输入分类名称',
                        trigger:'blur'
                    }
                ]
            },
            //父级分类的列表
            parentCateList:[],
            //指定级练选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //选中的父级分类的ID是数组
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取商品数据
       async getCateList(){
        const {data:res} = await this.$http.get('categories',{params: this.querInfo})
       if(res.meta.status !==200){
           return this.$message.error('请求数据失败')
       }
       
       //把数据列表赋值给数组
       this.catelist = res.data.result
       //为总数据条数赋值
      this.total = res.data.total
       },
       //监听pagesize改变
       handleSizeChange(newSize){
          this.querInfo.pagesize = newSize
          this.getCateList()
       },//监听pagenum改变
       handleCurrentChange(newPage){
           this.querInfo.pagenum = newPage
           this.getCateList()
       },
       showAddCateDialog(){
           this.getParentCateList()
           this.addCateDialogVisible = true
       },
       async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{
          params:{type:2}
      })
      if(res.meta.status !== 200){
          return this.$message.error('获取父级数据失败')

      }
      this.parentCateList = res.data
       },//选择项发生变化触发这个函数
       parentCateChanged(){
       if(this.selectedKeys.length > 0){
           this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
           //伟当前分类的等级赋值
           this.addCateForm.cat_level = this.selectedKeys.length
           return
       }else{
            this.addCateForm.cat_pid = 0
             this.addCateForm.cat_level = 0

       }
       },
       //添加新分类
       addCate(){
           this.$refs.addCateFormRef.validate(async valid =>{
               if(!valid) return
           const{data:res} =  await this.$http.post('categories',this.addCateForm)
           if(res.meta.status !== 201){
               return this.$message.error('添加分类失败')
           }
           this.$message.success('添加分类成功')
           this.getCateList()
            this.addCateDialogVisible = false
           })

       },
       addCateDialogClosed(){
       this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      }
    }

}
</script>

<style>
.treeTable{
    margin-top:15px;
}
</style>