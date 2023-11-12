import {Button} from "antd";
import {EditOutlined} from "@ant-design/icons";
import React, {useState} from 'react'
import TextareaPrompt from "../prompt/textarea-prompt";

export default function EditNoteButton(props: { text: string, onEdit: Function }) {
    const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false)

    const showPrompt = () => {
        setIsPromptVisible(true)
    }

    const hidePrompt = () => {
        setIsPromptVisible(false)
    }

    const onInput = (text: string) => {
        hidePrompt()
        props.onEdit(text)
    }

    return <>
        <Button type='text' size={'small'} icon={<EditOutlined />} onClick={showPrompt}  aria-label="Edit note" title="Edit note" />
        {isPromptVisible && <TextareaPrompt title='Edit note' buttonText='Save' onClose={hidePrompt} onInput={onInput} text={props.text} />}
    </>
}
