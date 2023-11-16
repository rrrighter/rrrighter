import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy"; // todo import OrderedOverlappingHierarchy
import {LoopError, CycleError, TransitiveReductionError} from "ordered-overlapping-hierarchy";

import Note from "./note";

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook {
  #hierarchy: OrderedOverlappingHierarchy<Note> = new OrderedOverlappingHierarchy<Note>()

  constructor(source?: Notebook) { // TODO: consider returning deep copy as a second option; https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    if (source) {
      this.#hierarchy = new OrderedOverlappingHierarchy<Note>(source.#hierarchy)
    }
  }

  notes = (): Set<Note> => this.#hierarchy.descendants()

  get = (id: string): Note | undefined => Array.from(this.notes()).find((note) => note.id === id)

  upsert = ({id, text}: Note): void => {
    // TODO: refactor into setText / setParents / set(id, text, parents)? or make flexible interface?
    const existing = this.get(id)
    if (existing) {
      existing.text = text
    } else {
      this.#hierarchy.attach({ id, text })
    }
  }

  // todo: swap parent and child arguments order, make parent optional
  attach = (parentId: string, childId: string, index?: number): LoopError | CycleError | TransitiveReductionError | void => {
    // TODO: consider NoteNotFoundError |OverlappingHierarchyError | void
    const parent = this.get(parentId)
    const child = this.get(childId)
    return parent && child && this.#hierarchy.attach(child, parent, index)
  }

  detach = (parentId: string, childId: string): void => {
    const parent = this.get(parentId)
    const child = this.get(childId)
    parent && child && this.#hierarchy.detach(child, parent)
  }

  children(noteId?: string): Note[] | undefined {
    if (!noteId) {
      return this.#hierarchy.children()
    }
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
    const note = this.get(noteId)
    note && this.#hierarchy.delete(note)
  }
}
