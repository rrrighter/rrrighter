import React from "react"
import {Input, Drawer, Button, Space} from "antd";
import Note from "../../lib/rrrighter/src/note";
import {TextAreaRef} from "antd/es/input/TextArea";

const { TextArea } = Input;

// todo transform into generic textarea prompt
export default function UpdateNote(props: { note: Note, onClose: Function, onSave: Function }) {
    const [text, setText] = React.useState(props.note.text)
    const inputRef = React.createRef<TextAreaRef>()

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const onClose = () => {
        props.onClose()
    }

    const onSave = () => {
        props.onSave({ id: props.note.id, text })
    }

    const setFocus = (isOpen: boolean) => {
        isOpen && inputRef?.current?.focus({ cursor: 'end' });
    };

    return (
        <Drawer title="Note" size={"large"} open={true} afterOpenChange={setFocus} onClose={onClose} extra={
            <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button type={"primary"} onClick={onSave}>Save</Button>
            </Space>
        }>
            <TextArea ref={inputRef} style={{ height: '100%' }} rows={10} value={text} onChange={onTextChange} />
        </Drawer>
    )
}
