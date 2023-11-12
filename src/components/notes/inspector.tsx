import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import Parents from './parents'
import FormattedText from "./formatted-text";
import NoteToolbar from "./note-toolbar";
import Outline from "../notebook/outline/outline";

export default function Inspector(props: {
  notebook: Notebook,
  note: Note,
  onEdit: Function,
  onDelete: Function,
  onDetach: Function,
  onAttach: Function,
  onCreateChild: Function,
  onInspect?: Function
}) {
  const inspectorScopeNotebook = new Notebook(props.notebook)
  const descendantIds = new Set(Array.from(props.notebook.descendants(props.note.id) || []).map(n => n.id))
  for (const note of inspectorScopeNotebook.notes()) {
    if (!descendantIds.has(note.id)) {
      inspectorScopeNotebook.delete(note.id)
    }
  }

  return <>
    <Parents notebook={props.notebook} note={props.note} onDetach={props.onDetach} onSelect={props.onInspect} />

    <div>
      <div style={{float: "right", marginRight: "0.5em"}}>
        <NoteToolbar
            notebook={props.notebook}
            noteId={props.note.id}
            onEdit={() => props.onEdit(props.note)}
            onCreateChild={props.onCreateChild}
            onAttach={props.onAttach}
            onDelete={() => props.onDelete(props.note)}
        />
      </div>

      <span style={{cursor: "pointer"}} onClick={() => props.onEdit(props.note)}>
        <FormattedText text={props.note.text} />
      </span>

      <Outline notebook={inspectorScopeNotebook} onSelect={props.onInspect} />
    </div>
  </>
}
