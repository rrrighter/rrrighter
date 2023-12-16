import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

import { Button, Popconfirm } from "antd";
import AttachToParent from "./attach-to-parent";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import CreateNoteButton from "./create-note-button";
import EditNoteButton from "./edit-note-button";

export default function NoteToolbar(props: {
  notebook: Notebook;
  id: NoteId;
  onEdit: Function;
  onDelete: Function;
  onCreateChild: Function;
  onAttach: Function;
}) {
  const isHomeNote = props.id === props.notebook.homeId();

  return (
    <>
      <AttachToParent
        notebook={props.notebook}
        childId={props.id}
        onAttach={props.onAttach}
      />
      <CreateNoteButton onCreate={props.onCreateChild} />
      <EditNoteButton
        text={props.notebook.get(props.id) || ""}
        onEdit={props.onEdit}
      />

      <Popconfirm
        disabled={isHomeNote}
        title="Delete the note"
        description="Are you sure to delete this note?"
        onConfirm={() => props.onDelete()}
        okText="Yes"
        cancelText="No"
      >
        <Button
          disabled={isHomeNote}
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </>
  );
}
