import Notebook from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import React from "react";
import Note from "../../lib/rrrighter/src/note";
import {Button, Typography} from "antd";
import {ZoomInOutlined} from "@ant-design/icons";

const { Text } = Typography;

export default function NoteOutline(props: { notebook: Notebook, note: Note }) {
    const descendantsCount = props.notebook.descendants(props.note.id)?.size || 0

    return <div className='note-outline'>
        <div style={{ float: 'left' }}>
            <FormattedText text={props.note.text} />
        </div>
        <div style={{ float: 'right' }}>
            <Text type="secondary">{descendantsCount === 0 ? '' : descendantsCount}</Text>
        </div>
        <div style={{float: "right", marginRight: "0.5em"}}>
            <Button className="zoom-in" type="text" size="small"><ZoomInOutlined /></Button>
        </div>
    </div>
}
