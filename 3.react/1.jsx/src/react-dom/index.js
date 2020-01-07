
function render(node, parent) {
  if(typeof node === 'string') {
    return parent.appendChild(document.createTextNode(node))
  }

  let type, props;
  type = node.type
  props = node.props
  if(type.isReactComponent) {
    let element = new type(props).render()
    props = element.props
    type = element.type
    if(typeof element.type === 'function') {
      return render(element, parent)
    }
  } else if(typeof type === 'function') {
    let element = type(props)
    type = element.type
    props = element.props
    if(typeof element.type === 'function') {
      return render(element, parent)
    }
  }

  let domElement = document.createElement(type)

  for(let propName in props) {
    if(propName === 'children') {
      let children = props.children
      if(Array.isArray(children)) {
        children.forEach(child => render(child, domElement))
      } else {
        render(children, domElement)
      }
    } else if(propName === 'className') {
      domElement.className = props.className
    } else if(propName === 'style') {
      let styleObject = props.style
      let cssText = Object.keys(styleObject).map(attr => {
        return `${attr.replace(/[A-Z]/g, function() {
          return `-${arguments[0].toLowerCase()}`
        })}:${styleObject[attr]}`
      }).join(';')
      domElement.style = cssText
    } else {
      domElement.setAttribute(propName, props[propName])
    }
  }
  parent.appendChild(domElement)
}

export default {
  render
}