import OverlappingHierarchy from "overlapping-hierarchy";
import Note from "./note";

// Notebook is an overlapping hierarchy of text notes with unique IDs.
export default class Notebook extends OverlappingHierarchy<Note> {
  // TODO: #hierarchy = OverlappingHierarchy<string> to manipulate IDs instead of Note objects?
  // TODO: do not extend OH, but delegate to it;
  //  todo: use note IDs as args instead of note object references to mutate hierarchy; cover with tests
  // todo: do not expose add directly
  // todo: delegate attachChild; detachChild; and traversal methods to OH; DO NOT EXPOSE .add
  findById = (id: string): Note | undefined => Array.from(this.nodes()).find((note) => note.id === id)

  upsert = (note: Note): void => {
    const existing = Array.from(this.nodes()).find((n) => n.id === note.id)
    if (existing) {
      existing.text = note.text
    } else {
      this.add(note)
    }
  }

  hierarchs = (): Set<Note> => { // todo: backport into OH with performance benchmarks, as it's O(n*2) and OH is O(n^2)
    const notes = this.nodes()
    this.nodes().forEach((n) => this.children(n)?.forEach((c) => notes.delete(c)))
    return notes
  }

  attach = (parent: Note, child: Note): void => { // todo: lift to Rrrighter app class as this is specific to application layer
    this.descendants(parent)?.forEach((descendant) => this.detach(descendant, child))
    this.ancestors(parent)?.forEach((ancestor) => this.detach(ancestor, child))
    super.attach(parent, child)
  }
}
