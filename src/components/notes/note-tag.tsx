import FormattedText from "./formatted-text";
import React from "react";
import Note from "../../lib/rrrighter/src/note";
import {UpOutlined} from "@ant-design/icons";
import {Tag} from 'antd'

export default function NoteTag(props: {
    parent: Note,
    child: Note,
    onDetach: Function,
    onSelect?: Function
}) {
    const firstLine = props.parent.text.split('\n')[0] // todo: try use Text component instead or create NoteTitle component
    return <Tag
        style={{ cursor: 'pointer' }}
        icon={<UpOutlined />}
        key={`${props.parent.id}/${props.child.id}`}
        onClick={() => props.onSelect && props.onSelect(props.parent.id)}
        closable
        onClose={() => props.onDetach(props.parent, props.child)}
    >
        <FormattedText text={firstLine} />
    </Tag>
}
