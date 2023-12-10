import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

import Note from "./note";

interface ParentChild {
    parent: Note;
    child: Note;
}

export default class Notebook {
    #hierarchy: OrderedOverlappingHierarchy<Note>

    readonly home: Note

    constructor(source: Note = { text: '' }) { // todo: clone notebook
        this.home = source
        this.#hierarchy = new OrderedOverlappingHierarchy<Note>(this.home)
    }

    notes = () => this.#hierarchy.members()

    relationships = () => this.#hierarchy.relationships()

    // todo: relate with index
    relate = (relationships: ParentChild[]) => this.#hierarchy.relate(relationships)

    // todo: unrelate
    // todo: children
    // todo: parents
    // todo: ancestors
    // todo: descendants
}
