import React from 'react'
import Notebook from '../../../lib/rrrighter/src/notebook'
import Note from '../../../lib/rrrighter/src/note'
import { Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'

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
  const sortByText = (a: Note, b: Note) => a.text.localeCompare(b.text)
  const _treeData = (notes: Iterable<Note>, prefix = ''): TreeDataNodeType[] => {
    return Array.from(notes).sort(sortByText).map((note) => {
      const key = prefix + '/' + note.id
      const childrenNotes = notebook.children(note)
      return { key, note, children: childrenNotes && childrenNotes.size > 0 ? _treeData(childrenNotes, key) : undefined }
    })
  }

  return _treeData(notebook.hierarchs())
}

export default function TreeTable(props: { notebook: Notebook, onSelect?: Function }) {
  const columns: ColumnsType<DataType> = [
    {
      dataIndex: ['note', 'text'],
      ellipsis: true,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.note.text.localeCompare(b.note.text),
      render: (text: string, record: DataType) => {
        const descendantsCount = props.notebook.descendants(record.note)?.size || 0

        return <div>
          <Text>{text.split('\n')[0]}</Text>
          <div style={{float: "right"}}><Text type="secondary">{descendantsCount === 0 ? '' : descendantsCount}</Text></div>
        </div>
      }
    }
  ]

  const onRow = (record: DataType) => {
    return {
      onClick: () => props.onSelect && props.onSelect(record.note)
    }
  }

  return <Table showHeader={false} columns={columns} dataSource={treeData(props.notebook)} pagination={false} onRow={onRow} />
}
