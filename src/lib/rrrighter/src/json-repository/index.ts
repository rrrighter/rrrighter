import { randomUUID } from 'node:crypto';

import Notebook from "./../notebook";

type NoteId = string;

interface NoteRecord {
  id: NoteId;
  text: string;
  children?: NoteId[];
}

export type NotebookStructure = {
  notes: NoteRecord[];
};

export const fromJsonObjectLiteral = (
  jsonObjectLiteral: NotebookStructure,
): Notebook => {
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

    for (const { id, text } of jsonObjectLiteral.notes) {
      notebook.set(id, text);
    }
  }

  return notebook;
};

export const toJsonObjectLiteral = (notebook: Notebook): NotebookStructure => {
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

export const convertToUUIDs = (notebook: Notebook): Notebook => {
  const old2new = new Map<string, string>();
  notebook.ids().forEach((id) => {
    old2new.set(id, randomUUID());
  });

  const structure = toJsonObjectLiteral(notebook);
  structure.notes.forEach((note) => {
    note.id = old2new.get(note.id) as string;
    note.children = note.children?.map((child) => old2new.get(child) as string);
  })

  return new Notebook(fromJsonObjectLiteral(structure));
}
