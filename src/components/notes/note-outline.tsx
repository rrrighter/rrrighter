import Notebook from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import React from "react";
import Note from "../../lib/rrrighter/src/note";
import {Typography} from "antd";

const { Text } = Typography;

export default function NoteOutline(props: { notebook: Notebook, note: Note }) {
    const descendantsCount = props.notebook.descendants(props.note.id)?.length || 0

    return <div className='note-outline'>
        <div style={{ float: 'left' }}>
            <FormattedText text={props.note.text} />
        </div>
        <div style={{ float: 'right' }}>
            <Text type="secondary">{descendantsCount === 0 ? '' : descendantsCount}</Text>
        </div>
    </div>
}
