import React, { ReactNode } from 'react'
import Note from "../../lib/rrrighter/src/note"
import Notebook from '../../lib/rrrighter/src/notebook'
import { Popover } from 'antd';
import { PullRequestOutlined } from '@ant-design/icons'

import { Tag } from 'antd'
import TreeTable from '../notebook/tree-table/tree-table' // todo: move to hierarchy/ folder

export default function Parents(props: { notebook: Notebook, note: Note, onDetach: Function, onAttach: Function }) {
  const parents = Array.from(props.notebook.parents(props.note.id) || [])
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    const label = parent.text.split('\n')[0] // todo: try use Text component instead or create NoteTitle component
    return <Tag key={parent.id} closable onClose={() => props.onDetach(parent, props.note)}>{label}</Tag>
  })

  const potentialParentsNotebook = (notebook: Notebook, note: Note): Notebook => { // todo: extract to Rrrighter app class?
    const result = new Notebook(notebook)
    result.descendants(note.id)?.forEach((descendant) => result.hierarchy.remove(descendant))
    result.hierarchy.remove(note)
    return result
  }

  const popoverContent = (
    <div style={{width: "30em", height: "30em", overflow: "scroll"}}>
      <TreeTable notebook={potentialParentsNotebook(props.notebook, props.note)} onSelect={(parent: Note) => props.onAttach(parent)} />
    </div>
  )

  return <>
    <Popover content={popoverContent} trigger="click" placement="bottomLeft" title="Attach to parent">
      <Tag style={{ borderStyle: 'dashed', cursor: 'pointer' }}><PullRequestOutlined /></Tag>
    </Popover>
    {tags}
  </>
}
