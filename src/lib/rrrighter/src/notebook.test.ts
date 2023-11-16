import Notebook from './notebook'
import {LoopError, CycleError, TransitiveReductionError} from "ordered-overlapping-hierarchy";

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

  describe("new Notebook()", () => {
    let clone: Notebook

    beforeEach(() => {
      clone = new Notebook(family);
    });

    test("Has the same notes", () => {
      expect(clone.notes()).toStrictEqual(family.notes());
    });

    test("Has the same structure", () => {
      for (const note of family.notes()) {
        expect(clone.parents(note.id)).toStrictEqual(family.parents(note.id));
      }
    });

    test("Restructuring a clone keeps the source structure intact", () => {
      const originalNodes = family.notes();
      const newParent = { id: 'new-parent', text: 'new parent' }
      const newChild = { id: 'new-child', text: 'new child' }
      for (const note of clone.notes()) {
        clone.delete(note.id);
      }
      clone.upsert(newParent);
      clone.upsert(newChild);
      clone.attach(newChild.id, newParent.id);
      expect(originalNodes).toStrictEqual(family.notes());
    });

    test("Given 1000 nodes, performs fast cloning", () => {
      const measureDuration = (
          hierarchy: Notebook
      ): number => {
        for (let i = 0; i < 1000; i++) {
          hierarchy.upsert({ id: i.toString(), text: i.toString()});
        }
        const start = Date.now();
        new Notebook(hierarchy);
        return Date.now() - start;
      };

      const newDuration = measureDuration(new Notebook());

      expect(newDuration).toBeLessThan(10);
    });
  });

  describe(".notes()", () => {
    test("Returns notes", () => {
      expect(family.notes()).toStrictEqual(
          new Set([GRANDPARENT, PARENT, CHILD])
      );
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
          new TransitiveReductionError(`Cannot attach non-child descendant as a child`)
      );
    });

    test("Attaches node to the parent as a child", () => {
      const grandchild = { id: "grandchild", text: "grandchild" };
      family.upsert(grandchild);
      family.attach(CHILD.id, grandchild.id);
      expect(family.children(CHILD.id)).toStrictEqual([grandchild]);
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
      expect(family.children(anotherParent.id)).toStrictEqual([CHILD]);
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
      expect(family.children(PARENT.id)?.includes(CHILD)).toStrictEqual(false);
    });

    test("Detached child still belongs to another parent", () => {
      const parent2 = { id: "parent2", text: "parent2" };
      family.upsert(parent2);
      family.attach(parent2.id, CHILD.id);
      family.detach(PARENT.id, CHILD.id);
      expect(family.children("parent2")).toStrictEqual([CHILD]);
    });

    test("Child detached from the only parent still belongs to the hierarchy", () => {
      family.detach(PARENT.id, CHILD.id);
      expect(family.get(CHILD.id)).toBeDefined();
    });
  });

  describe('.findById()', () => {
    test('When not found, returns undefined', () => {
      expect(notebook.get('missing')).toBeUndefined()
    })

    test('When found, returns note', () => {
      const note = { id: '1', text: 'text' }
      notebook.upsert(note)
      expect(notebook.get('1')).toStrictEqual(note)
    })
  })

  describe(".children()", () => {
    test("When parent is undefined, returns hierarchs", () => {
      expect(family.children()).toStrictEqual([GRANDPARENT]);
    });

    test("When parent is defined, returns its children", () => {
      expect(family.children(PARENT.id)).toStrictEqual([CHILD]);
    });

    test("When parent does not exist, returns undefined", () => {
      expect(family.children("missing")).toBeUndefined();
    });

    test("Mutating returned set does not affect hierarchy", () => {
      const children = family.children(PARENT.id);
      children?.splice(0, children.length)
      expect(family.children(PARENT.id)).toStrictEqual([CHILD]);
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

  describe(".delete()", function () {
    test("Detaches all children from the parent", () => {
      family.delete(PARENT.id);
      expect(family.parents(CHILD.id)).toEqual(new Set([]));
    });

    test("Detaches child from all parents", () => {
      family.delete(PARENT.id);
      expect(family.children(GRANDPARENT.id)?.includes(PARENT)).toStrictEqual(false);
    });

    test("Hierarchy no longer has removed node", () => {
      family.delete(PARENT.id);
      expect(family.notes().has(PARENT)).toStrictEqual(false);
    });

    test("Removing the only node of the hierarchy empties the hierarchy", () => {
      const hierarchy = new Notebook()
      const orphan = { id: 'orphan', text: 'orphan' }
      hierarchy.upsert(orphan);
      hierarchy.delete(orphan.id);
      expect(hierarchy.notes()).toStrictEqual(new Set());
    });
  });
})
