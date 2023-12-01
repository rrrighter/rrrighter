import React, {ReactNode} from 'react'
import Note from "../../lib/rrrighter/src/note"
import Notebook from '../../lib/rrrighter/src/notebook'

import NoteTag from "./note-tag";

export default function Parents(props: {
  notebook: Notebook,
  note: Note,
  onDetach?: Function,
  onSelect?: Function
}) {
  const parents = Array.from(props.notebook.parents(props.note.id) || [])
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    return <NoteTag parent={parent} child={props.note} onSelect={props.onSelect} onDetach={props.onDetach || undefined} />
  })
  return <>{tags}</>
}
