<template>
  <el-dialog
    :title="swiperImage.name"
    :swiperShow="swiperShow"
    :visible.sync="visible"
    width="50%"
    @close="childClose">
    <div class="player">
      <!--首页-->
      <div  class="fl">
        <span @click="firstPage">
          <i class="fa fa-fast-backward"></i>
        </span>
      </div>
      <!--前一页-->
      <div  class="fl">
        <span @click="slidePrev">
          <i class="fa fa-backward"></i>
        </span>
      </div>
      <!--自动播放-->
      <div  class="fl">
        <span  @click="autoplay">
          <i :class="faPlay" class="fa"></i>
        </span>
      </div>
      <!--下一页-->
      <div  class="fl">
        <span @click="slideNext">
          <i class="fa fa-forward"></i>
        </span>
      </div>
      <!--最后一页-->
      <div  class="fl">
        <span @click="lastPage">
          <i class="fa fa-fast-forward"></i>
        </span>
      </div>
    </div>
    <swiper @ready="stopPlayer" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
      <template v-for="item in images">
        <swiper-slide  data-swiper-autoplay="800">
            <img :src="item.src" style="width: 100%;height: 100%" alt="">
        </swiper-slide>
      </template>
        <!-- Optional controls -->
      </swiper>
    <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="childClose">取 消</el-button>-->
      <!--<el-button type="primary" @click="childClose">确 定</el-button>-->
    <!--</span>-->
  </el-dialog>
</template>

<script>
  export default {
    name: "swiperDliog",
    data() {
      return {
        visible: this.swiperShow,
        swiperOption:{
          autoplay:{},
          speed:100,
          effect:"fade",
        },
        faPlay:"fa-play",
        images:this.swiperImage.data
      }
    },
    props:{
      swiperShow:{
        type:Boolean,
        default:false
      },
      swiperImage:{
        type:Object,
        default:{}
      },
    },
    created(){
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods:{
      /**
       * 关闭弹窗事件
       */
      childClose(){
        this.visible=false;
        this.$emit('update:swiperShow',false);
        this.images=[];
        this.swiper.autoplay.stop();
        this.faPlay="fa-play";
        this.swiper.slideTo(0,0,false);
      },
      firstPage(){
        this.swiper.slideTo(0,0,false)
      },
      slidePrev(){
        this.swiper.slidePrev(0,false)
      },
      autoplay(){
        if(this.faPlay==="fa-play"){
          this.swiper.autoplay.start();
          this.faPlay="fa-stop"
        }else{
          this.swiper.autoplay.stop();
          this.faPlay="fa-play"
        }
      },
      slideNext(){
        this.swiper.slideNext(0,false)
      },
      lastPage(){
        this.swiper.slideTo(this.images.length-1,0,false)
      },
      stopPlayer(){
        this.swiper.autoplay.stop();
      }

    },
    mounted(){


    },
    watch:{
      /**
       * 是否显示弹窗
       */
      swiperShow(){
        this.images=this.swiperImage.data;
        this.visible=this.swiperShow;
      }
    }
  }
</script>

<style lang="less" scoped>
  .player{
    width: 100%;
    height: 44px;
    line-height: 45px;
    border-bottom: 1px solid #ddd;
    .fl{
      margin-left: 25px;
      span{
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .swiper-container{
    width: 100%;
    height: 550px;
  }
</style>
