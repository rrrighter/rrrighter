import FormattedText from "./formatted-text";
import React from "react";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import { UpOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import "./note-tag.css";

export default function NoteTag(props: {
  notebook: Notebook;
  parentId: NoteId;
  childId: NoteId;
  onDetach?: Function;
  onSelect?: Function;
}) {
  const firstLine = props.notebook.get(props.parentId)!.split("\n")[0]; // todo: try use Text component instead or create NoteTitle component
  const onClose = (event: any) => {
    // do not hide tag automatically if removal fails
    event.preventDefault();
    props.onDetach && props.onDetach(props.parentId, props.childId);
  };
  return (
    <Tag
      style={{ cursor: "pointer" }}
      icon={<UpOutlined />}
      key={`${props.parentId}/${props.childId}`} // https://github.com/ant-design/ant-design/issues/28768
      onClick={() => props.onSelect && props.onSelect(props.parentId)}
      closable={!!props.onDetach}
      onClose={onClose}
    >
      <FormattedText text={firstLine} />
    </Tag>
  );
}
