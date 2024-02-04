import React, { ReactNode } from "react";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";

import NoteTag from "./note-tag";

export default function Parents(props: {
  notebook: Notebook;
  noteId: NoteId;
  onDetach?: Function;
  onSelect?: Function;
}) {
  const parentIds = props.notebook.parents(props.noteId) as Set<NoteId>
  const parents = Array.from(parentIds || []);
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    return (
      <NoteTag
        notebook={props.notebook}
        parentId={parent}
        childId={props.noteId}
        onSelect={props.onSelect}
        onDetach={props.onDetach || undefined}
      />
    );
  });
  return <>{tags}</>;
}
