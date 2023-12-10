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

    test("Zero index makes the child note first", () => {
      const notebook = new Notebook()
      const zero = { text: '0' }
      const first = { text: '1' }
      const second = { text: '2' }
      notebook.relate([{ parent: notebook.home, child: first }])
      notebook.relate([{ parent: notebook.home, child: second }])
      notebook.relate([{ parent: notebook.home, child: zero, index: 0 }])
      expect(notebook.children(notebook.home)).toStrictEqual([zero, first, second])
    })
  })

  describe(".children()", () => {
    test('Returns notes in order', () => {
      const notebook = new Notebook()
      const a = { text: 'A' }
      const b = { text: 'B' }
      notebook.relate([{ parent: notebook.home, child: a }])
      notebook.relate([{ parent: notebook.home, child: b }])
      expect(notebook.children(notebook.home)).toStrictEqual([a, b])
    })
  })

  // todo: unrelate
  // todo: parents
  // todo: ancestors
  // todo: descendants
})
