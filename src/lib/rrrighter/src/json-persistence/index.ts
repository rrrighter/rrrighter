import Notebook from "./../notebook"

interface Note {
  text: string
}

type NoteRecord = { id: string, text: string, children?: string[] }

export type NotebookJson = {
    notes: NoteRecord[]
}

export const fromJsonObject = (jsonObject: NotebookJson): Notebook => {
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

    for(const parent of jsonObject.notes) {
        for(const childId of parent.children || []) {
            const child = identityMap.get(childId) as Note
            notebook.relate([{ parent, child }])
        }
    }

    return notebook
}

// export const toJsonObject = (notebook: Notebook): NotebookJson => {
//     let notes: NoteRecord[] = []
//
//     notebook.notes().forEach(note => {
//         const noteJson: NoteRecord = { id: note.id, text: note.text }
//         const children = notebook.children(note.id)
//         if (children && children.length > 0) {
//             noteJson.children = children.map(child => child.id)
//         }
//         notes.push(noteJson)
//     })
//
//     return { notes }
// }
