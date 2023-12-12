import Notebook from "./../notebook"

interface Note {
  text: string
}

type NoteRecord = { id: string, text: string, children?: string[] }

export type NotebookJson = {
    notes: NoteRecord[]
}

export const fromJsonObjectLiteral = (jsonObject: NotebookJson): Notebook => {
    const homeRecord = jsonObject.notes[0] || { id: '', text: '', children: []}
    const home = { text: homeRecord.text }

    let notebook = new Notebook(home)
    let identityMap = new Map<string, Note>()
    identityMap.set(homeRecord?.id || '', home)

    for(const noteRecord of jsonObject.notes) {
        if (noteRecord !== homeRecord) {
            const note = { text: noteRecord.text }
            identityMap.set(noteRecord.id, note)
            notebook.relate([{ parent: notebook.home, child: note }])
        }
    }

    for(const noteRecord of jsonObject.notes) {
        const parent = identityMap.get(noteRecord.id) as Note
        for(const childId of noteRecord.children || []) {
            const child = identityMap.get(childId) as Note
            notebook.relate([{ parent, child }])
        }
    }

    return notebook
}

export const toJsonObjectLiteral = (notebook: Notebook): NotebookJson => {
    const home = notebook.home
    const noteIds = new Map<Note, string>([[home, '']])

    let index = 0
    notebook.descendants(home)?.forEach((note) => {
        noteIds.set(note, `${index++}`)
    })

    const pushNote = (note: Note) => {
        const id = noteIds.get(note) as string
        const text = note.text
        const children = notebook.children(note)?.map((child) => noteIds.get(child) as string)
        noteRecords.push(children ? { id, text, children } : { id, text })
    }

    let noteRecords: NoteRecord[] = []
    // todo: map over [home, ...descendants] with recordNote, then inline function
    pushNote(home)
    notebook.descendants(home)?.forEach(pushNote)

    return { notes: noteRecords }
}
