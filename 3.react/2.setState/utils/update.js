class Component {
  constructor() {
    this.state = { number: 0, name: '1234' }
    this.batchUpdate = false
    this.updateQueue = []
    this.callbackQueue = []
    let oldAdd = this.add
    this.add = () => {
      this.batchUpdate = true
      oldAdd.apply(this, arguments)
      this.flushUpdate()
    }
  }

  setState(partialState, callback) {
    if(this.batchUpdate) {
      this.updateQueue.push(partialState)
      if(callback) {
        this.callbackQueue.push(callback)
      }
    } else {
      let state = this.state
      this.state = {...state, ...(typeof partialState == 'function' ? partialState(state) : partialState)}
      if(callback) {
        callback()
      }
    }

  }
  flushUpdate() {
    let state = this.state
    for (let i = 0; i < this.updateQueue.length; i++) {
      let partialState = typeof this.updateQueue[i] === 'function' ? this.updateQueue[i](state) : this.updateQueue[i]
      state = { ...state, ...partialState}
    }
    this.state = state
    this.callbackQueue.forEach(callback => callback());
    this.updateQueue = []
    this.callbackQueue = []
    this.batchUpdate = false
  }

  add() {
    // this.batchUpdate = true

    // this.setState({number: this.state.number + 1})
    // this.setState({ number: this.state.number + 1 })
    // this.setState({ number: this.state.number + 1 })

    // console.log(this.state)
    // setTimeout(() => {
    //   this.setState({ number: this.state.number + 1 })
    //   console.log(this.state)
    //   this.setState({ number: this.state.number + 1 })
    //   console.log(this.state)
    // });

    this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
      console.log(this.state.number)
    })
    this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
      console.log(this.state.number)
    })
    this.setState({ number: this.state.number + 1 })
    this.setState((prevState) => ({ number: prevState.number + 1 }), () => {
      console.log(this.state.number)
    })

    // this.flushUpdate()
  }
}

let c = new Component()
c.add()
