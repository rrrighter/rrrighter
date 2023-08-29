import React from "react"
import {Input, Drawer, Button, Space} from "antd";
import Note from "../../lib/rrrighter/src/note";
import {TextAreaRef} from "antd/es/input/TextArea";

const { TextArea } = Input;

export default function CreateNote(props: { note: Note, onCancel: Function, onCreate: Function }) {
    const [text, setText] = React.useState(props.note.text)
    const inputRef = React.createRef<TextAreaRef>()

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const onCancel = () => {
        props.onCancel()
    }

    const onCreate = () => {
        props.onCreate({ id: props.note.id, text })
    }

    const setFocus = (isOpen: boolean) => {
        isOpen && inputRef?.current?.focus();
    };

    return (
        <Drawer title="New note" size={"large"} open={true} afterOpenChange={setFocus} onClose={onCancel} extra={
            <Space>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type={"primary"} onClick={onCreate}>Create</Button>
            </Space>
        }>
            <TextArea ref={inputRef} style={{ height: '100%' }} rows={10} value={text} onChange={onTextChange} />
        </Drawer>
    )
}
