const isBuiltInComponent = (vnode) => {
    if (!vnode) {
        return false;
    }
    const tag = vnode.componentOptions.tag;
    return /^(keep-alive|transition|transition-group)$/.test(tag);
};
import {validateMsg} from './validateMsg.js'
export default {
        beforeCreate() {
            if (isBuiltInComponent(this.$vnode)) {
                return;
            }
            if (!this.$validator) {
                this.$validator = new validateMsg(this._uid);
            }
            if (this.$validator) {
                const Vue = this.$options._base;
                //定义errors为响应式属性
                Vue.util.defineReactive(this.$validator, 'errors', this.$validator.errors);
            }
            if (!this.$options.computed) {
                this.$options.computed = {};
            }
            this.$options.computed['errors'] = function errorBagGetter() {
                return this.$validator.errors;
            };

        },
        //清空所有验证信息
        beforeDestroy() {
          if(this.$validator){
            let id=this._uid;
            this.$validator.clearMsg(id);
          }
        }
    }
