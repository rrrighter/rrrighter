import OrderedOverlappingHierarchy from "ordered-overlapping-hierarchy";

export type NoteId = string;
export type NoteText = string;

export default class Notebook extends OrderedOverlappingHierarchy<NoteId> {
  #notes: Map<NoteId, string> = new Map();

  constructor(source?: NoteId | Notebook) {
    source = source ?? "";
    super(source);
    if (source instanceof Notebook) {
      this.#notes = new Map(source.#notes);
    }
  }

  homeId = (): NoteId => this.hierarch();

  ids = (): Set<NoteId> => this.members();

  get = (id: NoteId): NoteText | undefined => {
    return this.ids().has(id) ? this.#notes.get(id) ?? "" : undefined;
  };

  set = (id: NoteId, text: NoteText): void => {
    this.#notes.set(id, text);
    if (!this.ids().has(id)) {
      this.relate([{ child: id, parent: this.homeId() }]);
    }
  };

  // todo: relate and unrelate methods with parentId and childId argument names instead of parent/child for clarity
}
