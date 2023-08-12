import Notebook from './notebook'

const CHILD = { id: "child", text: "child" };
const PARENT = { id: "parent", text: "parent" };
const GRANDPARENT = { id: "grandparent", text: "grandparent" };

describe('Notebook', () => {
  let notebook: Notebook
  let family: Notebook

  beforeEach(() => {
    notebook = new Notebook()
    family = new Notebook()
    family.upsert(GRANDPARENT);
    family.attach(GRANDPARENT, PARENT);
    family.attach(PARENT, CHILD);
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
      expect(notebook.findById('missing')).toBeUndefined()
    })

    test('When found, returns note', () => {
      const note = { id: '1', text: 'text' }
      notebook.upsert(note)
      expect(notebook.findById('1')).toStrictEqual(note)
    })
  })

  describe(".descendants()", () => {
    test("Returns descendants", () => {
      expect(family.descendants(GRANDPARENT.id)).toStrictEqual(
          new Set([PARENT, CHILD])
      );
    });

    test("Returns undefined for non-member", () => {
      expect(family.descendants("missing")).toBeUndefined();
    });
  });

  describe(".ancestors()", () => {
    test("Returns ancestors", () => {
      expect(family.ancestors(CHILD.id)).toStrictEqual(
          new Set([GRANDPARENT, PARENT])
      );
    });

    test("Returns undefined for non-member", () => {
      expect(family.ancestors("missing")).toBeUndefined();
    });
  });
})
