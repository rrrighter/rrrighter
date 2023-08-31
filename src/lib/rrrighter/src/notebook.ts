import OverlappingHierarchy from "overlapping-hierarchy";
import {LoopError, CycleError, TransitiveReductionError} from "overlapping-hierarchy";

import Note from "./note";

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook {
  #hierarchy: OverlappingHierarchy<Note> = new OverlappingHierarchy<Note>()

  constructor(source?: Notebook) { // TODO: consider returning deep copy as a second option; https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    if (source) {
      source.notes().forEach((note) => this.upsert(note))
      source.notes().forEach((note) => {
        source.children(note.id)?.forEach((child) => this.attach(note.id, child.id))
      })
    }
  }

  notes = (): Set<Note> => this.#hierarchy.nodes()

  get = (id: string): Note | undefined => Array.from(this.#hierarchy.nodes()).find((note) => note.id === id)

  upsert = ({id, text}: Note): void => {
    // TODO: refactor into setText / setParents / set(id, text, parents)? or make flexible interface?
    const existing = this.get(id)
    if (existing) {
      existing.text = text
    } else {
      this.#hierarchy.add({ id, text })
    }
  }

  hierarchs = (): Set<Note> => {
    return this.#hierarchy.hierarchs()
  }

  attach = (parentId: string, childId: string): LoopError | CycleError | TransitiveReductionError | void => {
    // TODO: consider NoteNotFoundError |OverlappingHierarchyError | void
    const parent = this.get(parentId)
    const child = this.get(childId)
    return parent && child && this.#hierarchy.attach(parent, child)
  }

  detach = (parentId: string, childId: string): void => {
    const parent = this.get(parentId)
    const child = this.get(childId)
    parent && child && this.#hierarchy.detach(parent, child)
  }

  children(noteId: string): Set<Note> | undefined {
    const note = this.get(noteId)
    return note ? this.#hierarchy.children(note) : undefined
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
