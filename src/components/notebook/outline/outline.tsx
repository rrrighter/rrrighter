import React from 'react'
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import {Tree} from 'antd'
import type { TreeProps } from 'antd/es/tree';
import NoteOutline from "../../notes/note-outline";
import './outline.css';

interface TreeDataNodeType {
  key: string
  note: Note
  parent: Note | undefined
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  const sortByText = (a: Note, b: Note) => a.text.localeCompare(b.text, undefined, { numeric: true })
  const _treeData = (notes: Iterable<Note>, prefix = '', parent: Note | undefined = undefined): TreeDataNodeType[] => {
    return Array.from(notes).sort(sortByText).map((note) => {
      const key = prefix + '/' + note.id
      const childrenNotes = notebook.children(note.id)
      return { key, parent, note, children: childrenNotes && childrenNotes.length > 0 ? _treeData(childrenNotes, key, note) : undefined }
    })
  }

  return _treeData(notebook.hierarchs())
}

export default function Outline(props: { notebook: Notebook, onNoteSelect?: Function }) {
  const titleRender = (node: TreeDataNodeType) => <NoteOutline
      notebook={props.notebook} note={node.note}
  />

  const onSelect: TreeProps['onSelect'] = (_selectedKeys, info) => {
    const node = info.node as unknown as TreeDataNodeType
    props.onNoteSelect && props.onNoteSelect(node.note.id)
  };

  return <Tree
      treeData={treeData(props.notebook)}
      blockNode
      titleRender={titleRender}
      onSelect={onSelect}
  />
}
