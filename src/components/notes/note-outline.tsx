import Notebook from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import React from "react";
import Note from "../../lib/rrrighter/src/note";
import {Typography} from "antd";

const { Text } = Typography;

export default function NoteOutline(props: { notebook: Notebook, note: Note }) {
    const firstLine = props.note.text.split('\n')[0]
    const descendantsCount = props.notebook.descendants(props.note.id)?.size || 0

    return <>
        <div style={{ float: 'left' }}>
            <FormattedText text={firstLine} />
        </div>
        <div style={{ float: 'right' }}>
            <Text type="secondary">{descendantsCount === 0 ? '' : descendantsCount}</Text>
        </div>
    </>
}
