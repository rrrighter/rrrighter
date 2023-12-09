import Notebook from './notebook'

const HIERARCH = { id: '', text: '' }
const GRANDPARENT = { id: "grandparent", text: "grandparent" };
const PARENT = { id: "parent", text: "parent" };
const CHILD = { id: "child", text: "child" };

describe('Notebook', () => {
  let notebook: Notebook
  let family: Notebook

  beforeEach(() => {
    notebook = new Notebook()
    family = new Notebook()
    family.upsert([GRANDPARENT]);
    family.upsert([PARENT]);
    family.upsert([CHILD]);
    family.attach([{ parentId: GRANDPARENT.id, childId: PARENT.id }]);
    family.attach([{ parentId: PARENT.id, childId: CHILD.id }]);
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
      clone.upsert([newParent]);
      clone.upsert([newChild]);
      clone.attach([{ parentId: newChild.id, childId: newParent.id }]);
      expect(originalNodes).toStrictEqual(family.notes());
    });

    // todo: optimize for fast insertion of 1000 nodes

    test("Given 1000 nodes, performs fast cloning", () => {
      const measureDuration = (
          hierarchy: Notebook
      ): number => {
        const notes = [];
        for (let i = 0; i < 1000; i++) {
          const note = { id: i.toString(), text: i.toString() }
          notes.push(note)
        }
        hierarchy.upsert(notes);
        expect(hierarchy.notes().size).toBe(1001);
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
          new Set([HIERARCH, GRANDPARENT, PARENT, CHILD])
      );
    });
  });

  describe('.upsert()', () => {
    const note = { id: '1', text: 'upsert' }

    test('Adds a note to the empty notebook', () => {
      notebook.upsert([note])
      expect(notebook.notes()).toEqual(new Set([HIERARCH, note]))
    })

    test('Adding the same note twice does not duplicate it', () => {
      notebook.upsert([note])
      notebook.upsert([note])
      expect(notebook.notes()).toEqual(new Set([HIERARCH, note]))
    })

    test('Adding new note object with duplicate id updates note with that id', () => {
      const updated = { id: note.id, text: 'update' }
      notebook.upsert([note])
      notebook.upsert([updated])
      expect(notebook.notes()).toEqual(new Set([HIERARCH, { id: '1', text: 'update' }]))
    })

    test("Given 1000 nodes, performs bulk upsert in less than three seconds", () => {
      const measureDuration = (
          hierarchy: Notebook
      ): number => {
        const notes = [];
        for (let i = 0; i < 1000; i++) {
          const note = { id: i.toString(), text: i.toString() }
          notes.push(note)
        }
        const start = Date.now();
        hierarchy.upsert(notes);
        const duration = Date.now() - start;
        expect(hierarchy.notes().size).toBe(1001);
        return duration
      };

      const newDuration = measureDuration(new Notebook());

      expect(newDuration).toBeLessThan(3000);
    });
  })

  describe(".attach()", () => {
    test("Attaches two children to parent", () => {
      const child1 = { id: "child1", text: "child1" };
      const child2 = { id: "child2", text: "child2" };

      family.upsert([child1, child2]);
      family.attach([
        { parentId: PARENT.id, childId: child1.id },
        { parentId: PARENT.id, childId: child2.id }
      ]);

      expect(family.children(PARENT.id)).toStrictEqual([CHILD, child1, child2])
    });

    test("Given 1000 nodes, performs attach in less than three seconds", () => {
      const measureDuration = (
          hierarchy: Notebook
      ): number => {
        const notes = [];
        for (let i = 0; i < 1000; i++) {
          const note = { id: i.toString(), text: i.toString() }
          notes.push(note)
        }
        hierarchy.upsert(notes);
        const start = Date.now();
        hierarchy.attach(notes.map((note) => { return { parentId: hierarchy.hierarch().id, childId: note.id } }));
        const duration = Date.now() - start;
        expect(hierarchy.notes().size).toBe(1001);
        return duration
      };

      const newDuration = measureDuration(new Notebook());

      expect(newDuration).toBeLessThan(3000);
    });
  })

  describe(".attach()", () => {
    // test("Attaching node to itself returns LoopError", () => {
    //   expect(family.attach(CHILD.id, CHILD.id)).toStrictEqual(
    //       new LoopError("Cannot relate member to itself")
    //   );
    // });
    //
    // test("Attaching ancestor as a child returns CycleError", () => {
    //   expect(family.attach(CHILD.id, GRANDPARENT.id)).toStrictEqual(
    //       new CycleError("Cannot relate ancestor as a child")
    //   );
    // });

    test("Attaches node to the parent as a child", () => {
      const grandchild = { id: "grandchild", text: "grandchild" };
      family.upsert([grandchild]);
      family.attach([{ parentId: CHILD.id, childId: grandchild.id }]);
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
      family.upsert([anotherParent]);
      family.attach([{ parentId: GRANDPARENT.id, childId: anotherParent.id }]);
      family.attach([{ parentId: anotherParent.id, childId: CHILD.id }]);
      expect(family.children(anotherParent.id)).toStrictEqual([CHILD]);
    });

    test("Attached child has a parent", () => {
      const GREAT_GRANDPARENT = { id: 'gg', text: "great-grandparent" }
      family.upsert([GREAT_GRANDPARENT]);
      family.attach([{ parentId: GREAT_GRANDPARENT.id, childId: GRANDPARENT.id }]);
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
      family.upsert([parent2]);
      family.attach([{ parentId: parent2.id, childId: CHILD.id }]);
      family.detach(PARENT.id, CHILD.id);
      expect(family.children("parent2")).toStrictEqual([CHILD]);
    });

    test("Child detached from the only parent is no longer a member", () => {
      family.detach(PARENT.id, CHILD.id);
      expect(family.get(CHILD.id)).toBeUndefined();
    });
  });

  describe('.findById()', () => {
    test('When not found, returns undefined', () => {
      expect(notebook.get('missing')).toBeUndefined()
    })

    test('When found, returns note', () => {
      const note = { id: '1', text: 'text' }
      notebook.upsert([note])
      expect(notebook.get('1')).toStrictEqual(note)
    })
  })

  describe(".children()", () => {
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
    test("Given hierarch, returns nothing", () => {
      expect(family.parents(family.hierarch().id)).toStrictEqual(new Set());
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
          new Set([HIERARCH, GRANDPARENT, PARENT])
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
  });
})
