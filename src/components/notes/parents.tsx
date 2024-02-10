import React, { ReactNode } from "react";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";

import NoteButton from "./note-button";
import {HomeOutlined, UpOutlined} from "@ant-design/icons";

export default function Parents(props: {
  notebook: Notebook;
  noteId: NoteId;
  onClick?: Function;
  onDetach?: Function;
}) {
  const parentIds = props.notebook.parents(props.noteId) as Set<NoteId>;
  const tags: ReactNode[] = Array.from(parentIds).map((parentId): ReactNode => {
    return (
      <NoteButton
        notebook={props.notebook}
        noteId={parentId}
        icon={parentId === props.notebook.homeId() ? <HomeOutlined /> : <UpOutlined />}
        onClick={props.onClick}
        onClose={() =>
          props.onDetach?.({ parentId: parentId, childId: props.noteId })
        }
      />
    );
  });
  return <>{tags}</>;
}
