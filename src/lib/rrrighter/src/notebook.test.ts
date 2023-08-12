import Notebook from './notebook'
import {LoopError, CycleError, ConflictingParentsError} from "overlapping-hierarchy";

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
    family.upsert(PARENT);
    family.upsert(CHILD);
    family.attach(GRANDPARENT.id, PARENT.id);
    family.attach(PARENT.id, CHILD.id);
  })

  describe(".notes()", () => {
    test("Returns notes", () => {
      expect(family.notes()).toStrictEqual(
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
      expect(notebook.notes()).toEqual(new Set([note]))
    })

    test('Adding the same note twice does not duplicate it', () => {
      notebook.upsert(note)
      notebook.upsert(note)
      expect(notebook.notes()).toEqual(new Set([note]))
    })

    test('Adding new note object with duplicate id updates note with that id', () => {
      const updated = { id: note.id, text: 'update' }
      notebook.upsert(note)
      notebook.upsert(updated)
      expect(notebook.notes()).toEqual(new Set([{ id: '1', text: 'update' }]))
    })
  })

  describe(".attach()", () => {
    test("Attaching node to itself returns LoopError", () => {
      expect(family.attach(CHILD.id, CHILD.id)).toStrictEqual(
          new LoopError("Cannot attach node to itself")
      );
    });

    test("Attaching ancestor as a child returns CycleError", () => {
      expect(family.attach(CHILD.id, GRANDPARENT.id)).toStrictEqual(
          new CycleError("Cannot attach ancestor as a child")
      );
    });

    test("Attaching non-child descendant as a child returns ConflictingParentsError", () => {
      expect(family.attach(GRANDPARENT.id, CHILD.id)).toStrictEqual(
          new ConflictingParentsError(`Cannot attach child to parent's ancestor`)
      );
    });

    test("Attaches node to the parent as a child", () => {
      const grandchild = { id: "grandchild", text: "grandchild" };
      family.upsert(grandchild);
      family.attach(CHILD.id, grandchild.id);
      expect(family.children(CHILD.id)).toStrictEqual(new Set([grandchild]));
    });

    // // TODO: also test it doesn't change hierarchy
    // test("Attaching to non-existing parent returns undefined", () => { // TODO consider returning ParentNotFoundError
    //   expect(family.attach("missing", CHILD.id)).toStrictEqual(undefined);
    // });
    //
    // // TODO: also test it doesn't change hierarchy
    // test("Attaching to non-existing child returns undefined", () => { // TODO consider returning ParentNotFoundError
    //   expect(family.attach("missing", CHILD.id)).toStrictEqual(undefined);
    // });

    test("Attaches node to another parent as a child", () => {
      const anotherParent = { id: "another parent", text: "another parent" };
      family.upsert(anotherParent);
      family.attach(GRANDPARENT.id, anotherParent.id);
      family.attach(anotherParent.id, CHILD.id);
      expect(family.children(anotherParent.id)?.has(CHILD)).toStrictEqual(true);
    });

    test("Attached child has a parent", () => {
      const GREAT_GRANDPARENT = { id: 'gg', text: "great-grandparent" }
      family.upsert(GREAT_GRANDPARENT);
      family.attach(GREAT_GRANDPARENT.id, GRANDPARENT.id);
      expect(family.parents(GRANDPARENT.id)).toStrictEqual(
          new Set([GREAT_GRANDPARENT])
      );
    });
  });

  describe(".detach()", () => {
    test("Parent no longer has detached child", () => {
      family.detach(PARENT.id, CHILD.id);
      expect(family.children(PARENT.id)?.has(CHILD)).toStrictEqual(false);
    });

    test("Detached child still belongs to another parent", () => {
      const parent2 = { id: "parent2", text: "parent2" };
      family.upsert(parent2);
      family.attach(parent2.id, CHILD.id);
      family.detach(PARENT.id, CHILD.id);
      expect(family.children("parent2")?.has(CHILD)).toStrictEqual(true);
    });

    test("Child detached from the only parent still belongs to the hierarchy", () => {
      family.detach(PARENT.id, CHILD.id);
      expect(family.notes().has(CHILD)).toStrictEqual(true);
    });
  });

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
      expect(family.notes().has(PARENT)).toStrictEqual(false);
    });

    test("Removing the only node of the hierarchy empties the hierarchy", () => {
      const hierarchy = new Notebook()
      const orphan = { id: 'orphan', text: 'orphan' }
      hierarchy.upsert(orphan);
      hierarchy.remove(orphan.id);
      expect(hierarchy.notes()).toStrictEqual(new Set());
    });
  });
})
