import React from 'react'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'

import {Dropdown, MenuProps} from 'antd'
import AttachToParent from "./attach-to-parent";
import Notebook from "../../lib/rrrighter/src/notebook";
import CreateNoteButton from "./create-note-button";

export default function NoteToolbar(props: {
    notebook: Notebook,
    noteId: string,
    onEdit: Function,
    onDelete: Function,
    onCreateChild: Function,
    onAttach: Function
}) {
    const handleMenuClick: MenuProps['onClick'] = (_e) => {
        props.onDelete()
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

    const onCreateChild = (text: string) => {
        props.onCreateChild(text)
    }

    return <>
        <div style={{float: "right"}}>
            <Dropdown.Button type="text" size="small" trigger={["click"]} menu={menuProps} onClick={() => props.onEdit()}>
                <EditOutlined />
            </Dropdown.Button>
        </div>

        <AttachToParent notebook={props.notebook} childId={props.noteId} onAttach={props.onAttach} />
        <CreateNoteButton onCreate={onCreateChild} />
    </>
}
