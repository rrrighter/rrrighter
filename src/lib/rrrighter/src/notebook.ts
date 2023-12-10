import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

import Note from "./note";

export default class Notebook {
    #hierarchy: OrderedOverlappingHierarchy<Note>

    readonly home: Note

    constructor(source: Note = { text: '' }) { // todo: clone notebook
        this.home = source
        this.#hierarchy = new OrderedOverlappingHierarchy<Note>(this.home)
    }

    notes = () => this.#hierarchy.members()

    relationships = () => this.#hierarchy.relationships()

    relate = (relationships: { parent: Note; child: Note; index?: number; }[]) => this.#hierarchy.relate(relationships)

    // todo: unrelate

    children = (parent: Note) => this.#hierarchy.children(parent)

    // todo: parents
    // todo: descendants

    // todo: ancestors
}
