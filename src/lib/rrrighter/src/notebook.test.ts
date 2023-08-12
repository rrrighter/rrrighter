import Notebook from './notebook'
import OverlappingHierarchy from 'overlapping-hierarchy'

describe('Notebook', () => {
  let notebook: Notebook

  beforeEach(() => {
    notebook = new Notebook()
  })

  test('Is an overlapping hierarchy', () => { // todo: remove
    expect(notebook).toBeInstanceOf(OverlappingHierarchy)
  })

  describe('.upsert()', () => {
    const note = { id: '1', text: 'upsert' }

    test('Adds a note to the empty notebook', () => {
      notebook.upsert(note)
      expect(notebook.nodes()).toEqual(new Set([note]))
    })

    test('Adding the same note twice does not duplicate it', () => {
      notebook.upsert(note)
      notebook.upsert(note)
      expect(notebook.nodes()).toEqual(new Set([note]))
    })

    test('Adding new note object with duplicate id updates note with that id', () => {
      const updated = { id: note.id, text: 'update' }
      notebook.upsert(note)
      notebook.upsert(updated)
      expect(notebook.nodes()).toEqual(new Set([{ id: '1', text: 'update' }]))
    })
  })

  describe('.findById()', () => {
    test('When not found, returns undefined', () => {
      expect(notebook.findById('404')).toBeUndefined()
    })

    test('When found, returns note', () => {
      const note = { id: '1', text: 'find me' }
      notebook.upsert(note)
      expect(notebook.findById('1')).toStrictEqual(note)
    })
  })
})
