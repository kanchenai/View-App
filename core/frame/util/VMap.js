/**
 * 使用一个简单的封装实现map功能
 * 后续可以使用原生Map，但需要验证编译后的兼容性
 */
export default class VMap{

    constructor() {
        this.data = {};

    }

    set(key,value){
        this.data[key] = value;
    }

    get(key){
        return this.data[key];
    }

    remove(key){
        var value = this.get(key);
        delete this.data[key];
        return value;
    }

    size(){
        return this.keys().length;
    }

    keys(){
        return Object.keys(this.data);
    }

    toString(){
        return this.data.toString();
    }

}

