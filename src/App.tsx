import { h, render, Component } from 'preact'
import Board from './Board'

render(<div className='container'>
  <Board height={6} width={6} />
</div>, document.querySelector('#root'))