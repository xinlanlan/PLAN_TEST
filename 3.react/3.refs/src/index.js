import React, {useState} from 'react'
import ReactDOM from 'react-dom'

/**
 * useState
 * 1. 类有实例而且不会轻易销毁，上面还有很多附带属性，难以管理
 * 2. 多用函数组件，少用类组件，但是函数组件没有状态也没有生命周期
 * 3. useState 主要是没有实例的情况下可以使用状态(hook)
 */


function Count() {
  let [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count+1)}>+</button>
    </div>
  )
}

ReactDOM.render(<Count />, document.getElementById('root'))