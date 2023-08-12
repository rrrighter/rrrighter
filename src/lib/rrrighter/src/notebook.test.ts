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

  describe(".nodes()", () => {
    test("Returns nodes", () => {
      expect(family.nodes()).toStrictEqual(
          new Set([GRANDPARENT, PARENT, CHILD])
      );
    });
  });

  describe(".hierarchs()", () => {
    test("Returns hierarchs", () => {
      expect(family.hierarchs()).toStrictEqual(new Set([GRANDPARENT]));
    });
  });

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

  describe(".children()", () => {
    test("Returns children", () => {
      expect(family.children(PARENT.id)).toStrictEqual(new Set([CHILD]));
    });

    test("When parent does not exist, returns undefined", () => {
      expect(family.children("missing")).toBeUndefined();
    });

    test("Mutating returned set does not affect hierarchy", () => {
      const children = family.children(PARENT.id);
      children?.clear();
      expect(family.children(PARENT.id)?.has(CHILD)).toStrictEqual(true);
    });
  });

  describe(".parents()", () => {
    test("Given top-level node, returns nothing", () => {
      expect(family.parents(GRANDPARENT.id)).toStrictEqual(new Set());
    });

    test("Given child, returns its parents", () => {
      expect(family.parents(CHILD.id)).toStrictEqual(new Set([PARENT]));
    });

    test("Returns undefined for non-member", () => {
      expect(family.parents("missing")).toBeUndefined();
    });
  });

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

  describe(".remove()", function () {
    test("Detaches all children from the parent", () => {
      family.remove(PARENT.id);
      expect(family.parents(CHILD.id)).toEqual(new Set([]));
    });

    test("Detaches child from all parents", () => {
      family.remove(PARENT.id);
      expect(family.children(GRANDPARENT.id)?.has(PARENT)).toStrictEqual(false);
    });

    test("Hierarchy no longer has removed node", () => {
      family.remove(PARENT.id);
      expect(family.nodes().has(PARENT)).toStrictEqual(false);
    });

    test("Removing the only node of the hierarchy empties the hierarchy", () => {
      const hierarchy = new Notebook()
      const orhpan = { id: 'orphan', text: 'orphan' }
      hierarchy.upsert(orhpan);
      hierarchy.remove(orhpan.id);
      expect(hierarchy.nodes()).toStrictEqual(new Set());
    });
  });
})
