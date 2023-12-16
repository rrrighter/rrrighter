import Notebook from "./notebook";

describe("Notebook", () => {
  let notebook: Notebook;

  beforeEach(() => {
    notebook = new Notebook("");
  });

  describe("new Notebook()", () => {
    test("Has blank home by default", () => {
      const notebook = new Notebook();
      expect(notebook.homeId()).toStrictEqual("");
      expect(notebook.get(notebook.homeId())).toStrictEqual("");
    });

    test("Accepts home note id as hierarch", () => {
      const notebook = new Notebook("");
      expect(notebook.homeId()).toStrictEqual("");
    });

    test("Accepts notebook as source", () => {
      notebook.set("", "/");
      notebook.set("0", "0");
      const clone = new Notebook(notebook);
      expect(clone.relationships()).toStrictEqual(notebook.relationships());
      expect(clone.ids()).toStrictEqual(notebook.ids());
      clone.ids().forEach((id) => {
        expect(clone.get(id)).toStrictEqual(notebook.get(id));
      });
    });
  });

  describe(".get()", () => {
    test("Blank notebook has blank home note", () => {
      expect(notebook.get(notebook.homeId())).toBe("");
    });

    test("Non-member id returns undefined", () => {
      expect(notebook.get("404")).toBeUndefined();
    });
  });

  describe(".homeId", () => {
    test("Returns hierarch note id", () => {
      expect(notebook.homeId()).toStrictEqual(notebook.hierarch());
    });
  });

  describe(".ids()", () => {
    test("Returns note ids", () => {
      expect(notebook.ids()).toStrictEqual(notebook.members());
    });
  });

  describe(".set()", () => {
    test("Given non-member id, relates it to home", () => {
      notebook.set("0", "0");
      expect(notebook.parents("0")).toStrictEqual(new Set([""]));
    });

    test("Stores different notes with identical texts", () => {
      notebook.set("A", "🍏");
      notebook.set("B", "🍏");
      expect([notebook.get("A"), notebook.get("B")]).toStrictEqual([
        "🍏",
        "🍏",
      ]);
    });
  });

  describe(".relate()", () => {
    test("When relating sub-notebooks with shared note, removes redundant relationship", () => {
      const hierarchy = new Notebook("0");
      // 0 --> A & C
      // A --> B & X
      // C --> X
      // B --> C ==> redundant relationship
      hierarchy.relate([
        { parent: "0", child: "A" },
        { parent: "0", child: "C" },
        { parent: "A", child: "B" },
        { parent: "A", child: "X" },
        { parent: "C", child: "X" },
        { parent: "B", child: "C" },
      ]);
      expect(hierarchy.children("A")).toStrictEqual(["B"]);
    });

    test("Batch relating 1000 members takes less than two seconds", () => {
      const relationships: { parent: string; child: string }[] = [];
      for (let i = 0; i < 1000; i++) {
        relationships.push({ parent: notebook.homeId(), child: i.toString() });
      }
      const batchStart = Date.now();
      notebook.relate(relationships);
      const batchDuration = Date.now() - batchStart;
      expect(batchDuration).toBeLessThan(2000);
    });
  });
});
