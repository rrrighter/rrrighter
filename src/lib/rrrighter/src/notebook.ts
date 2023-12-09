import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

import Note from "./note";

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook {
  #hierarchy: OrderedOverlappingHierarchy<Note> = new OrderedOverlappingHierarchy<Note>({ id: '', text: ''})

  constructor(source?: Notebook) { // TODO: consider returning deep copy as a second option; https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    if (source) {
      this.#hierarchy = new OrderedOverlappingHierarchy<Note>(source.#hierarchy)
    }
  }

  hierarch = (): Note => this.#hierarchy.hierarch

  notes = (): Set<Note> => this.#hierarchy.members()

  get = (id: string): Note | undefined => Array.from(this.notes()).find((note) => note.id === id)

  upsert = (notes: Note[]): void => { // TODO: batch API for fast project load
    // TODO: refactor into setText / setParents / set(id, text, parents)? or make flexible interface?
    const relationships: Array<{parent: Note, child: Note}> = []

    for(const note of notes) {
      const existing = this.get(note.id)
      if (existing) {
        existing.text = note.text
      } else {
        relationships.push({ parent: this.#hierarchy.hierarch, child: note })
      }
    }

    this.#hierarchy.relate(relationships)
  }

  // TODO: attachMany
  attachMany = (relationshipIds: Array<{parentId: string, childId: string, index?: number}>): void => {
    const relationships: Array<{parent: Note, child: Note}> = []

    for(const relationship of relationshipIds) {
      const parent = this.get(relationship.parentId)
      const child = this.get(relationship.childId)
      parent && child && relationships.push({ parent, child })
    }

    this.#hierarchy.relate(relationships)
  }

  // TODO: batch API for fast project load
  // todo: swap parent and child arguments order, make parent optional
  attach = (parentId: string, childId: string, index?: number): void => {
    // TODO: consider NoteNotFoundError | void
    const parent = this.get(parentId)
    const child = this.get(childId)
    parent && child && this.#hierarchy.relate([{ parent, child, index }])
  }

  detach = (parentId: string, childId: string): void => {
    const parent = this.get(parentId)
    const child = this.get(childId)
    parent && child && this.#hierarchy.unrelate({ parent, child })
  }

  children(noteId: string): Note[] | undefined {
    const note = this.get(noteId)
    return note ? this.#hierarchy.children(note) || [] : undefined
  }

  parents(noteId: string): Set<Note> | undefined {
    const note = this.get(noteId)
    return note ? this.#hierarchy.parents(note) : undefined
  }

  descendants(noteId: string): Set<Note> | undefined {
    const note = this.get(noteId)
    return note ? this.#hierarchy.descendants(note) : undefined
  }

  ancestors(noteId: string): Set<Note> | undefined {
    const note = this.get(noteId)
    return note ? this.#hierarchy.ancestors(note) : undefined
  }

  delete = (noteId: string): void => {
    const child = this.get(noteId)
    if (child) {
      this.#hierarchy.parents(child)?.forEach((parent) => this.#hierarchy.unrelate({parent, child}))
    }
  }
}
