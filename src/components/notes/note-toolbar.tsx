import React from 'react'
import {SubnodeOutlined} from '@ant-design/icons'

import {Button} from 'antd'
import AttachToParent from "./attach-to-parent";
import Notebook from "../../lib/rrrighter/src/notebook";

export default function NoteToolbar(props: { notebook: Notebook, noteId: string, onCreateChild: Function, onAttach: Function }) {
    return <>
        <AttachToParent notebook={props.notebook} childId={props.noteId} onAttach={props.onAttach} />
        <Button type="text" size="small" onClick={() => props.onCreateChild(props.noteId)} icon={<SubnodeOutlined />} aria-label="Add child note" title="Add child note" />
    </>
}
