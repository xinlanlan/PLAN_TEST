let obj = {
  name: {
    name: 'shishaofei'
  },
  arr: ['吃', '喝', '玩']
}

// 缺点是兼容性差，
// 可以代理13种方法 set get
// defineProperty 只能对特定的属性进行拦截
let handler = {
  get(target, key) {
    console.log('依赖收集')
    // 对于对象的多层嵌套，我们要使用递归代理
    // 只有取到对应值的时候才会代理
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], handler)
    }
    // return target[key]  // 老的写法
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    // 第一次key是索引，第二次是length
    console.log('触发更新', key)
    // 判断一下是新增操作还是修改操作
    let oldValue = target[key]
    console.log(oldValue, key, value)
    if (!oldValue) {
      console.log('新增属性')
    } else if (oldValue !== value) {
      console.log('修改属性')
    }

    // target[key] = value // 老的写法,设置值时老的写法会有一个问题，就是如果没有设置成功也不会报错，（对象不可配置的时候不能进行设置）
    // 新的写法如果没有设置成功会返回一个false
    return Reflect.set(target, key, value)
  }
}

let proxy = new Proxy(obj, handler)


/**
*  1.设置一个值并取一个值
*/
    // proxy.name.name
    proxy.name.name = 123