import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import Parents from './parents'
import {Dropdown, MenuProps} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import FormattedText from "./formatted-text";
import NoteToolbar from "./note-toolbar";

export default function Inspector(props: { notebook: Notebook, note: Note, onEdit: Function, onDelete: Function, onDetach: Function, onAttach: Function, onCreateChild: Function }) {
  const onAttach = (parentId: string) => {
    props.onAttach(parentId, props.note.id)
  }

  const handleMenuClick: MenuProps['onClick'] = (_e) => {
    props.onDelete(props.note)
  };

  const items: MenuProps['items'] = [
    {
      label: 'Delete',
      key: 'delete',
      icon: <DeleteOutlined />,
      danger: true,
    }
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  return <>
    <Parents notebook={props.notebook} note={props.note} onDetach={props.onDetach} onAttach={onAttach} />

    <div>
      <div style={{float: "right"}}>
        <Dropdown.Button type="text" size="small" trigger={["click"]} menu={menuProps} onClick={() => props.onEdit(props.note)}>
          <EditOutlined />
        </Dropdown.Button>
      </div>

      <div style={{float: "right", marginRight: "0.5em"}}>
        <NoteToolbar noteId={props.note.id} onCreateChild={(noteId: string) => props.onCreateChild(noteId)} />
      </div>

      <FormattedText text={props.note.text} />
    </div>
  </>
}
