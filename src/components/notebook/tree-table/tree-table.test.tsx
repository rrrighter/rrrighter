import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import TreeTable from "./tree-table";
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import failOnConsole from 'jest-fail-on-console'

// todo: move to general setup
failOnConsole()

let notebook: Notebook
let hierarch: Note = { id: '1', text: 'H2' + Math.random().toString() }
let child: Note = { id: '2', text: 'C' + Math.random().toString() }

beforeEach(() => {
  notebook = new Notebook()
  notebook.upsert(hierarch)
  notebook.upsert(child)
  notebook.attach(hierarch.id, child.id)
})

// todo extract to global setup
// https://github.com/ant-design/ant-design/issues/21096
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }
}

test('Shows hierarchs by default', async () => {
  render(<TreeTable notebook={notebook} />)
  expect(screen.getByText(hierarch.text)).toBeInTheDocument()
})

test('Does not show descendants by default', async () => {
  render(<TreeTable notebook={notebook} />)
  expect(screen.queryByText(child.text)).not.toBeInTheDocument()
})

// todo group in describe Sorting

test('Sorts notes by text in ascending natural sort order by default', async () => {
  const notebook = new Notebook()
  const noteA = { id: '2', text: 'A' }
  const noteB = { id: '1', text: 'B' }
  notebook.upsert(noteB)
  notebook.upsert(noteA)
  // todo: extend with more cases with 1/10/2
  // todo: sorting for 1/2/10/11/20 // https://stackoverflow.com/a/38641281
  const isNodesInOrder = (precedingNode: HTMLElement, followingNode: HTMLElement) => {
    return precedingNode.compareDocumentPosition(followingNode) === 4
  }
  render(<TreeTable notebook={notebook} />)
  const a = screen.getByText(noteA.text)
  const b = screen.getByText(noteB.text)
  expect(isNodesInOrder(a, b)).toStrictEqual(true)
  expect(isNodesInOrder(a, b)).toStrictEqual(true)
})

// test('Clicking Text column header changes sorting to descending', async () => {
//   const notebook = new Notebook()
//   const noteB = { id: '1', text: 'B' }
//   const noteA = { id: '2', text: 'A' }
//   notebook.upsert(noteB)
//   notebook.upsert(noteA)
//   const isNodesInOrder = (precedingNode: HTMLElement, followingNode: HTMLElement) => {
//     return precedingNode.compareDocumentPosition(followingNode) === 4
//   }
//   render(<TreeTable notebook={notebook} />)
//   fireEvent.click(await screen.findByText('Text'))
//   const a = screen.getByText(noteA.text)
//   const b = screen.getByText(noteB.text)
//   expect(isNodesInOrder(b, a)).toStrictEqual(true)
// })

test('Shows 100+ notes without pagination', async () => {
  for(let n = 0; n < 100; n++) {
    notebook.upsert({ id: 'Note' + n, text: 'Note' + n })
  }
  render(<TreeTable notebook={notebook} />)
  for(let n = 0; n < 100; n++) {
    expect(screen.getByText('Note' + n)).toBeInTheDocument()
  }
})

// test('Expanding child with multiple parents throws no warnings', () => {
//   const hierarch2 = { id: 'H2', text: 'H2' + Math.random().toString() }
//   notebook.upsert(hierarch2)
//   notebook.attach(hierarch2, child)
//   render(<TreeTable notebook={notebook} />)
//   fireEvent.click(screen.getAllByRole('button', { name: 'Expand row'} )[0])
//   fireEvent.click(screen.getAllByRole('button', { name: 'Expand row'} )[1])
// })

describe('Hierarchy', () => {
  test('Expanding hierarch shows second hierarchy level', async () => {
    render(<TreeTable notebook={notebook} />)
    fireEvent.click(screen.getByRole('button', { name: 'Expand row'} ))
    expect(screen.getByText(child.text)).toBeInTheDocument()
  })

  test('Shows no expand button for leaf notes', async () => {
    const notebook = new Notebook()
    notebook.upsert({ id: '1', text: 'Orpan' })
    render(<TreeTable notebook={notebook} />)
    expect(screen.queryByRole('button', { name: 'Expand row'} )).not.toBeInTheDocument()
  })
})
