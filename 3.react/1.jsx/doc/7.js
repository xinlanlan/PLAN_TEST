/**
 * 属性：父组件传递过来的，不能控制也不能改变
 * 状态：组件内部产生维护，由自己维护，外界无法访问
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class Clock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      number: 1
    }
  }
  add() {
    this.setState({number: this.state.number + 1})
  }
  render() {
    return (
      <div>
        <div>{this.state.number}</div>
        <button onClick={() => this.add()}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById('root'))
