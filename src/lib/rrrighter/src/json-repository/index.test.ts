import { fromJsonObjectLiteral, toJsonObjectLiteral } from "./index";
import Notebook from "./../notebook";

describe("JSON repository", () => {
  const id = (prefix: string): string => `${prefix}/${Math.random()}`;
  const home = { id: id("home"), text: "🏡" };
  const mother = { id: id("mother"), text: "👩" };
  const father = { id: id("father"), text: "👨" };
  const child = { id: id("child"), text: "🧒" };
  const grandchild = { id: id("grandchild"), text: "👶" };

  let notebook: Notebook;

  beforeEach(() => {
    notebook = new Notebook(home.id);
    notebook.set(home.id, home.text);
  });

  const hierarchyJsonObjectLiteral = {
    // Having top-level "notes" key makes it extendable in future versions
    // which may add more keys like "author", "license", "drafts", "sops", etc.
    notes: [
      { id: home.id, text: home.text, children: [mother.id, father.id] },
      { id: mother.id, text: mother.text, children: [child.id] },
      { id: father.id, text: father.text, children: [child.id] },
      { id: child.id, text: child.text, children: [grandchild.id] },
      { id: grandchild.id, text: grandchild.text },
    ],
  };

  test("Back and forth JSON conversion produces identical output", () => {
    const originalNotebook = fromJsonObjectLiteral(hierarchyJsonObjectLiteral);
    const originalObjectLiteral = toJsonObjectLiteral(originalNotebook);
    const originalJson = JSON.stringify(originalObjectLiteral);
    const restoredNotebook = fromJsonObjectLiteral(JSON.parse(originalJson));
    const restoredObjectLiteral = toJsonObjectLiteral(restoredNotebook);
    const restoredJson = JSON.stringify(restoredObjectLiteral);
    expect(restoredJson).toStrictEqual(originalJson);
  });

  describe(".fromJsonObjectLiteral()", () => {
    test("When notes array is empty, notebook home note is blank", () => {
      const notebook = fromJsonObjectLiteral({ notes: [] });
      expect(notebook.get(notebook.homeId())).toStrictEqual("");
    });

    test("Returns notebook", () => {
      notebook = fromJsonObjectLiteral(hierarchyJsonObjectLiteral);
      expect(notebook.relationships()).toStrictEqual(
        new Set([
          { parent: home.id, child: mother.id, childIndex: 0 },
          { parent: home.id, child: father.id, childIndex: 1 },
          { parent: mother.id, child: child.id, childIndex: 0 },
          { parent: father.id, child: child.id, childIndex: 0 },
          { parent: child.id, child: grandchild.id, childIndex: 0 },
        ]),
      );
      for (const note of [home, mother, father, child, grandchild]) {
        expect(notebook.get(note.id)).toStrictEqual(note.text);
      }
    });

    test("Loads 1000 notes under two seconds", () => {
      const notes = [];
      for (let i = 0; i < 1000; i++) {
        notes.push({ id: i.toString(), text: "note" });
      }
      const start = Date.now();
      notebook = fromJsonObjectLiteral({ notes });
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe(".toJsonObjectLiteral()", () => {
    test("Converts blank notebook to JSON object literal", () => {
      expect(toJsonObjectLiteral(new Notebook())).toStrictEqual({
        notes: [{ id: "", text: "" }],
      });
    });

    test("Converts hierarchical notebook to JSON object literal", () => {
      notebook.set(mother.id, mother.text);
      notebook.set(father.id, father.text);
      notebook.set(child.id, child.text);
      notebook.set(grandchild.id, grandchild.text);
      notebook.relate([{ parent: notebook.homeId(), child: mother.id }]);
      notebook.relate([{ parent: notebook.homeId(), child: father.id }]);
      notebook.relate([{ parent: notebook.homeId(), child: child.id }]);
      notebook.relate([{ parent: notebook.homeId(), child: grandchild.id }]);
      notebook.relate([{ parent: mother.id, child: child.id }]);
      notebook.relate([{ parent: father.id, child: child.id }]);
      notebook.relate([{ parent: child.id, child: grandchild.id }]);
      expect(toJsonObjectLiteral(notebook)).toStrictEqual(
        hierarchyJsonObjectLiteral,
      );
    });
  });

  // TODO: consider ordering descendant notes by id for clean diffs
  // TODO: ensure consistent output for identical structures with different build orders
});
