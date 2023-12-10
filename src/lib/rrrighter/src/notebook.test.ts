import Notebook from './notebook'

describe('Notebook', () => {
  describe("new Notebook()", () => {
    test('Requires no arguments', () => {
      const notebook = new Notebook()
      expect(notebook).toBeInstanceOf(Notebook)
    })

    test('Given note, makes it home', () => {
      const home = { text: '🏡' }
      const notebook = new Notebook(home)
      expect(notebook.home).toStrictEqual(home)
    })

    // todo: shallow clone structure from another notebook
  });

  describe(".home", () => {
    test('Is an empty note by default', () => {
      const notebook = new Notebook()
      expect(notebook.home).toStrictEqual({ text: '' })
    })
  })

  describe(".notes()", () => {
    test('Contains only home by default', () => {
      const notebook = new Notebook()
      expect(notebook.notes()).toStrictEqual(new Set([notebook.home]))
    })
  })

  describe(".relationships()", () => {
    test('Is an empty set by default', () => {
      const notebook = new Notebook()
      expect(notebook.relationships()).toStrictEqual(new Set())
    })

    // todo: example with three notes and indexes 0-2
  })

  describe(".relate()", () => {
    test("Returns resulting relationships", () => {
      const notebook = new Notebook()
      const note = { text: 'note' }
      const relationships = notebook.relate([{ parent: notebook.home, child: note }])
      expect(relationships).toStrictEqual([{ parent: notebook.home, child: note, index: 0 }])
    })

    test("Relates different notes with identical texts", () => {
      const notebook = new Notebook()
      const firstApple = { text: '🍏' }
      const secondApple = { text: '🍏' }
      notebook.relate([{ parent: notebook.home, child: firstApple }])
      notebook.relate([{ parent: notebook.home, child: secondApple }])
      expect(notebook.notes()).toStrictEqual(new Set([notebook.home, firstApple, secondApple]))
    })
  })

  // todo: unrelate
  // todo: children
  // todo: parents
  // todo: ancestors
  // todo: descendants
})
