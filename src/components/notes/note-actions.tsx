import React from 'react'
import { Note } from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import {Button} from "antd";

export default function NoteActions(props: {
    note: Note,
    onAction: Function
}) {
    return <>
        <FormattedText text={props.note.text} />
        <Button danger onClick={() => props.onAction('delete')}>Delete</Button>
    </>
}
