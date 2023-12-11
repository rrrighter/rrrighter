import React, {ReactElement} from 'react'
import Notebook, { Note } from '../../../lib/rrrighter/src/notebook'
import {Tree} from 'antd'
import NoteOutline from "../../notes/note-outline";
import './outline.css';

interface TreeDataNodeType {
  key: string
  note: Note
  parent: Note | undefined
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook, parent?: Note): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  let index = 0

  const _treeData = (notes: Iterable<Note>, parent: Note | undefined = undefined): TreeDataNodeType[] => {
    return Array.from(notes).map((note) => {
      index++
      const key = index.toString()
      const childrenNotes = notebook.children(note)
      return { key, parent, note, children: childrenNotes && childrenNotes.length > 0 ? _treeData(childrenNotes, note) : undefined }
    })
  }

  const notes = notebook.children(parent || notebook.hierarch) || []
  return _treeData(notes)
}

export default function Outline(props: { notebook: Notebook, parent?: Note, selectIcon?: ReactElement, onSelect?: Function, onDrop?: Function }) {
  const titleRender = (node: TreeDataNodeType) => <NoteOutline notebook={props.notebook} note={node.note} />

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
