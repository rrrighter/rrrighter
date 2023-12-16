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

export const fromJsonObjectLiteral = (jsonObject: NotebookJson): Notebook => {
  if (jsonObject.notes[0]) {
    const relationships = [];

    let notebook = new Notebook(jsonObject.notes[0].id);
    notebook.set(jsonObject.notes[0].id, jsonObject.notes[0].text);
    for (const noteRecord of jsonObject.notes) {
      // fixme: why inifinite loop? notebook.set(noteRecord.id, noteRecord.text);
      const parent = noteRecord.id;
      for (const child of noteRecord.children || []) {
        relationships.push({ parent, child });
      }
    }
    notebook.relate(relationships);

    return notebook;
  } else {
    return new Notebook("");
  }
};

export const toJsonObjectLiteral = (notebook: Notebook): NotebookJson => {
  let notes: NoteRecord[] = [];

  const pushNote = (id: string) => {
    const text = notebook.get(id) as string;
    const children = notebook.children(id);
    notes.push(children?.length ? { id, text, children } : { id, text });
  };

  pushNote(notebook.homeId());
  notebook.descendants(notebook.homeId())?.forEach(pushNote);

  return { notes };
};
