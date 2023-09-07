import React from 'react'
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import { Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import NoteOutline from "../../notes/note-outline";

const { Text } = Typography;

interface DataType {
  key: string
  note: Note
  children?: DataType[]
}

interface TreeDataNodeType {
  key: string
  note: Note
  children?: TreeDataNodeType[]
}

const treeData = (notebook: Notebook): TreeDataNodeType[] => { // todo: move to Rrrighter app presentation layer?
  const sortByText = (a: Note, b: Note) => a.text.localeCompare(b.text, undefined, { numeric: true })
  const _treeData = (notes: Iterable<Note>, prefix = ''): TreeDataNodeType[] => {
    return Array.from(notes).sort(sortByText).map((note) => {
      const key = prefix + '/' + note.id
      const childrenNotes = notebook.children(note.id)
      return { key, note, children: childrenNotes && childrenNotes.size > 0 ? _treeData(childrenNotes, key) : undefined }
    })
  }

  return _treeData(notebook.hierarchs())
}

export default function Outline(props: { notebook: Notebook, onSelect?: Function }) {
  const columns: ColumnsType<DataType> = [
    {
      width: '100%',
      sorter: (a, b) => a.note.text.localeCompare(b.note.text),
      render: (_text: string, record: DataType) => {
        return <NoteOutline notebook={props.notebook} note={record.note} />
      }
    }
  ]

  const onRow = (record: DataType) => {
    return {
      onClick: () => props.onSelect && props.onSelect(record.note.id)
    }
  }

  return <Table showHeader={false} columns={columns} dataSource={treeData(props.notebook)} pagination={false} onRow={onRow} />
}
