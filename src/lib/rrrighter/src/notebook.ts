import OverlappingHierarchy from "overlapping-hierarchy";
import {LoopError, CycleError, ConflictingParentsError} from "overlapping-hierarchy";

import Note from "./note";

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook {
  hierarchy: OverlappingHierarchy<Note> = new OverlappingHierarchy<Note>() // TODO: make private after covering constructor with tests

  constructor(source?: Notebook) { // TODO: cover with tests; test for source mutation
    this.hierarchy = new OverlappingHierarchy<Note>(source?.hierarchy)
  }

  notes = (): Set<Note> => this.hierarchy.nodes()

  findById = (id: string): Note | undefined => Array.from(this.hierarchy.nodes()).find((note) => note.id === id)

  upsert = (note: Note): void => {
    const existing = this.findById(note.id)
    if (existing) {
      existing.text = note.text
    } else {
      this.hierarchy.add(note)
    }
  }

  hierarchs = (): Set<Note> => { // todo: backport into OH with performance benchmarks, as it's O(n*2) and OH is O(n^2)
    const notes = this.hierarchy.nodes()
    this.hierarchy.nodes().forEach((n) => this.hierarchy.children(n)?.forEach((c) => notes.delete(c)))
    return notes
  }

  attach = (parentId: string, childId: string): LoopError | CycleError | ConflictingParentsError | void => {
    const parent = this.findById(parentId)
    const child = this.findById(childId)
    return parent && child && this.hierarchy.attach(parent, child)
  }

  detach = (parentId: string, childId: string): void => {
    const parent = this.findById(parentId)
    const child = this.findById(childId)
    parent && child && this.hierarchy.detach(parent, child)
  }

  children(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.hierarchy.children(note) : undefined
  }

  parents(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.hierarchy.parents(note) : undefined
  }

  descendants(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.hierarchy.descendants(note) : undefined
  }

  ancestors(noteId: string): Set<Note> | undefined {
    const note = this.findById(noteId)
    return note ? this.hierarchy.ancestors(note) : undefined
  }

  remove = (noteId: string): void => {
    const note = this.findById(noteId)
    note && this.hierarchy.remove(note)
  }
}
