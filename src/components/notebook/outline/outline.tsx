import React, {ReactElement} from 'react'
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import {Button, Tree} from 'antd'
import NoteOutline from "../../notes/note-outline";
import './outline.css';
import {ZoomInOutlined} from "@ant-design/icons";

interface TreeDataNodeType {
  key: string
  note: Note
  parent: Note | undefined
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  const _treeData = (notes: Iterable<Note>, prefix = '', parent: Note | undefined = undefined): TreeDataNodeType[] => {
    return Array.from(notes).map((note) => {
      const key = prefix + '/' + note.id
      const childrenNotes = notebook.children(note.id)
      return { key, parent, note, children: childrenNotes && childrenNotes.length > 0 ? _treeData(childrenNotes, key, note) : undefined }
    })
  }

  return _treeData(notebook.hierarchs())
}

export default function Outline(props: { notebook: Notebook, selectIcon?: ReactElement, onNoteSelect?: Function }) {
  const titleRender = (node: TreeDataNodeType) => <>
    <NoteOutline
        notebook={props.notebook} note={node.note}
    />
    <div style={{float: "right"}}>
      <Button className="select" type="text" size="small" onClick={() => props.onNoteSelect && props.onNoteSelect(node.note.id)} icon={props.selectIcon || <ZoomInOutlined/>} />
    </div>
  </>

  return <Tree
      treeData={treeData(props.notebook)}
      blockNode
      titleRender={titleRender}
  />
}
