import React, { ReactNode } from "react";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";

import NoteTag from "./note-tag";

export default function Parents(props: {
  notebook: Notebook;
  id: NoteId;
  onDetach?: Function;
  onSelect?: Function;
}) {
  const parents = Array.from(props.notebook.parents(props.id) || []);
  const tags: ReactNode[] = parents.map((parent): ReactNode => {
    return (
      <NoteTag
        notebook={props.notebook}
        parentId={parent}
        childId={props.id}
        onSelect={props.onSelect}
        onDetach={props.onDetach || undefined}
      />
    );
  });
  return <>{tags}</>;
}
