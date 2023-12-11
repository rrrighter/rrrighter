import Notebook from "./../notebook"

interface Note {
  text: string
}

type NoteRecord = { id: string, text: string, children?: string[] }

export type NotebookJson = {
    notes: NoteRecord[]
}

export const fromJsonObjectLiteral = (jsonObject: NotebookJson): Notebook => {
    const homeRecord = jsonObject.notes.shift()
    const home = { text: homeRecord?.text || '' }

    let notebook = new Notebook(home)
    let identityMap = new Map<string, Note>()
    identityMap.set(homeRecord?.id || '', home)

    for(const noteRecord of jsonObject.notes) {
        const note = { text: noteRecord.text }
        identityMap.set(noteRecord.id, note)
        notebook.relate([{ parent: notebook.home, child: note }])
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

// export const toJsonObjectLiteral = (notebook: Notebook, noteId?: Function): NotebookJson => { // todo: test custom noteId
//     let sequentialId = 0
//     // todo: noteId default with autoincrement from 0 for home, 1 for first note, etc.
//     const notes = notebook.notes()
//     let noteRecords: NoteRecord[] = []
//
//     // todo: shift hierarch and add it first with empty string as id, then add the rest
//
//     notes.forEach(note => {
//         const id = noteId ? noteId(note) : sequentialId++
//         const text = note.text
//         const noteJson: NoteRecord = { id, text }
//         const children = notebook.children(note)
//         if (children && children.length > 0) {
//             noteJson.children = children.map(child => child.id)
//         }
//         noteRecords.push(noteJson)
//     })
//
//     return { notes: noteRecords }
// }
