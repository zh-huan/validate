/**
 * 验证规则
 */
import validator from './validator.js'

import mixin from './mixin.js'

const isObject = (obj) => obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj);
const isString = (obj) => obj !== null && obj && typeof obj === 'string';

let Vue = null;
/*
* valedateUtil 实例
* */
export let pluginInstance;

class validateUtil {
  static install(_vue, options) {
    if (Vue && _vue === Vue) {
      return;
    }
    Vue = _vue;
    pluginInstance = new validateUtil();
    Vue.mixin(mixin)
    Vue.directive('validate', {
      //指令第一次绑定到元素时调用
      bind: function (el, binding, vnode, oldnode) {
        pluginInstance.bindfunc(el, binding, vnode, oldnode)
      },
    })
  }

  static get instance() {
    return pluginInstance;
  }

  bindfunc(el, binding, vnode, oldnode) {
    let vm = vnode.context;
    let validate = this.createVM(vm);
    this.addValidateRules(el, binding, vnode, oldnode,validate);
    let vaType = el.getAttribute("validate-type");
    //v-validate:name.change='rules'
    if (!vaType && binding.modifiers){
      let types=Object.keys(binding.modifiers)
      types&&types.length&&(vaType=types[0]);
    }
    switch (vaType) {
      case "change":
        this.change(el, binding, vnode, oldnode, validate);
        break;
      case "input":
        this.oninput(el, binding, vnode, oldnode,validate);
        break;
      default:
        // this.change(el, binding, vnode, oldnode, validate);
        break;
    }
  }

  //将验证规则放置 _validateRules
  addValidateRules(el, binding, vnode, oldnode,validate) {
    let name = el.getAttribute("validate-name");
    let dataRules = el.getAttribute("data-rules");
    //v-validate:name='rules'
    if (!name && binding.arg) name = binding.arg;
    if (!dataRules && binding.value) dataRules = binding.value;
    let rules, ruleName, ruleMap ={},msgMap={};
    if (isObject(dataRules)) {
      ruleMap = dataRules.rules;
      msgMap= dataRules.msg
    } else if (isString(dataRules)) {
      rules = dataRules.split(" ");
      for (let item of rules) {
        if(!item) continue;
        let ruleArr = item.split("|");
        let ruleParams = [];
        for (let i = 0; i < ruleArr.length; i++) {
          if (i === 0) {
            ruleName = ruleArr[i];
          }
          else {
            try {
              ruleParams.push(ruleArr[i] * 1);
            } catch (e) {
              console.error(e);
            }
          }
        }
        ruleMap[ruleName]=ruleParams;
        let itemtip=el.getAttribute(`validate-tips-${ruleName}`);
        itemtip&&itemtip.length&&(msgMap[ruleName]=itemtip);
      }
    }
    validate._validateRules[name] = ruleMap;
    validate._validateMsgs[name] = msgMap;
    //存储每个验证元素（貌似没啥用了）
    validate._validatePositions[name]=el;
  }

  change(el, binding, vnode, oldnode, validate) {
    el.addEventListener('change', () => {
      this.check(el, binding, validate);
    })
  }

  oninput(el, binding, vnode, oldnode,validate) {
    el.addEventListener('input', () => {
      this.check(el, binding, validate);
    })
  }

  check(el, binding, validate) {
    let name = el.getAttribute("validate-name");
    if (!name && binding.arg) name = binding.arg;
    let rules = validate._validateRules[name],msgMap=validate._validateMsgs[name];
    let checkobj={
      name:name,
      rules:rules,
      msg:msgMap,
      value:el.value,
      el:el,
    }
    this.checkItem(checkobj,validate);
  }
  checkItem(checkobj,validate){
    let name=checkobj.name,rules=checkobj.rules,msgMap=checkobj.msg,value=checkobj.value,el=checkobj.el;
    let ruleName, ruleParams,ruleResult = true;
    !rules&&(rules=validate._validateRules[name]);
    !msgMap&&(msgMap=validate._validateMsgs[name]);
    !el&&(el=validate._validatePositions[name]);
    for (let key of Object.keys(rules)) {
      ruleName = key;
      ruleParams = rules[key];
      if (ruleName in validator.methods && ruleName in validator.message) {
        let _result = validator.methods[ruleName](value, el, ruleParams);
        ruleResult = _result;
        if (!_result) {
          let msg=validator.message[ruleName];
          if(msgMap&&msgMap[ruleName]){
            msg=msgMap[ruleName];
          }
          let errmsg = this.msgFormat(msg, ruleParams);
          validate.setErrors(name, errmsg,el);
          break;
        }
      }
    }
    //全部验证通过，清空错误信息
    if (ruleResult) {
      validate.removeErrorMsg(name);
    }
    return ruleResult;
  }
  msgFormat(msg, param) {
    if (param !== undefined && param.constructor === Array) {
      param.forEach(function (value, index) {
        msg = msg.replace(new RegExp("\\{" + index + "\\}", "g"), function () {
          return value;
        });
      });
    }
    return msg;
  }

  // 挂在vue实例上面$validate
  createVM(vm) {
    if (!vm.$validator) {
      let validate = new validateMsg();
      vm.$validator = validate;
    }
    return vm.$validator;
  }

  checkAll(ckecklist,options,validate){
    let result=true;
    if(!ckecklist||!ckecklist.length){
      ckecklist=[];
      for(let key of Object.keys(validate._validateRules)){
        let checkItem={
          name:key,
          rules:validate._validateRules[key],
          msg:validate._validateMsgs[key],
          value:validate._validatePositions[key].value,
          el:validate._validatePositions[key],
        };
        ckecklist.push(checkItem);
      }
    }
    if(ckecklist&&ckecklist.length){
      for(let checkitem of ckecklist){
        //是否仅验证加了 v-validate 的元素
        if(options&&options.strict){
          if(!validate._validatePositions[checkitem.name])
            continue;
        }
        let itemresult=this.checkItem(checkitem,validate);
        result&&(result=itemresult);
      }
    }
    return result;
  }
}

export default validateUtil;
