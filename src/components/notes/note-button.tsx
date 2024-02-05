import FormattedText from "./formatted-text";
import React from "react";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import { Tag } from "antd";
import "./note-button.css";

export default function NoteButton(props: {
  notebook: Notebook;
  noteId: NoteId;
  icon?: React.ReactNode;
  onClick?: Function;
  onClose?: Function;
}) {
  const firstLine = props.notebook.get(props.noteId)!.split("\n")[0]; // todo: try use Text component instead or create NoteTitle component
  const onClick = () => {
    props.onClick?.(props.noteId);
  };
  const onClose = (event: any) => {
    // do not hide tag automatically if close fails
    event.preventDefault();
    props.onClose?.(props.noteId);
  };
  return (
    <Tag
      style={{ cursor: "pointer" }}
      icon={props.icon}
      key={props.noteId} // https://github.com/ant-design/ant-design/issues/28768
      onClick={onClick}
      closable={!!props.onClose}
      onClose={onClose}
    >
      <FormattedText text={firstLine} />
    </Tag>
  );
}
