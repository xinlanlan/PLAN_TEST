### 基础写法类
- jsx创建一个元素 `let element = <h1>hello</h1>`
- jsx被babel转义后的写法就是 `React.createElement('h1', null, 'hello')`
- 以上两种写法是一样的

- 例如我们我们给元素加一个style的属性，如下
```
let element = <h1 style={{border: '1px solid #ccc'}}></h1>

```
其中外层的{}是表达式，内层的{}表示的是一个对象


### 关于jsx
- jsx是Javascript + XML 一种吧js和html混合的写法，浏览器是不支持的，所以需要babel转义
- jsx只是一个语法糖，最终会被编译为React.createElement
- ReactElement 是构建react的最小单位
- react元素其实就是一个普通的js对象（根据这个对象绘制对应内容）
- 表达式中{}不仅可以放dom元素还可以是数组对象等

```
const names = ['1', '2', '3']
let list = []
for(let i = 0; i< names.length; i++) {
  list.push(<li>{names[i]}</li>)
}

ReactDOM.render(
  <ul>{list}</ul>,
  document.getElementById('root')
)
```
- 以上代码react会报一个错误，Each child in a list should have a unique "key" prop.意思我们要给循环的列表加key值，这个将在使用domDiff的时候进行优化

- 下面是React.Children.map方法的使用
```
let spans = [
  <span>1</span>,
  <span>2</span>,
  <span>3</span>
]

console.log(spans)
let box = React.Children.map(spans, (item, index) => <div key={index}>{item}</div>)

ReactDOM.render(
<div>{box}</div>,
  document.getElementById('root')
)
```

### 元素的更新
- 默认情况下，react元素是不可变的，我们一旦创建了，我们不会去修改它
- 如果界面需要修改，我们需要创建一个新的元素，渲染新的元素
- 如果我们主动修改属性，react会报一个错误，不能给只读属性赋值，在源码中如下
```
if(Object.freeze) {
  Object.freeze(element.props)
  Object.freeze(element)
}
```
将元素和属性进行了冻结，实现元素就是修改writeable = false


### 组件

定义组件的两种方式， 返回的是一个react的顶级元素
- 函数组件
  1. 吧所有的属性组合成一个对象
  2. 吧属性对象作为参数传递给函数组件
  3. 函数组件会返回一个react元素
  4. ReactDOM.render方法吧虚拟dom转化为真实元素并渲染到页面中

- 类的方式
  1. 收集props对象
  2. 把props对象传递给类的构造函数，然后进行new， 获取类的实例
  3. 调用render方法进行渲染，获取返回的react元素，最后插入到页面中

- 复合组件。高内聚，低耦合，功能要高度内聚，组件之间尽量减少耦合

- 纯函数组件
  1. 不改变入参
  2. 相同的参数返回的结果一定相同
  3. 不能修改作用变量之外的值。下面分别对应1、2、3的反面例子
```
// 改变了入参
function sum(a, b) {
  a = a - 10
  return a + b
}

// 相同的参数返回了不同的结果
function add (a, b) {
  return a + b + Math.random()
}

// 修改了作用域之外的变量值
let a = 100
function reduce(b) {
  a -= 10
  return b
}
```