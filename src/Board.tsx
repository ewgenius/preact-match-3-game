import { h, Component } from 'preact'
import { range } from 'ramda'

interface BoardProps {
  width: number
  height: number
}

interface Cell {
  selected: boolean
  value: number
  index: number
  i: number
  j: number
}

interface BoardState {
  cells?: Cell[]
  cell0?: number
  cell1?: number
}

function randomValue(max: number) {
  return Math.floor(Math.random() * (max + 1))
}

export default class Board extends Component<BoardProps, BoardState> {
  constructor() {
    super()

    this.state = {
      cells: null,
      cell0: -1,
      cell1: -1
    }
  }

  componentDidMount() {
    const {width, height} = this.props
    this.setState({
      cells: range(0, width * height).map(i => ({
        selected: false,
        value: randomValue(6),
        index: i,
        i: Math.floor(i / width),
        j: i % width
      }))
    })
  }

  getIndex(i: number, j: number) {
    return i * this.props.width + j
  }

  getCoords(i: number) {
    return {
      i: Math.floor(i / this.props.width),
      j: i % this.props.width
    }
  }

  getCell(i: number, j: number) {
    const index = this.getIndex(i, j)
    if (index < this.state.cells.length)
      return this.state.cells[index]
    else return null
  }

  selectCell(i: number, j: number) {
    const index = this.getIndex(i, j)
    const {cells, cell0, cell1} = this.state
    const cell = cells[index]
    if (cell0 === -1) {
      this.setState({
        cell0: index,
        cell1: -1
      })
    } else {
      const coords0 = this.getCoords(cell0)
      if (coords0.i === i && coords0.j === j) {
        this.setState({
          cell0: -1,
          cell1: -1
        })
      } else if (
        (coords0.i === i && Math.abs(coords0.j - j) === 1) ||
        (coords0.j === j && Math.abs(coords0.i - i) === 1)
      ) {
        const i0 = Math.min(cell0, index)
        const i1 = Math.max(cell0, index)
        const cellItem0 = cells[i0]
        const cellItem1 = cells[i1]
        this.setState({
          cell0: -1,
          cell1: -1,
          cells: [
            ...cells.slice(0, i0),
            {
              ...cellItem0,
              value: cellItem1.value
            },
            ...cells.slice(i0 + 1, i1),
            {
              ...cellItem1,
              value: cellItem0.value
            },
            ...cells.slice(i1 + 1)
          ]
        })
        /*this.setState({
          cell1: index
        })*/
      } else {
        this.setState({
          cell0: index,
          cell1: -1
        })
      }
    }
  }

  render() {
    const {width, height} = this.props
    const {cells, cell0, cell1} = this.state
    return <div className='board'>
      {cells && range(0, height).map(i => <div className='row'>
        {range(0, width).map(j => {
          const cell = this.getCell(i, j)
          const selected = cell.index === cell0 || cell.index === cell1
          if (cell)
            return <div
              onClick={() => this.selectCell(i, j)}
              className={`cell cell-${cell.value}${selected ? ' selected' : ''}`}>
              {cell.i}:{cell.j} = {cell.value}
            </div>
        })}
      </div>)}
    </div>
  }
}