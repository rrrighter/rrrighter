import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

import Note from "./note";

interface ParentChild {
    parent: Note;
    child: Note;
}

export default class Notebook {
    #hierarchy: OrderedOverlappingHierarchy<Note>

    readonly home: Note

    constructor(source: Note = { text: '' }) { // todo: clone other notebook
        this.home = source
        this.#hierarchy = new OrderedOverlappingHierarchy<Note>(this.home)
    }

    members() {
        return this.#hierarchy.members()
    }

    relationships() {
        return this.#hierarchy.relationships()
    }

    relate(relationships: ParentChild[]) {
        return this.#hierarchy.relate(relationships)
    }

    // todo: unrelate
    // todo: children
    // todo: parents
    // todo: ancestors
    // todo: descendants
}
