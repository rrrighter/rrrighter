import React, {ReactElement} from 'react'
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import {Tree} from 'antd'
import NoteOutline from "../../notes/note-outline";
import './outline.css';

interface TreeDataNodeType {
  key: string
  note: Note
  parent: Note | undefined
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook, parentId?: string): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  const _treeData = (notes: Iterable<Note>, prefix = '', parent: Note | undefined = undefined): TreeDataNodeType[] => {
    return Array.from(notes).map((note) => {
      const key = prefix + '/' + note.id
      const childrenNotes = notebook.children(note.id)
      return { key, parent, note, children: childrenNotes && childrenNotes.length > 0 ? _treeData(childrenNotes, key, note) : undefined }
    })
  }

  const notes = parentId ? notebook.children(parentId) || [] : notebook.children(notebook.hierarch)
  return _treeData(notes)
}

export default function Outline(props: { notebook: Notebook, parentId?: string, selectIcon?: ReactElement, onSelect?: Function, onDrop?: Function }) {
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
      onSelect={(_selectedKeys, e) => { props.onSelect && props.onSelect(e.node.note.id) }}
      treeData={treeData(props.notebook, props.parentId)}
      blockNode
      titleRender={titleRender}
  />
}
