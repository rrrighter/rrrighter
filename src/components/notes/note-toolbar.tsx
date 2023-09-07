import React from 'react'
import {SubnodeOutlined} from '@ant-design/icons'

import {Button} from 'antd'

export default function NoteToolbar(props: { noteId: string, onCreateChild: Function }) {
    return <>
        <Button size="small" onClick={() => props.onCreateChild(props.noteId)} icon={<SubnodeOutlined />} aria-label="Add child note" title="Add child note" />
    </>
}
