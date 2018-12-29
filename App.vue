<template>
  <div class="login-main">
    <div class="login-form">
      <div class="login-content">
        <div class="input_item">
          <label for="email">required range|1|100</label>
          <input class="mt-input" name="testinput" type="text" id="email" v-bind:class="{'valdate__error':errors.has('test4')}"   v-validate data-rules= "required range|1|100"  validate-name="test4" validate-type="change" validate-tips-required="请输入"  validate-tips-range="范围{0}到{1}">
          <span v-if="errors.has('test4')">{{errors.get('test4')}}</span>
        </div>
        <div class="input_item">
          <label for="email">rangelength|6|9</label>
          <input class="mt-input" v-bind:class="{'valdate__error':errors.has('test3')}"  type="text" id="email1"   v-validate:test3.change="validateTest"  >
          <span v-if="errors.has('test3')" >{{errors.get('test3')}}</span>
        </div>
        <div class="input_item">
          <label for="email">required</label>
          <input class="mt-input"  v-bind:class="{'valdate__error':errors.has('test2')}" type="text" id="email2"   v-validate data-rules= "required"  validate-name="test2">
          <span v-if="errors.has('test2')" >{{errors.get('test2')}}</span>
  </div>
  <div class="input_item">
    <label for="email">required min|100</label>
    <input class="mt-input" v-bind:class="{'valdate__error':errors.has('test1')}"  type="text" id="email3"    v-validate:test1.input data-rules= "required min|100" >
    <span v-if="errors.has('test1')" >{{errors.get('test1')}}</span>
  </div>
  <input type="submit" class="login-btn" value="验证"  @click="check();">
  <input type="submit" class="login-btn" value="清除"  @click="clear();">
  </div>
  </div>
  </div>
</template>
<script>
  export default {
    name: 'login',
    data () {
      return {
        email: '',
        validateTest: {
          rules:{
            required:true,
            rangelength: [6,9]
          },
          msg:{
            required:"请输入",
            rangelength:'长度不超过{0}到{1}'
          }
        },
        password: '',
        validatePassword: [
          {required: '', msg: ""},
          {limit: this.limit, msg: ""}
        ]
      }
    },
    methods: {
      check: function () {
        console.log(this.errors);
        console.log(this.$validator);
        this.$validator.checkAll();
      },
      clear(){
        this.$validator.clear();
      }
    }
  }
</script>
<style>
  .mt-input{
    display: inline-block;
    border: 1px solid #ccc;
    line-height: 20px;
    font-size: 12px;
    color: #333;
    vertical-align: middle;
  }
  .valdate__error{
    border: 1px solid red;
  }
</style>
