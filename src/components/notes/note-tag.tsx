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
  return (
    <Tag
      style={{ cursor: "pointer" }}
      icon={<UpOutlined />}
      // key={`${props.parent}/${props.child.id}`}
      onClick={() => props.onSelect && props.onSelect(props.parentId)}
      closable={!!props.onDetach}
      onClose={() =>
        props.onDetach && props.onDetach(props.parentId, props.childId)
      }
    >
      <FormattedText text={firstLine} />
    </Tag>
  );
}
