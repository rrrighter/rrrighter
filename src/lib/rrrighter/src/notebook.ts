import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

export interface Note {
    text: string
}

export default class Notebook extends OrderedOverlappingHierarchy<Note>{
    get home(): Note {
        return this.hierarch
    }

    notes = (): Set<Note> => this.members()
}
