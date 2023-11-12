import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import FormattedText from "./formatted-text";
import Outline from "../notebook/outline/outline";

export default function Inspector(props: {
  notebook: Notebook,
  note: Note,
  onEdit: Function,
  onInspect?: Function
}) {
  const inspectorScopeNotebook = new Notebook(props.notebook)
  const descendantIds = new Set(Array.from(props.notebook.descendants(props.note.id) || []).map(n => n.id))
  for (const note of inspectorScopeNotebook.notes()) {
    if (!descendantIds.has(note.id)) {
      inspectorScopeNotebook.delete(note.id)
    }
  }

  return <div>
    <span style={{cursor: "pointer"}} onClick={() => props.onEdit(props.note)}>
      <FormattedText text={props.note.text} />
    </span>

    <Outline notebook={inspectorScopeNotebook} onSelect={props.onInspect} />
  </div>
}
