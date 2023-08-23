import OverlappingHierarchy from "overlapping-hierarchy";
import {LoopError, CycleError, ConflictingParentsError} from "overlapping-hierarchy";

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

  // TODO: rename to get to resemble Map API
  findById = (id: string): Note | undefined => Array.from(this.#hierarchy.nodes()).find((note) => note.id === id)

  // TODO: refactor into setText / setParents / set
  upsert = (note: Note): void => {
    const existing = this.findById(note.id)
    if (existing) {
      existing.text = note.text
    } else {
      this.#hierarchy.add(note)
    }
  }

  hierarchs = (): Set<Note> => {
    return this.#hierarchy.hierarchs()
  }

  attach = (parentId: string, childId: string): LoopError | CycleError | ConflictingParentsError | void => { // TODO: consider NoteNotFoundError |OverlappingHierarchyError | void
    const parent = this.findById(parentId)
    const child = this.findById(childId)
    return parent && child && this.#hierarchy.attach(parent, child)
  }

  detach = (parentId: string, childId: string): void => {
    const parent = this.findById(parentId)
    const child = this.findById(childId)
    parent && child && this.#hierarchy.detach(parent, child)
  }

  children(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.#hierarchy.children(note) : undefined
  }

  parents(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.#hierarchy.parents(note) : undefined
  }

  descendants(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.#hierarchy.descendants(note) : undefined
  }

  ancestors(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.#hierarchy.ancestors(note) : undefined
  }

  delete = (noteId: string): void => {
    const note = this.findById(noteId)
    note && this.#hierarchy.delete(note)
  }
}
