import React from 'react'
import {DeleteOutlined, EditOutlined, SubnodeOutlined} from '@ant-design/icons'

import {Button, Dropdown, MenuProps} from 'antd'
import AttachToParent from "./attach-to-parent";
import Notebook from "../../lib/rrrighter/src/notebook";

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

    return <>
        <div style={{float: "right"}}>
            <Dropdown.Button type="text" size="small" trigger={["click"]} menu={menuProps} onClick={() => props.onEdit()}>
                <EditOutlined />
            </Dropdown.Button>
        </div>

        <AttachToParent notebook={props.notebook} childId={props.noteId} onAttach={props.onAttach} />
        <Button type="text" size="small" onClick={() => props.onCreateChild(props.noteId)} icon={<SubnodeOutlined />} aria-label="Add child note" title="Add child note" />
    </>
}
