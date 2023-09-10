import React, {ReactNode, useState} from 'react'
import Note from "../../lib/rrrighter/src/note"
import Notebook from '../../lib/rrrighter/src/notebook'
import { PullRequestOutlined } from '@ant-design/icons'

import {Button} from 'antd'
import SearchDrawer from "../notebook/search/search-drawer";
import NoteTag from "./note-tag";

export default function Parents(props: {
  notebook: Notebook,
  note: Note,
  onDetach: Function,
  onAttach: Function,
  onSelect?: Function
}) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const parents = Array.from(props.notebook.parents(props.note.id) || [])
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    return <NoteTag parent={parent} child={props.note} onSelect={props.onSelect} onDetach={props.onDetach} />
  })

  const potentialParentsNotebook = (notebook: Notebook, note: Note): Notebook => { // todo: extract to Rrrighter app class?
    const result = new Notebook(notebook)
    result.descendants(note.id)?.forEach((descendant) => result.delete(descendant.id))
    result.delete(note.id)
    return result
  }

  const onSelect = (parentId: string) => {
    props.onAttach(parentId)
    onClose()
  }

  const potentialParents = potentialParentsNotebook(props.notebook, props.note)

  return <div style={{height: '1.2em'}}>
    <div style={{float: "left"}}>
      {tags}
    </div>
    <div style={{float: "right"}}>
      <Button type="text" size="small" onClick={showDrawer}><PullRequestOutlined /></Button>
      <SearchDrawer notebook={potentialParents} onSelect={onSelect} onClose={onClose} open={open} />
    </div>
  </div>
}
