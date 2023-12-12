import React, {ReactElement} from 'react'
import Notebook, { Note } from '../../../lib/rrrighter/src/notebook'
import {Tree} from 'antd'
import NoteItem from "../../notes/note-item";
import './outline.css';

interface TreeDataNodeType {
  key: string
  note: Note
  parent: Note | undefined
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook, parent?: Note): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  const _treeData = (notes: Iterable<Note>, parent: Note | undefined = undefined, prefix?: string): TreeDataNodeType[] => {
    return Array.from(notes).map((note, index) => {
      const key = prefix ? `${prefix}-${index}` : index.toString() // to maintain expanded nodes state after notebook changes
      const childrenNotes = notebook.children(note)
      return { key, parent, note, children: childrenNotes && childrenNotes.length > 0 ? _treeData(childrenNotes,  note, key) : undefined }
    })
  }

  const notes = parent ? notebook.children(parent) as Note[] : [notebook.hierarch] // todo: consider passing notes[] instead
  return _treeData(notes)
}

export default function Outline(props: { notebook: Notebook, parent?: Note, selectIcon?: ReactElement, onSelect?: Function, onDrop?: Function }) {
  const titleRender = (node: TreeDataNodeType) => <NoteItem notebook={props.notebook} note={node.note} />

  const onDrop = (e: any) => {
    console.dir(e)

    if (props.onDrop) {
      const sourceNoteId = e.dragNode.note.id
      const targetParentNoteId = e.node.parent?.id
      const index = e.dropPosition

      props.onDrop(e, sourceNoteId, targetParentNoteId, index)
    }
  }

  return <Tree
      draggable={!!props.onDrop}
      onDrop={onDrop}
      onSelect={(_selectedKeys, e) => { props.onSelect && props.onSelect(e.node.note) }}
      treeData={treeData(props.notebook, props.parent)}
      blockNode
      titleRender={titleRender}
  />
}
