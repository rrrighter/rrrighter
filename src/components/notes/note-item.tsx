import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import React from "react";
import { Typography } from "antd";
import "./note-outline.css";

const { Text } = Typography;

export default function NoteItem(props: { notebook: Notebook; id: NoteId }) {
  const descendantsCount = props.notebook.descendants(props.id)?.size || 0;

  return (
    <div className="note-outline">
      <div style={{ float: "left" }}>
        <FormattedText text={props.notebook.get(props.id) || ""} />
      </div>
      <div style={{ float: "right" }}>
        <Text type="secondary">
          {descendantsCount === 0 ? "" : descendantsCount}
        </Text>
      </div>
    </div>
  );
}
