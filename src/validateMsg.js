/*
* 错误消息
* */
import {pluginInstance} from "./plugin";

class ErrorBag {
    constructor(id) {
        this.id = id;
        this.errors = [];
        this.fileds = [];
    }

    setErrors(name, msg,el) {
        let errorIndex = this.errors.findIndex(x => x.name === name);
        if (errorIndex > -1 && errorIndex < this.errors.length) {
            this.errors[errorIndex].msg = msg;
        } else {
            let error = {
                name: name,
                msg: msg,
            };
            this.errors.push(error);
        }
        if (this.fileds.indexOf(name) < 0) this.fileds.push(name);
    }

    deleteErrors(name) {
        let index = this.errors.findIndex(item => item.name === name);
        if (index > -1 && index < this.errors.length) {
            this.errors.splice(index, 1);
        }
        index = this.fileds.findIndex(item => item === name);
        if (index > -1 && index < this.fileds.length) {
            this.fileds.splice(index, 1);
        }
    }

    clear() {
        this.errors = [];
        this.fileds = [];
    }

    get(name) {
        let error = this.errors.filter(item => item.name === name);
        return error && error.length?error[0].msg : null;
    }

    has(name) {
        if(this.errors){
            let error = this.errors.filter(item => item.name === name);
            return error && error.length;
        }
        return false;
    }

    all(){
        return this.errors;
    }
    hasAny(){
        return this.errors.length
    }
}

/*
* 验证信息
* */
export class validateMsg {
    constructor(id) {
        this.id=id;
        this.errors = new ErrorBag(id);
        this._validateRules = {};
        this._validateMsgs = {};
        this._validatePositions = {};
    }

    setErrors(name, msg,position) {
        this.errors.setErrors(name, msg,position);
    }

    removeErrorMsg(name) {
        this.errors.deleteErrors(name);
    }
    clearMsg(id) {
        if(this.id===id){
            this.errors.clear();
        }
    }

    checkAll(checklist,options){
        return pluginInstance.checkAll(checklist,options,this);
    }
    clear(){
        this.errors.clear();
    }
}
