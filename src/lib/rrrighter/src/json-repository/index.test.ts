import { fromJsonObjectLiteral, toJsonObjectLiteral } from "./index";
import Notebook from "./../notebook";

describe("JSON repository", () => {
  const home = { id: "", text: "🏡 Home" };
  const mother = { id: "0", text: "mother" };
  const father = { id: "1", text: "father" };
  const child = { id: "2", text: "child" };
  const grandchild = { id: "3", text: "grandchild" };

  let notebook: Notebook;

  beforeEach(() => {
    notebook = new Notebook(home.id);
    notebook.set(home.id, home.text);
  });

  const hierarchyJsonObjectLiteral = {
    // Having top-level "notes" key makes it extendable in future versions
    // which may add more keys like "author", "license", "drafts", "sops", etc.
    notes: [
      { id: "", text: home.text, children: ["0", "1"] },
      { id: "0", text: mother.text, children: ["2"] },
      { id: "1", text: father.text, children: ["2"] },
      { id: "2", text: child.text, children: ["3"] },
      { id: "3", text: grandchild.text },
    ],
  };

  describe(".fromJsonObjectLiteral()", () => {
    test("When notes array is empty, notebook home note is blank", () => {
      const notebook = fromJsonObjectLiteral({ notes: [] });
      expect(notebook.get(notebook.home())).toStrictEqual("");
    });

    test("Returns notebook", () => {
      notebook = fromJsonObjectLiteral(hierarchyJsonObjectLiteral);
      expect(notebook.relationships()).toStrictEqual(
        new Set([
          { parent: home, child: mother, childIndex: 0 },
          { parent: home, child: father, childIndex: 1 },
          { parent: mother, child: child, childIndex: 0 },
          { parent: father, child: child, childIndex: 0 },
          { parent: child, child: grandchild, childIndex: 0 },
        ]),
      );
    });

    test("Loads 1000 notes under a second", () => {
      const notes = [];
      for (let i = 0; i < 1000; i++) {
        notes.push({ id: i.toString(), text: "note" });
      }
      const start = Date.now();
      notebook = fromJsonObjectLiteral({ notes });
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe(".toJsonObjectLiteral()", () => {
    test("Converts blank notebook to JSON object", () => {
      const blankNotebookJsonObjectLiteral = {
        notes: [{ id: "", text: home.text }],
      };
      expect(toJsonObjectLiteral(notebook)).toStrictEqual(
        blankNotebookJsonObjectLiteral,
      );
    });

    test("Converts hierarchical notebook to JSON object", () => {
      notebook.set(mother.id, mother.text);
      notebook.set(father.id, father.text);
      notebook.set(child.id, child.text);
      notebook.set(grandchild.id, grandchild.text);
      notebook.relate([{ parent: notebook.home(), child: mother.id }]);
      notebook.relate([{ parent: notebook.home(), child: father.id }]);
      notebook.relate([{ parent: notebook.home(), child: child.id }]);
      notebook.relate([{ parent: notebook.home(), child: grandchild.id }]);
      notebook.relate([{ parent: mother.id, child: child.id }]);
      notebook.relate([{ parent: father.id, child: child.id }]);
      notebook.relate([{ parent: child.id, child: grandchild.id }]);
      expect(toJsonObjectLiteral(notebook)).toStrictEqual(
        hierarchyJsonObjectLiteral,
      );
    });
  });
});
