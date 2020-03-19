// 使用函数组件的上下文

import React from 'react';
import ReactDOM from 'react-dom';

let ThemeContext = React.createContext()


function Title(props) {
    return (
        <ThemeContext.Consumer>
            {
                (value) => (
                    <div style={{ border: `5px solid ${value.color}` }}>
                        Title
                    </div>
                )
            }
        </ThemeContext.Consumer>
    )
}

function Header(props) {
    return (
        <ThemeContext.Consumer>
            {
                (value) => (
                    <div style={{ border: `5px solid ${value.color}` }}>
                        Header
                        <Title />
                    </div>
                )
            }
        </ThemeContext.Consumer>
    )
}

function Content(props) {
    return (
        <ThemeContext.Consumer>
            {
                (value) => (
                    <div style={{ border: `5px solid ${value.color}` }}>
                        Content
                        <button onClick={() => value.changeColor('red')}>变红</button>
                        <button onClick={() => value.changeColor('green')}>变绿</button>
                    </div>
                )
            }
        </ThemeContext.Consumer>
    )
}

function Main(props) {
    return (
        <ThemeContext.Consumer>
            {
                (value) => (
                    <div style={{ border: `5px solid ${value.color}` }}>
                        Main
                        <Content />
                    </div>
                )
            }
        </ThemeContext.Consumer>
    )
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