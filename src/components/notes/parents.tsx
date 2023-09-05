import React, {ReactNode, useState} from 'react'
import Note from "../../lib/rrrighter/src/note"
import Notebook from '../../lib/rrrighter/src/notebook'
import { PullRequestOutlined } from '@ant-design/icons'

import { Tag } from 'antd'
import FormattedText from "./formatted-text";
import SearchDrawer from "../notebook/search/search-drawer";

export default function Parents(props: { notebook: Notebook, note: Note, onDetach: Function, onAttach: Function }) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const parents = Array.from(props.notebook.parents(props.note.id) || [])
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    const firstLine = parent.text.split('\n')[0] // todo: try use Text component instead or create NoteTitle component
    return <Tag key={parent.id} closable onClose={() => props.onDetach(parent, props.note)}><FormattedText text={firstLine} /></Tag>
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

  return <>
    <Tag style={{ borderStyle: 'dashed', cursor: 'pointer' }} onClick={showDrawer}><PullRequestOutlined /></Tag>
    {tags}
    <SearchDrawer notebook={potentialParents} onSelect={onSelect} onClose={onClose} open={open} />
  </>
}
