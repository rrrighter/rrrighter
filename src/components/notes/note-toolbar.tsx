import React from 'react'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'

import {Button, Popconfirm} from 'antd'
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
    return <>
        <AttachToParent notebook={props.notebook} childId={props.noteId} onAttach={props.onAttach} />
        <CreateNoteButton onCreate={props.onCreateChild} />
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => props.onEdit()} />

        <Popconfirm
            title="Delete the note"
            description="Are you sure to delete this note?"
            onConfirm={() => props.onDelete()}
            okText="Yes"
            cancelText="No"
        >
            <Button type='text' size='small' danger icon={<DeleteOutlined />} />
        </Popconfirm>
    </>
}
