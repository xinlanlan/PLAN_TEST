import React from './react'
import ReactDOM from './react-dom'

// 转义
// let element = <h1 id="title"><span>hello</span><span>world</span></h1>

// let element = React.createElement('h1', {id: "title"},
//   React.createElement('span', {style: {color: 'red', backgroundColor: 'yellow'}}, 'hello'),
//   React.createElement('span', {className: 'world'}, 'world')
// ) 

// function Welcome(props) {
//   return (
//     <h1 id={props.id}>
//       <span>hello</span>
//       <span>world</span>
//     </h1>
//   )
// }

function Child() {
  return <div>child</div>
}

class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <h1 id={this.props.id}>
        <span>hello</span>
        <span>world</span>
        <Child />
      </h1>
    )
  }
}

let element = React.createElement(Welcome, { id: 'title' })

ReactDOM.render(element, document.getElementById('root'))