import Notebook from "./../notebook"
import Note from "./../note"

export type NotebookJson = {
    notes: {
        // TODO: deprecate parents once converted all old notebooks
        [key: string]: { text: string, parents?: string[], children?: string[] }
    }
}

export const fromJsonObject = (jsonObject: NotebookJson): Notebook => {
    let notebook = new Notebook()

    let notes: { [key: string]: Note } = {}
    for(const id in jsonObject.notes) {
        notes[id] = { id, text: jsonObject.notes[id].text }
        notebook.upsert(notes[id])
    }

    for(const childId in jsonObject.notes) {
        for(const parentId of jsonObject.notes[childId].parents || []) {
            notebook.attach(parentId, childId)
        }
    }

    for(const parentId in jsonObject.notes) {
        for(const childId of jsonObject.notes[parentId].children || []) {
            notebook.attach(parentId, childId)
        }
    }

    return notebook
}

export const toJsonObject = (notebook: Notebook): NotebookJson => {
    let jsonObject: NotebookJson = { notes: {} }
    notebook.notes().forEach(note => {
        const children = notebook.children(note.id)
        jsonObject.notes[note.id] = { text: note.text }
        if (children && children.length > 0) {
            jsonObject.notes[note.id].children = Array.from(children).map(child => child.id)
        }
    })

    return jsonObject
}
