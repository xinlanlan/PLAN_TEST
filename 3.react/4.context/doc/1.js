// context
import React from 'react';
import ReactDOM from 'react-dom';

let ThemeContext =  React.createContext()

class Title extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ border: `5px solid ${this.context.color}` }}>
                Title
            </div>
        )
    }
}
class Header extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ border: `5px solid ${this.context.color}` }}>
                Header
                <Title />
            </div>
        )
    }
}
class Content extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ border: `5px solid ${this.context.color}` }}>
                Content
                <button onClick={() => this.context.changeColor('red')}>变红</button>
                <button onClick={() => this.context.changeColor('green')}>变绿</button>
            </div>
        )
    }
}
class Main extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ border: `5px solid ${this.context.color}` }}>
                Main
                <Content />
            </div>
        )
    }
}

class Panel extends React.Component {
    state = { color: 'red' }
    changeColor = (color) => {
        this.setState({ color })
    }
    render() {
        let value = { color: this.state.color, changeColor: this.changeColor }
        return (
            <ThemeContext.Provider value={ value }>
                <div style={{ border: `5px solid ${this.state.color}`, width: 300 }}>
                    Panel
                    <Header />
                    <Main />
                </div>
            </ThemeContext.Provider>
        )
    }
}

ReactDOM.render(<Panel />, document.getElementById('root'));