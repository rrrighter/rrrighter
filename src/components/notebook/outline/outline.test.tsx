import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Outline from "./outline";
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
  notebook.relate(hierarch.id, child.id)
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
  render(<Outline notebook={notebook} />)
  expect(screen.getByText(hierarch.text)).toBeInTheDocument()
})

test('Displays notes in insertion order', async () => {
  const notebook = new Notebook()
  const noteA = { id: '2', text: 'A' }
  const noteB = { id: '1', text: 'B' }
  notebook.upsert(noteB)
  notebook.upsert(noteA)
  const isNodesInOrder = (precedingNode: HTMLElement, followingNode: HTMLElement) => {
    return precedingNode.compareDocumentPosition(followingNode) === 4
  }
  render(<Outline notebook={notebook} />)
  const a = screen.getByText(noteA.text)
  const b = screen.getByText(noteB.text)
  expect(isNodesInOrder(b, a)).toStrictEqual(true)
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
  render(<Outline notebook={notebook} />)
  for(let n = 0; n < 100; n++) {
    expect(screen.getByText('Note' + n)).toBeInTheDocument()
  }
})
