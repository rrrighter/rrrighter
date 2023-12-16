import Notebook from "./../notebook";

interface Note {
  readonly id: string;
  text: string;
}

interface NoteRecord extends Note {
  children?: string[]
}

export type NotebookJson = {
  notes: NoteRecord[];
};

export const fromJsonObjectLiteral = (jsonObject: NotebookJson): Notebook => {
  if (jsonObject.notes[0]) {
    const relationships = [];
    const identityMap = new Map<string, Note>(
      jsonObject.notes.map((noteRecord) => [
        noteRecord.id,
        { id: noteRecord.id, text: noteRecord.text },
      ]),
    );

    let notebook = new Notebook(
      identityMap.get(jsonObject.notes[0].id) as Note,
    );
    for (const noteRecord of jsonObject.notes) {
      const parent = identityMap.get(noteRecord.id) as Note;
      for (const childId of noteRecord.children || []) {
        const child = identityMap.get(childId) as Note;
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
  const pushNote = (id: string) => {
    const text = notebook.get(id) as string;
    const children = notebook.children(id);
    noteRecords.push(children?.length ? { id, text, children } : { id, text });
  };

  let noteRecords: NoteRecord[] = [];
  pushNote(notebook.home());
  notebook.descendants(notebook.home())?.forEach(pushNote);

  return { notes: noteRecords };
};
