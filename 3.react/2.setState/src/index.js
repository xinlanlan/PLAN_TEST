import React, { Component } from 'react';
import ReactDOM from 'react-dom'

/**
 * 属性 父组件传过来的，自己是不能控制，也不能改变
 * 状态 状态是组件自己内部产生的维护的,由自己维护，外界无法访问。唯一改变状态 的方式就是setState
 */

/**
 * 直接修改状态视图无法更新(例如： this.state.number = 10), 需要使用setState方法，方法执行完成之后会自动更新视图 
 */

class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  add = () => {
    // this.setState({number: this.state.number + 1 })
    // this.setState({ number: this.state.number + 1 })
    // this.setState({ number: this.state.number + 1 })
    // console.log(this.state.number)
    // setTimeout(() => {
    //   this.setState({ number: this.state.number + 1 })
    //   console.log(this.state.number)
    //   this.setState({ number: this.state.number + 1 })
    //   console.log(this.state.number)
    // });
    
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
  render() {
    return (
      <div>
        <div>{this.state.number}</div>
        <button onClick={this.add}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<Clock />, document.getElementById('root'))