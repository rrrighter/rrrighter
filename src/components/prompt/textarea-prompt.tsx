import React from 'react'
import {Input, Drawer, Button} from "antd";
import {TextAreaRef} from "antd/es/input/TextArea";

const { TextArea } = Input;

export default function TextareaPrompt(props: {
  title: string,
  buttonText: string,
  onClose: Function,
  onInput: Function
}) {
  const [text, setText] = React.useState('')
  const inputRef = React.createRef<TextAreaRef>()

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const onClose = () => {
    props.onClose()
  }

  const onInput = () => {
    props.onInput(text)
  }

  const setFocus = (isOpen: boolean) => {
    isOpen && inputRef?.current?.focus({ cursor: 'end' });
  }

  const button = <Button type={"primary"} onClick={onInput}>{props.buttonText}</Button>
  return <Drawer open={true} size={'large'} afterOpenChange={setFocus} title={props.title} onClose={onClose} extra={button}>
    <TextArea ref={inputRef} style={{ height: '100%' }} rows={10} value={text} onChange={onTextChange} />
  </Drawer>
}
