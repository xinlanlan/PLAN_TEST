import React from 'react'
import ReactDOM from 'react-dom'


let spans = [
  <span>1</span>,
  <span>2</span>,
  <span>3</span>
]

console.log(spans)

// let box = spans.map((item, index) => (
//   <div key={index}>{item}</div>
// ))

let box = React.Children.map(spans, (item, index) => <div key={index}>{item}</div>)

ReactDOM.render(
  <div>{box}</div>,
  document.getElementById('root')
)