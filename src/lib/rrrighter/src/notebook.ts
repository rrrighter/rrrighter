import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";
import {LoopError, CycleError} from "ordered-overlapping-hierarchy";

import Note from "./note";

interface Relationship {
  parent: Note
  child: Note
  index: number
}

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook {
  #hierarchy: OrderedOverlappingHierarchy<Note> = new OrderedOverlappingHierarchy<Note>({ id: '', text: ''})

  constructor(source?: Notebook) { // TODO: consider returning deep copy as a second option; https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    if (source) {
      this.#hierarchy = new OrderedOverlappingHierarchy<Note>(source.#hierarchy)
    }
  }

  notes = (): Set<Note> => this.#hierarchy.members()

  get = (id: string): Note | undefined => Array.from(this.notes()).find((note) => note.id === id)

  upsert = ({id, text}: Note): void => {
    // TODO: refactor into setText / setParents / set(id, text, parents)? or make flexible interface?
    const existing = this.get(id)
    if (existing) {
      existing.text = text
    } else {
      this.#hierarchy.relate({ parent: this.#hierarchy.hierarch, child: { id, text } })
    }
  }

  // todo: swap parent and child arguments order, make parent optional
  attach = (parentId: string, childId: string, index?: number): Relationship | LoopError | CycleError | undefined => {
    // TODO: consider NoteNotFoundError | void
    const parent = this.get(parentId)
    const child = this.get(childId)
    return parent && child && this.#hierarchy.relate({ parent, child, index })
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
