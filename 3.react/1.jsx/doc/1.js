import React from 'react'
import ReactDOM from 'react-dom'


let element1 = <h1>hello</h1>
console.log(element1)

let element2 = React.createElement('h1', null, 'hello')
console.log(element2)

ReactDOM.render(
  element2, 
  document.getElementById('root')
)
