import Notebook from "./../notebook";

type NoteId = string;

interface NoteRecord {
  id: NoteId;
  text: string;
  children?: NoteId[]
}

export type NotebookJson = {
  notes: NoteRecord[];
};

export const fromJsonObjectLiteral = (jsonObjectLiteral: NotebookJson): Notebook => {
  let notebook = new Notebook(jsonObjectLiteral.notes[0]?.id || "");

  if (jsonObjectLiteral.notes[0]) {
    const relationships = [];
    for (const noteRecord of jsonObjectLiteral.notes) {
      relationships.push({ parent: notebook.homeId(), child: noteRecord.id });
      noteRecord.children?.forEach((child) => {
        relationships.push({ parent: noteRecord.id, child });
      });
    }
    notebook.relate(relationships);

    for (const { id, text} of jsonObjectLiteral.notes) {
      notebook.set(id, text);
    }
  }

  return notebook;
};

export const toJsonObjectLiteral = (notebook: Notebook): NotebookJson => {
  let notes: NoteRecord[] = [];

  const pushNoteRecord = (id: string) => {
    const text = notebook.get(id) as string;
    const children = notebook.children(id);
    notes.push(children?.length ? { id, text, children } : { id, text });
  };

  pushNoteRecord(notebook.homeId());
  notebook.descendants(notebook.homeId())?.forEach(pushNoteRecord);

  return { notes };
};
