const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

class Component {
  constructor(props) {
    this.props = props
  }
  static isReactComponent = true
}

function createElement(type, config, children) {
  let props = {}
  for (let key in config) {
    // console.log(config[key])
    // props[key] = config[key]
    if (
      hasOwnProperty.call(config, key) &&
      !RESERVED_PROPS.hasOwnProperty(key)
    ) {
      props[key] = config[key];
    }
  }
  const childrenLength = arguments.length - 2
  if (childrenLength === 1) {
    props.children = children
  } else if (childrenLength > 1) {
    props.children = Array.prototype.slice.call(arguments, 2)
  }

  return { $$typeof: REACT_ELEMENT_TYPE, type, props }

}

export default {
  createElement,
  Component
}