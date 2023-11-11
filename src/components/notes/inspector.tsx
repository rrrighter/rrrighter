import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import Parents from './parents'
import FormattedText from "./formatted-text";
import NoteToolbar from "./note-toolbar";

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

      <FormattedText text={props.note.text} />
    </div>
  </>
}
