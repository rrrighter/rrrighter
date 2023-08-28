import React from "react"
import {Modal, Input, Drawer, Button, Space} from "antd";
import Note from "../../lib/rrrighter/src/note";

const { TextArea } = Input;

export default function CreateNote(props: { note: Note, onCancel: Function, onCreate: Function }) {
    const [text, setText] = React.useState(props.note.text)

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const onCancel = () => {
        props.onCancel()
    }

    const onCreate = () => {
        props.onCreate({ id: props.note.id, text })
    }

    return (
        <Drawer title="New note" size={"large"} open={true} onClose={onCancel} extra={
            <Space>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type={"primary"} onClick={onCreate}>Create</Button>
            </Space>
        }>
            <TextArea autoFocus rows={5} value={text} onChange={onTextChange} />
            <p>ID:<span>{props.note.id}</span></p>
        </Drawer>
    )
}
