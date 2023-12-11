import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";
import Notebook from './notebook';

describe('Notebook', () => {
  const home = { text: '🏡' }
  let notebook: Notebook

  beforeEach(() => {
    notebook = new Notebook(home)
  })

  test('Is OrderedOverlappingHierarchy', () => {
    expect(new Notebook(home)).toBeInstanceOf(OrderedOverlappingHierarchy)
  })

  describe("new Notebook()", () => {
    test('Accepts note as hierarch', () => {
      expect(notebook.hierarch).toStrictEqual(home)
    })

    test('Accepts notebook as source', () => {
      const clone = new Notebook(notebook)
      expect(clone.relationships()).toStrictEqual(notebook.relationships())
    })
  })

  describe(".home", () => {
    test('Returns hierarch', () => {
      expect(notebook.home).toStrictEqual(notebook.hierarch)
    })
  })

  describe(".notes()", () => {
    test('Returns members', () => {
      expect(notebook.notes()).toStrictEqual(notebook.members())
    })

    test('Can contain different notes with identical texts', () => {
      const firstApple = { text: '🍏' }
      const secondApple = { text: '🍏' }
      notebook.relate([{ parent: notebook.home, child: firstApple }])
      notebook.relate([{ parent: notebook.home, child: secondApple }])
      expect(notebook.notes()).toStrictEqual(new Set([notebook.home, firstApple, secondApple]))
    })
  })
})
