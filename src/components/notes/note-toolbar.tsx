import React from 'react'
import {DeleteOutlined} from '@ant-design/icons'

import {Button, Popconfirm} from 'antd'
import AttachToParent from "./attach-to-parent";
import Notebook from "../../lib/rrrighter/src/notebook";
import CreateNoteButton from "./create-note-button";
import EditNoteButton from "./edit-note-button";
import Note from "../../lib/rrrighter/src/note";

export default function NoteToolbar(props: {
    notebook: Notebook,
    note: Note,
    onEdit: Function,
    onDelete: Function,
    onCreateChild: Function,
    onAttach: Function
}) {
    return <>
        <AttachToParent notebook={props.notebook} child={props.note} onAttach={props.onAttach} />
        <CreateNoteButton onCreate={props.onCreateChild} />
        <EditNoteButton text={props.note.text} onEdit={props.onEdit} />

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
