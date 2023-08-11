import React from "react"
import {Modal, Input} from "antd";
import Note from "../../lib/rrrighter/src/note";

const { TextArea } = Input;

export default function CreateNoteModal(props: { note: Note, onCancel: Function, onCreate: Function }) {
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
        <Modal title="New note" okText="Create" open={true} onCancel={onCancel} onOk={onCreate}>
            <TextArea rows={5} value={text} onChange={onTextChange} />
            <p>ID:<span>{props.note.id}</span></p>
        </Modal>
    )
}
