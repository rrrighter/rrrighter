import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

import { Button, Popconfirm } from "antd";
import AttachToParent from "./attach-to-parent";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import CreateNoteButton from "./create-note-button";
import EditNoteButton from "./edit-note-button";

export default function NoteToolbar(props: {
  notebook: Notebook;
  noteId: NoteId;
  onEdit: Function;
  onDelete: Function;
  onCreate: Function;
  onAttach: Function;
}) {
  const isHomeNote = props.noteId === props.notebook.homeId();

  return (
    <>
      <AttachToParent
        notebook={props.notebook}
        childId={props.noteId}
        onAttach={props.onAttach}
      />
      <EditNoteButton
        text={props.notebook.get(props.noteId) || ""}
        onEdit={props.onEdit}
      />
      <CreateNoteButton onCreate={props.onCreate} />

      <Popconfirm
        disabled={isHomeNote}
        title="Delete the note"
        description="Are you sure to delete this note?"
        onConfirm={() => props.onDelete(props.noteId)}
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
