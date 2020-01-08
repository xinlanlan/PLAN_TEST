## setState分析

### 属性和状态
- 属性 父组件传过来的，自己是不能控制，也不能改变
- 状态 状态是组件自己内部产生的维护的,由自己维护，外界无法访问。唯一改变状态 的方式就是setState

### react合成事件
- 目的：解决跨平台，兼容性问题，自己封装了一套事件机制，代理了原生的事件，像在jsx中常见的onClick、onChange这些都是合成事件
- event 并不是原始的dom对象，是react二次封装的事件对象，可以实现复用
- 在react中，合成事件和生命周期会使setState批量更新（看起来像是异步），原生自带的事件监听 addEventListener ，或者也可以用原生js、jq直接 document.querySelector().onclick 这种绑定事件的形式都属于原生事件则不会进行批量更新

### 组件类，this指向
- 一般来说在类的普通方法里的this是undefined
- 那如何让普通方法的this指定组件实例 
1. 可以使用箭头函数 例如：add = () => {}
2. 匿名函数 例如`<button onClick={() => this.add()}>+</button>`
3. 绑定this,在constructor中`this.add = this.add.bind(this)`，缺点传参不方便

### setState的题目
1. 点击执行的时候，state的状态并没有立即改变，先放入队列，最后依次进行
```
class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  add = () => {
    this.setState({number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
  }
  render() {
    return (
      <div>
        <div>{this.state.number}</div>
        <button onClick={this.add}>+</button>
      </div>
    )
  }
}

// 结果： 0
```
2. setTimeout内的代码不会批量更新，会立即执行
```
add = () => {
  this.setState({number: this.state.number + 1 })
  this.setState({ number: this.state.number + 1 })
  this.setState({ number: this.state.number + 1 })
  console.log(this.state.number)
  setTimeout(() => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
  });
}

// 结果：0, 2, 3
```
3. 如果传入函数，会先存入两个队列，限制性第一个队列，最后执行callback队列
```
add = () => {
  this.setState((prevState) => ({number: prevState.number + 1}), () => {
    console.log(this.state.number)
  })
  
  this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
    console.log(this.state.number)
  })

  this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
    console.log(this.state.number)
  })
}
  
// 结果：3, 3, 3
```
4. 前两次的setState虽然已经改变了，但是第三次直接在初始的状态基础改变的，所以前两次无效
```
add = () => {
  this.setState((prevState) => ({number: prevState.number + 1}), () => {
    console.log(this.state.number)
  })
  
  this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
    console.log(this.state.number)
  })
  this.setState({ number: this.state.number + 1 })
  this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
    console.log(this.state.number)
  })
}

// 结果：2, 2, 2
```

### 简单实现setState的原理
- setState的批量更新模式，首先实现setState传入对象的形式.
1. 批量更新模式会定义一个开关batchUpdate = false，每次执行函数打开，执行完毕关闭。
2. 定义setState函数，接受传入的对象。吧这个对象传入一个队列
3. 执行这个队列，执行完成之后关闭批量更新开关
```
class Component {
  // 构造函数
  constructor() {
    this.state = {number: 0, name: '1234'}
    this.batchUpdate = false
    this.updateQueue = []     // 存放队列的数组
  }
  // setState方法
  setState(partialState) {
    // 判断是否是批量更新
    if(this.batchUpdate) {
      this.updateQueue.push(partialState)
    } else {
      let state = this.state
      this.state = {...state, ...partialState}
    }
  }
  flushUpdate() {
    let state = this.state
    for(let i = 0; i < this.updateQueue.length; i++) {
      let partialState = this.updateQueue[i]
      state = {...state, ...partialState}
    }
    this.state = state
    this.updateQueue = []
    this.callbackQueue = []
    this.batchUpdate = false
  }
  add() {
    this.batchUpdate = true

    this.setState({number: this.state.number + 1})
    this.setState({ number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })

    console.log(this.state)

    this.flushUpdate()
  }
}

let c = new Component()
c.add()

// 使用vscode runcode一下我们可以得出结果是{ number: 0, name: '1234' }
// 我们在add方法中修改batchUpdate和执行flushUpdate修改到constructor中
constructor() {
  this.state = { number: 0, name: '1234' }
  this.batchUpdate = false
  this.updateQueue = []
  this.callbackQueue = []
  let oldAdd = this.add
  this.add = () => {
    this.batchUpdate = true
    oldAdd.apply(this, arguments)
    this.flushUpdate()
  }
}

```
有可能接受的是一个函数，我们修改一下
```
class Component {
  // 构造函数
  constructor() {
    this.state = { number: 0, name: '1234' }
    this.batchUpdate = false
    this.updateQueue = []     // 存放队列的数组
    this.callbackQueue = []   // 存放回调函数的数组
    let oldAdd = this.add
    this.add = () => {
      this.batchUpdate = true
      oldAdd.apply(this, arguments)
      this.flushUpdate()
    }
  }
  // setState方法
  setState(partialState, callback) {
    // 判断是否是批量更新
    if (this.batchUpdate) {
      this.updateQueue.push(partialState)
      // 将回调函数放入到队列中
      if(callback) {
        this.callbackQueue.push(callback)
      }
    } else {
      let state = this.state
      this.state = { ...state, ...partialState }
      this.state = { ...state, ...(typeof partialState === 'function' ? partialState(state) : partialState) }
      if(callback) {
        callback()
      }
    }
  }
  flushUpdate() {
    let state = this.state
    for (let i = 0; i < this.updateQueue.length; i++) {
      // 如果是函数则进行调用, 否则直接返回
      let partialState = typeof this.updateQueue[i] === 'function' ? this.updateQueue[i](state) : this.updateQueue[i]
      state = { ...state, ...partialState }
    }
    this.state = state
    // 修改完state后进行回调函数
    this.callbackQueue.forEach(callback => callback())
    this.updateQueue = []
    this.callbackQueue = []
    this.batchUpdate = false
  }
  add() {
    this.setState({ number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })

    console.log(this.state)
  }
}

let c = new Component()
c.add()
```
最后利用我们开始给的四道题目进行测试，和react的setState方法返回的结果一致
