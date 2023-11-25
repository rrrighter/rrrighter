import Notebook from "./../notebook"

type NoteJson = { id: string, text: string, children?: string[] }

export type NotebookJson = {
    notes: NoteJson[]
}

export const fromJsonObject = (jsonObject: NotebookJson): Notebook => {
    let notebook = new Notebook()

    for(const note of jsonObject.notes) {
        notebook.upsert({ id: note.id, text: note.text })
    }

    for(const note of jsonObject.notes) {
        const parentId = note.id
        for(const childId of note.children || []) {
            const error = notebook.attach(parentId, childId)
            if (error) {
                console.log(error, childId, parentId)
            }
        }
    }

    return notebook
}

export const toJsonObject = (notebook: Notebook): NotebookJson => {
    let notes: NoteJson[] = []

    notebook.notes().forEach(note => {
        const noteJson: NoteJson = { id: note.id, text: note.text }
        const children = notebook.children(note.id)
        if (children && children.length > 0) {
            noteJson.children = children.map(child => child.id)
        }
        notes.push(noteJson)
    })

    return { notes }
}
