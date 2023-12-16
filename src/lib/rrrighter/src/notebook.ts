import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

type NoteId = string;

export default class Notebook extends OrderedOverlappingHierarchy<NoteId> {
  #notes: Map<NoteId, string> = new Map();

  home = () => this.hierarch;

  notes = () => this.members();

  get = (id: NoteId): string | undefined => {
    return this.notes().has(id) ? this.#notes.get(id) ?? "" : undefined;
  }

  set = (id: NoteId, text: string): void => {
    this.#notes.set(id, text);
    if (!this.notes().has(id)) {
      this.relate([{ child: id, parent: this.home() }]);
    }
  }
}
