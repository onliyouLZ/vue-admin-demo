<template>
  <div id="dispatch"
       v-loading="loading"
       :element-loading-text="logadingText">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <label>年 份:</label>
        <el-date-picker
          style="width: 150px"
          v-model="summaryYear"
          type="year"
          placeholder="选择年">
        </el-date-picker>
        <label>总结类型:</label>
        <el-select v-model="summaryType"  clearable placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <label>总结名称:</label>
        <el-input style="width: 150px" v-model="summarizeName" placeholder="请输入总结名称"></el-input>
        <el-button type="primary" @click="primary">查询</el-button>
        <el-button type="success" @click="exportExcel(tableData,exportMulti)">导出</el-button>
      </div>
      <!--<el-scrollbar-->
      <!--style="height: 100%;"-->
      <!--tag="table"-->
      <!--:viewStyle="{width:'100%'}">-->
      <!--<div style="max-height: 700px">-->
      <div class="table-button">
        <el-button type="text" icon="fa  fa-plus" class="add" @click="add">新增</el-button>
        <el-button type="text" icon="fa fa-trash-o" class="add" @click="del">删除</el-button>
      </div>
      <el-table
        :data="tables"
        border
        style="width: 100%"
        height="700"
        class="tables"
        @row-click="rowClick"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        header-cell-class-name="table-header-public">
        <template v-for="item in tableHeader">
          <el-table-column
            v-if="item.type==='selection'"
            type="selection"
            width="40"
            fixed>
          </el-table-column>
          <el-table-column
            v-if="item.type==='normal'"
            :prop="item.data"
            :label="item.title"
            align="center">
          </el-table-column>
          <el-table-column
            v-if="item.data==='ATTACHMENT'"
            :label="item.title"
            width="300"
            align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.ATTACHMENT" v-for="(item,index) in scope.row.ATTACHMENT">
                <p v-if="item.type==='pdf'" style="text-align: right">
                  <a  target="_blank" :href="item.pdfurl" class="attachment">{{index+'.'}}{{item.name}}</a>
                  <i style="cursor:pointer" class="fa  fa-download" @click="downFile(item)" title="文件下载"></i>
                </p>
                <p v-if="item.type==='file'" style="text-align: right">
                  <a  class="attachment" @click="preview(item)">{{index+'.'}}{{item.name}}</a>
                  <i style="cursor:pointer" class="fa  fa-download" @click="downFile(item)" title="文件下载"></i>
                </p>
                <p v-if="item.type==='image'" style="text-align: right">
                  <a  class="attachment" @click="preview(item)">{{index+'.'}}{{item.name}}</a>
                  <i style="cursor:pointer" class="fa  fa-download" @click="downFile(item)" title="文件下载"></i>
                </p>

              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.data==='caozuo'"
            :label="item.title"
            min-width="150"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!--</div>-->
      <!--</el-scrollbar>-->
      <div class="footer" v-if="tableData.length>0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[20,40,60]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <div class="choice" v-if="multipleSelection.length>0"><span>当前页选中:{{multipleSelection.length > 0 ? multipleSelection.length+"条" : " "}}</span></div>
      </div>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :modal-append-to-body="bodyFalse"
      @close="dialogClose('ruleForm')"
      width="30%">
      <!--<el-form  ref="form" :model="form" label-width="80px" :rules="rules">-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="汛后总结标题:" prop="title">
              <el-input v-model="ruleForm.title"  placeholder="请输入汛后总结标题"></el-input>
            </el-form-item>
            <el-form-item label="填写人员:" prop="reportUserid">
              <el-input v-model="ruleForm.reportUserid"  placeholder="请输入填写人员" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总结类型:" prop="summaryType">
              <el-select v-model="ruleForm.summaryType" placeholder="请选择总结类型" style="width: 100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填写时间:" prop="summaryYear">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.summaryYear"
                type="year"
                placeholder="选择年">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容:">
              <wangEditor  :catchData="catchData" :content="ruleForm.content"></wangEditor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传文件：">
              <el-upload
                class="upload-demo"
                ref="upload"
                multiple
                :data="fileData"
                :action="upFileUrl"
                with-credentials
                :on-change="handleChange"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已上传文件列表：">
              <div class="upFile">
                <ul style="list-style: none">
                  <template v-for="(item,index) in upFileList">
                    <li>
                      <span style="float: left">{{item.name}} </span>
                      <span style="float: right;" class="iconHover">
                        <i class=" el-icon-circle-check "></i>
                        <i class=" el-icon-close " @click="delFile(item,index)"></i>
                      </span>
                    </li>
                  </template>
                </ul>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: right">
            <el-form-item style="margin-bottom: 0!important;">
              <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
    <el-dialog
      class="preview"
      :title="previewTitle"
      :visible.sync="previewVisible"
      :modal-append-to-body="bodyFalse"
      width="50%">
      <img style="width: 100%" :src="previewSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import wangEditor from '../wangEditor'
  import {checkFileExt,download,downloadFile} from "../../utils/utils";

  export default {
    name: "dispatch",
    components:{wangEditor},
    data(){
      return{
        pageSize: 20, // 每页大小默认值
        pageIndex: 1, // 默认第一页
        tableData: [],
        summaryYear:new Date(),
        options: [
          {
            value: '1',
            label: '年中总结'
          },
          {
            value: '2',
            label: '年终总结'
          }],
        summaryType: "",
        summarizeName:"",
        currentPage4: 1,
        fileList: [],
        upFileList:[],
        upFileUrl:this.$url.uploadUrl,
        tableHeader:[
          {data:'',title:'',type:"selection"},
          {data:'TITLE',title:'总结名称',type:"normal"},
          {data:'SUMMARY_YEAR',title:'总结年份',type:"normal"},
          {data:'NAME',title:'总结类型',type:"normal"},
          {data:'REALNAME',title:'填写人员',type:"normal"},
          {data:'GNAME',title:'填写单位',type:"normal"},
          {data:'CREATE_TIME',title:'填写时间',type:"normal"},
          {data:'ATTACHMENT',title:'附件',},
          {data:'caozuo',title:'操作'},
        ],
        multipleSelection:[],
        exportMulti:[],
        loading: true,
        logadingText:"加载中！",
        title:"",
        dialogVisible: false,
        previewVisible: false,
        ruleForm:{
          title:"",
          reportUserid:"管理员",
          summaryType:"",
          summaryYear:"",
          content:""
        },
        rules:{
          title: [
            { required: true, message: '请输入汛后总结标题', trigger: 'blur' },
          ],
          reportUserid: [
            { required: true, message: '请输入填写人员', trigger: 'blur' },
          ],
          summaryType:[
            { required: true, message: '请选择总结类型', trigger: 'change' }
          ],
          summaryYear:[
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
        },
        bodyFalse:false,
        previewTitle:"",
        previewSrc:"",
        screenWidth:document.body.clientWidth,
        fileData:{
          bizId:"",
          attType:"8"
        },
        flag:1,
      }
    },
    created(){
      this.search()
    },
    methods:{
      //初始化搜索
      search(){
        const that=this;
        let parms={
          "summaryYear":new Date(that.summaryYear).getFullYear(),
          "title":that.summarizeName,
          "summaryType":that.summaryType,
        };
        that.$http.post(that.$url.baseUrl+'api/guoYang/v0.1/latter-summary/gy/list',parms)
          .then((res)=>{
            if(res.status===200){
              setTimeout(()=>{
                that.loading=false;
                that.logadingText="加载中！";
                that.fileList=[];
                let data=res.data.result;
                $.each(data,(v,item)=>{
                  item.CREATE_TIME=new Date(item.CREATE_TIME).formatDate('yyyy-MM-dd');
                  if (item.ATTACHMENT) {
                    item.ATTACHMENT = JSON.parse(item.ATTACHMENT);
                    $.each(item.ATTACHMENT,(s,items)=>{
                      switch (items.type){
                        case "jpg":
                          items.type="image";
                              break;
                        case  "gif":
                          items.type="image";
                              break;
                        case  "png":
                          items.type="image";
                          break;
                        case  "jpeg":
                          items.type="image";
                          break;
                        case  "zip":
                          items.type="file";
                          break;
                        case  "rar":
                          items.type="file";
                          break;
                        case  "xls":
                          items.type="file";
                          break;
                        case  "xlsx":
                          items.type="file";
                          break;
                        case  "doc":
                          items.type="pdf";
                          break;
                        case  "docx":
                          items.type="pdf";
                          break;
                        case  "pdf":
                          items.type="pdf";
                          break;
                        case  "ppt":
                          items.type="pdf";
                          break;
                        case  "pptx":
                          items.type="pdf";
                          break;
                        default:
                          items.type="";
                              break
                      }
                    });
                  };
                });
                that.tableData=data;
              },500);
            }else{
              this.$message({
                type:"error",
                message:"获取数据失败"
              });
            }
          })
      },
      //切换每页显示多少条
      handleSizeChange(val) {
        this.pageSize = val
      },
      //翻页
      handleCurrentChange(val) {
        this.loading=true;
        this.pageIndex = val;
        setTimeout(()=>{
          this.loading=false;
        },1000)
      },
      //全选，反选
      handleSelectionChange(val) {
        if(val.length>0){
          this.multipleSelection=[];
          this.exportMulti=[];
          $.each(val,(v,item)=>{
            this.multipleSelection.push(item.ID);
            this.exportMulti.push(item);
          });
        }else{
          this.multipleSelection=[];
          this.exportMulti=[];
        }
      },
      //点击行选中
      rowClick(row, event, column){
        if(row){
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      },
      //查询
      primary(){
        this.loading=true;
        this.search();
      },
      /**
       * 导出
       * @param tableData 全部导出数据
       * @param multipleSelection 单选导出数据
       */
      exportExcel(tableData,multipleSelection){
        let tableDatas=[];
        if(multipleSelection.length>0){
          tableDatas=multipleSelection
        }else{
          tableDatas=tableData
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../vendor/Export2Excel');
          const tHeader=[];
          const filterVal=[];
          $.each(this.tableHeader,(v,item)=>{
            if(item.title && item.type){
              tHeader.push(item.title);
              filterVal.push(item.data);
            }
          });
          const list = tableDatas;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, ' 汛后总结统计表');
        })
      },
      formatJson(filterVal, jsonData){
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //行内编辑
      handleEdit(index, row) {
        const _this=this;
        _this.title="修改汛后总结";
        _this.dialogVisible=true;
        _this.ruleForm.title=row.TITLE;
        _this.ruleForm.reportUserid=row.REALNAME;
        _this.ruleForm.summaryType=row.SUMMARY_TYPE;
        _this.ruleForm.summaryYear=row.SUMMARY_YEAR;
        _this.upFileList=row.ATTACHMENT;
        _this.$http.post(_this.$url.baseUrl+'api/guoYang/v0.1/latter-summary/view/summary',{'id':row.ID}).then((res)=>{
          if(res.status===200){
            let data=res.data.result[0];
            _this.ruleForm.content=data.CONTENT
          }

        });
        this.ruleForm.id=row.ID;
      },
      //行内删除
      handleDelete(index, row) {
        this.multipleSelection=[];
        this.multipleSelection.push(row.ID);
        this.del();
      },
      preview(item){
        if(item.type==='file'){
          download(item.url,'get');
        }else if(item.type==="image"){
          this.previewSrc=item.url;
          this.previewTitle=item.name;
          this.previewVisible=true;
        }
      },
      //重置
      resetForm() {
        this.$refs['ruleForm'].resetFields();
        this.dialogVisible=false;
      },
      //关闭弹窗
      dialogClose(ruleForm){
        this.$refs[ruleForm].resetFields();
        this.$refs.multipleTable.clearSelection();
        this.upFileList=[];
        this.ruleForm={
          title:"",
          reportUserid:"管理员",
          summaryType:"",
          summaryYear:"",
          content:""
        };
      },

      del(){
        if(this.multipleSelection.length>0){
          this.$http.delete(this.$url.baseUrl+'api/guoYang/v0.1/latter-summary',{data:this.multipleSelection}).then((res)=>{
            if(res.status===200){
              this.$message({
                type:"success",
                message:"删除成功！"
              });
              this.loading=true;
              this.$refs.multipleTable.clearSelection();
              this.search();
            }else{
              this.$message({
                type:"error",
                message:"删除失败！"
              })
            }
          });
        }else{
          this.$message({
            type:"error",
            message:"请选择需要删除的数据！"
          })
        }

      },
      add(){
        this.dialogVisible=true;
        this.title='新增汛后总结';
      },
      /**
       *汛后总结新增及修改
       */
      submitForm() {
        const _this=this;
        _this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let url,msg,msg1;
            if(_this.title==="新增汛后总结"){
              url=_this.$url.baseUrl+'api/guoYang/v0.1/latter-summary/gy';
              msg="新增成功";
              msg1="新增失败";
              _this.ruleForm.reportUserid='3804'; //人员id写的假数据  需从缓存获取
              _this.ruleForm.summaryYear=new Date(this.ruleForm.summaryYear).getFullYear();
            }else{
              url=_this.$url.baseUrl+'api/guoYang/v0.1/latter-summary/gy/update';
              msg="修改成功";
              msg1="修改失败";
              _this.ruleForm.reportUserid='3804'; //人员id写的假数据  需从缓存获取
              _this.ruleForm.summaryYear=new Date(this.ruleForm.summaryYear).getFullYear();
            }

            _this.$http.put(url,_this.ruleForm).then((res)=>{
              if(res.status===200){
                if(res.data.result==="总结标题重复！"){
                  _this.$message({
                    type:"error",
                    message:"总结标题重复！"
                  });
                  _this.dialogVisible=false;
                }else{
                  _this.dialogVisible=false;
                  _this.loading=true;
                  if(_this.fileList.length>0){
                    _this.fileData.bizId=res.data.result.message;
                    _this.$refs.upload.submit();
                    _this.logadingText="文件上传中！"
                  }else{
                    this.search();
                  }
                  _this.$message({
                    type:"success",
                    message:msg
                  });
                  _this.$refs['ruleForm'].resetFields();
                }
              }else{
                _this.$message({
                  type:"error",
                  message:msg1
                });
                _this.dialogVisible=false;
                _this.$refs['ruleForm'].resetFields();
              }
            })
          } else {
            return false;
          }
        });
      },
      /**
       * 移除文件回调
       * @param file
       * @param fileList
       */
      handleRemove(file, fileList) {

      },
      /**
       * 选择文件后回调
       * @param file
       */
      handleChange(file, fileList) {
        $.each(fileList,(v,item)=>{
          let fileExt = item.name.substring(item.name.lastIndexOf("."));
          if (!checkFileExt(fileExt)) {
            this.$message({
              type:"error",
              message:item.name+"的文件格式不符，请重新选择(格式:.jpg;.png;.jpeg;.gif;.zip;.rar;.doc;.docx;.xls;.xlsx;.pdf;.ppt;.pptx;)"
            });
            fileList.splice(v,1);
          }
        });
        this.fileList=fileList;
      },
      /**
       * 上传文件之前回调限制大小
       * @param file
       * @returns {boolean}
       */
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('文件大小不能超过10MB！');
        }
        return  isLt10M;
      },
      /**
       * 文件上传成功后回调
       */
      handleAvatarSuccess(res, file){
        setTimeout(()=>{
          this.$refs.upload.clearFiles();
          this.search();
          this.$message({
            type:"success",
            message:"添加文件成功"
          });
        },500);
      },
      /**
       * 删除文件
       */
      delFile(item){
        this.$http.delete(this.$url.baseUrl+'api/attachment/v0.1/attachment',{data:{ids:[item.id]}}).then((res)=>{
          if(res.status===200){
            this.$message({
              type:'success',
              message:"删除成功"
            });
            this.upFileList.splice(item,1)
          }
        })
      },
      downFile(item){
        downloadFile(this.$url.baseUrl+'api/attachment/v0.1/attachment/download',[item.id])
      },
      catchData(value){
        this.ruleForm.content=value
      }
    },
    computed:{
      tables(){
        //实现前端分页
        return this.tableData.slice((this.pageIndex-1)*this.pageSize,this.pageIndex*this.pageSize)
      },
      total(){
        return this.tableData.length
      }
    },
    mounted(){
      const that=this;
      that.$nextTick(()=>{
        if(that.screenWidth>=1920){
          $('.tables').css('height',"700px")
        }else if(that.screenWidth<=1366){
          $('.tables').css('height',"350")
        }else if(that.screenWidth>1366 || this.screenWidth<1920){
          $('.tables').css('height',"500px")
        };
      })
    }
  }
</script>
<style scoped>
  #dispatch .box-card{
    height: calc(100vh - 89px);
  }
  #dispatch .footer{
    position: absolute;
    bottom: 10px;

  }
  #dispatch .el-pagination{
    float: left;
  }
  #dispatch .choice{
    float: left;
    padding: 2px 5px;

  }
  #dispatch .choice span{
    line-height: 28px;
    font-size: 13px;
    color: #606266;
  }
  #dispatch .el-scrollbar__bar{
    /*display: none;*/
  }
  #dispatch .table-button{
    padding-left: 5px;
    border-top: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    background: linear-gradient(to top, #dbdada 0%,#E5E5E5 10%, #efeeee 100%,#ffffff)
  }
  #dispatch .table-button .add{
    color: #333;
    font-size: 14px;
    margin-left: 0;
  }
  #dispatch .table-button .add:hover{
    color: #0a95ef;
  }
  #dispatch .attachment{
    text-decoration: underline;
    float: left;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
    color: #0a95ef;
    display: inline-block;
    /*width: 100%;*/
  }
</style>
<style lang="less">
  #dispatch .table-button .add span{
    margin-left: 5px!important;
  }
  #dispatch .el-dialog{
    width: 50%!important;
  }
  #dispatch .el-dialog .el-dialog__body{
    padding: 20px!important;
    height: 550px;
    overflow-y: auto;
  }
  #dispatch .upload-demo{
    height: 150px;
    overflow-y: auto;
  }


  #dispatch .upFile{
    height: 150px;
    overflow-y: auto;
    ul{
      li{
        line-height: 32px;
        width: 100%;
        display: inline-block;
        .iconHover{
          .el-icon-circle-check{
            display: block;
            color:#67c23a ;
            line-height: 32px;
            margin-right: 10px;
          }
          .el-icon-close{
            display: none;
            color:#666666;
            cursor: pointer;
            line-height: 32px;
            margin-right: 10px;
          }
        }

        .iconHover:hover{
          .el-icon-circle-check{
            display: none;
          }
          .el-icon-close{
            display: block;
          }
        }
      }
    }
  }
</style>
