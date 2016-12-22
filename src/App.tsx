import { h, render, Component } from 'preact'
import Board from './Board'

class App extends Component<any, {
  count?: number
}> {
  constructor() {
    super()
    this.state = {
      count: 0
    }
  }
  
  render() {
    return <div>
      <div className='count'>count: {this.state.count}</div>
      <div className='container'>
        <Board
          height={6}
          width={6}
          values={4}
          onCount={count => this.setState({ count })} />
      </div>
    </div>
  }
}

render(<App />, document.querySelector('#root'))