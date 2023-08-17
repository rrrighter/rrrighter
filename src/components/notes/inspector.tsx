import React from 'react'
import Note from '../../lib/rrrighter/src/note'
import Notebook from '../../lib/rrrighter/src/notebook'
import Parents from './parents'
import {Button, Dropdown, MenuProps} from 'antd'
import { SubnodeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import FormattedText from "./formatted-text";

export default function Inspector(props: { notebook: Notebook, note: Note, onEdit: Function, onDelete: Function, onDetach: Function, onAttach: Function, onCreateChild: Function }) {
  const onAttach = (parent: Note) => {
    props.onAttach(parent, props.note)
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

    <div style={{float: "right", marginRight: "1em"}}>
      <Dropdown.Button size="small" trigger={["click"]} menu={menuProps} onClick={() => props.onEdit(props.note)}>
        <EditOutlined />
      </Dropdown.Button>
    </div>

    <div style={{float: "right", marginRight: "1em"}}>
      <Button size="small" onClick={() => props.onCreateChild(props.note.id)} icon={<SubnodeOutlined />} aria-label="Add child note" title="Add child note" />
    </div>
    <FormattedText text={props.note.text} />
  </>
}
