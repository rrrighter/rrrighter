import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

type NoteId = string;

export default class Notebook extends OrderedOverlappingHierarchy<NoteId> {
  #notes: Map<NoteId, string> = new Map();

  homeId = (): NoteId => this.hierarch();

  ids = (): Set<NoteId> => this.members();

  get = (id: NoteId): string | undefined => {
    return this.ids().has(id) ? this.#notes.get(id) ?? "" : undefined;
  }

  set = (id: NoteId, text: string): void => {
    this.#notes.set(id, text);
    if (!this.ids().has(id)) {
      this.relate([{ child: id, parent: this.homeId() }]);
    }
  }
}
