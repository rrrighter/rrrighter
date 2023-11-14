import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import FormattedText from "./formatted-text";
import Outline from "../notebook/outline/outline";

export default function Inspector(props: {
  notebook: Notebook,
  note: Note,
  onSelect?: Function
}) {
  return <div>
    <FormattedText text={props.note.text} />
    <Outline notebook={props.notebook} parentId={props.note.id} onSelect={props.onSelect} />
  </div>
}
