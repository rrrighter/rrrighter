import Notebook from "./../notebook"
import Note from "./../note"

export type NotebookJson = {
    notes: {
        [key: string]: { text: string, parents?: string[] }
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

    return notebook
}

export const toJsonObject = (notebook: Notebook): NotebookJson => {
    let jsonObject: NotebookJson = { notes: {} }
    notebook.nodes().forEach(note => {
        const parents = notebook.parents(note.id)
        jsonObject.notes[note.id] = { text: note.text }
        if (parents && parents.size > 0) {
            jsonObject.notes[note.id].parents = Array.from(parents).map(parent => parent.id)
        }
    })

    return jsonObject
}
