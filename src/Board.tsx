import { h, Component } from 'preact'
import { range } from 'ramda'

const debug = false

interface BoardProps {
  width: number
  height: number
  values: number
  onCount?: (value: number) => any
}

interface Cell {
  selected: boolean
  value: number
  index: number
  i: number
  j: number
  delete?: boolean
}

interface BoardState {
  cells?: Cell[]
  cell0?: number
  cell1?: number
  count?: number
}

function randomValue(max: number) {
  return Math.floor(Math.random() * max)
}

export default class Board extends Component<BoardProps, BoardState> {
  constructor() {
    super()

    this.state = {
      cells: null,
      cell0: -1,
      cell1: -1,
      count: 0
    }
  }

  componentDidMount() {
    const {width, height, values} = this.props
    this.setState({
      cells: range(0, width * height).map(i => ({
        selected: false,
        value: randomValue(values),
        index: i,
        i: Math.floor(i / width),
        j: i % width
      }))
    })
  }

  getIndex(i: number, j: number) {
    const {width, height} = this.props
    if (i >= 0 && i < height && j >= 0 && j < width)
      return i * this.props.width + j
    else return null
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

  swap(i0: number, i1: number) {
    const {cells} = this.state
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
  }

  selectCell(i: number, j: number) {
    const index = this.getIndex(i, j)
    const {cells, cell0} = this.state

    if (debug) {
      this.fillDown(i, j)
    } else {
      // if none selected
      if (cell0 === -1) {
        this.setState({
          cell0: index,
          cell1: -1
        })
      } else {
        const coords0 = this.getCoords(cell0)
        // if selected2 === selected1
        if (coords0.i === i && coords0.j === j) {
          this.setState({
            cell0: -1,
            cell1: -1
          })
        } else if (
          (coords0.i === i && Math.abs(coords0.j - j) === 1) ||
          (coords0.j === j && Math.abs(coords0.i - i) === 1)
        ) {
          // make swap
          const i0 = Math.min(cell0, index)
          const i1 = Math.max(cell0, index)
          const cellItem0 = cells[i0]
          const cellItem1 = cells[i1]
          if (cellItem0.value !== cellItem1.value) {
            this.swap(i0, i1)
            if (!this.findLine(i, j) && !this.findLine(coords0.i, coords0.j)) {
              // if there is no lines swap back and reset
              this.swap(i0, i1)
              this.setState({
                cell0: -1,
                cell1: -1
              })
            }
          }
          else {
            this.setState({
              cell0: -1,
              cell1: -1
            })
          }
        } else {
          this.setState({
            cell0: index,
            cell1: -1
          })
        }
      }
    }
  }

  fillDown(i: number, j: number) {
    const {cells} = this.state
    let cells1 = [...cells]
    if (i > 0) {
      for (let k = i; k > 0; k--) {
        const index0 = this.getIndex(k - 1, j)
        const index1 = this.getIndex(k, j)
        const cell0 = cells[index0]
        const cell1 = cells[index1]
        cells1 = [
          ...cells1.slice(0, index1),
          {
            ...cell1,
            value: cell0.value,
            delete: false
          },
          ...cells1.slice(index1 + 1)
        ]
      }
    }
    const indexLast = this.getIndex(0, j)
    cells1 = [
      ...cells1.slice(0, indexLast),
      {
        ...cells1[indexLast],
        value: randomValue(this.props.values),
        delete: false
      },
      ...cells1.slice(indexLast + 1)
    ]

    this.setState({
      cells: cells1
    })
  }

  findLine(i: number, j: number) {
    const {width, height} = this.props
    const {cells} = this.state
    const index = this.getIndex(i, j)
    const cell = cells[index]


    // check vertical
    let horizontal = [[i, j]]
    let k = i - 1
    while (k >= 0) {
      const indexTest = this.getIndex(k, j)
      if (cells[indexTest].value !== cell.value) {
        break
      } else {
        horizontal.push([k, j])
      }
      k -= 1
    }

    k = i + 1
    while (k < height) {
      const indexTest = this.getIndex(k, j)
      if (cells[indexTest].value !== cell.value) {
        break
      } else {
        horizontal.push([k, j])
      }
      k += 1
    }

    // check horizontal
    let vertical = [[i, j]]
    k = j - 1
    while (k >= 0) {
      const indexTest = this.getIndex(i, k)
      if (cells[indexTest].value !== cell.value) {
        break
      } else {
        vertical.push([i, k])
      }
      k -= 1
    }

    k = j + 1
    while (k < width) {
      const indexTest = this.getIndex(i, k)
      if (cells[indexTest].value !== cell.value) {
        break
      } else {
        vertical.push([i, k])
      }
      k += 1
    }

    let result = false

    if (vertical.length >= 3) {
      this.addCount(vertical.length * 100)
      vertical.map(c => this.fillDown(c[0], c[1]))
      result = true
    }

    if (horizontal.length >= 3) {
      this.addCount(horizontal.length * 100)
      horizontal.map(c => this.fillDown(c[0], c[1]))
      result = true
    }

    return result
  }

  addCount(count) {
    this.props.onCount && this.props.onCount(this.state.count + count)
    this.setState({
      count: this.state.count + count
    })
  }

  findLines() {
    const {width, height} = this.props
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.findLine(i, j)
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
              className={`cell cell-${cell.value}${selected ? ' selected' : ''}${cell.delete ? ' delete' : ''}`} />
        })}
      </div>)}
    </div>
  }
}