import Notebook from "./../notebook";

interface Note {
  text: string;
}

type NoteRecord = { id: string; text: string; children?: string[] };

export type NotebookJson = {
  notes: NoteRecord[];
};

export const fromJsonObjectLiteral = (jsonObject: NotebookJson): Notebook => {
  if (jsonObject.notes[0]) {
    const relationships = [];
    const identityMap = new Map<string, Note>(
      jsonObject.notes.map((noteRecord) => [
        noteRecord.id,
        { text: noteRecord.text },
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
    return new Notebook({ text: "" });
  }
};

export const toJsonObjectLiteral = (notebook: Notebook): NotebookJson => {
  const home = notebook.home;
  const noteIds = new Map<Note, string>([[home, ""]]);

  let index = 0;
  notebook.descendants(home)?.forEach((note) => {
    noteIds.set(note, `${index++}`);
  });

  const pushNote = (note: Note) => {
    const id = noteIds.get(note) as string;
    const text = note.text;
    const children = notebook
      .children(note)
      ?.map((child) => noteIds.get(child) as string);
    noteRecords.push(children?.length ? { id, text, children } : { id, text });
  };

  let noteRecords: NoteRecord[] = [];
  pushNote(home);
  notebook.descendants(home)?.forEach(pushNote);

  return { notes: noteRecords };
};
