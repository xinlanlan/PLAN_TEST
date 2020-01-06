import React, {Component} from 'react'
import ReactDOM from 'react-dom'

/**
 * 定义组件两种方式
 * 一种是函数组件，一种是类的方式
 * 返回的是一个react的顶级元素
 */

// function Welcome(props) {
//   return (
//     <h1>hello {props.name}</h1>
//   )
// }

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <h1>hello {this.props.name}</h1>
    )
  }
}

console.log(<Welcome name="world"/>)

ReactDOM.render(<Welcome name="world"/>, document.getElementById('root'))