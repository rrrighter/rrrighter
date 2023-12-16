import Notebook from "./notebook";

describe("Notebook", () => {
  let notebook: Notebook;

  beforeEach(() => {
    notebook = new Notebook("");
  });

  describe("new Notebook()", () => {
    test("Accepts home note id as hierarch", () => {
      const notebook = new Notebook("");
      expect(notebook.hierarch).toStrictEqual("");
    });

    test("Accepts notebook as source", () => {
      const clone = new Notebook(notebook);
      expect(clone.relationships()).toStrictEqual(notebook.relationships());
    });
  });

  describe(".get()", () => {
    test("Blank notebook has blank home note", () => {
      expect(notebook.get(notebook.home())).toBe("");
    });

    test("Non-member id returns undefined", () => {
      expect(notebook.get("404")).toBeUndefined();
    })
  })

  describe(".home", () => {
    test("Returns hierarch note id", () => {
      expect(notebook.home()).toStrictEqual(notebook.hierarch);
    });
  });

  describe(".notes()", () => {
    test("Returns note ids", () => {
      expect(notebook.notes()).toStrictEqual(notebook.members());
    });
  });

  describe(".set()", () => {
    test("Given non-member id, relates it to home", () => {
      notebook.set('0', '0');
      expect(notebook.parents('0')).toStrictEqual(new Set([""]));
    })

    test("Stores different notes with identical texts", () => {
      notebook.set('A', '🍏');
      notebook.set('B', '🍏');
      expect([notebook.get('A'), notebook.get('B')]).toStrictEqual(['🍏', '🍏']);
    });
  });

  describe(".relate()", () => {
    test("Batch relating 1000 members takes less than two seconds", () => {
      const relationships: { parent: string; child: string }[] = [];
      for (let i = 0; i < 1000; i++) {
        relationships.push({ parent: notebook.home(), child: i.toString() });
      }
      const batchStart = Date.now();
      notebook.relate(relationships);
      const batchDuration = Date.now() - batchStart;
      expect(batchDuration).toBeLessThan(2000);
    });
  })
});
