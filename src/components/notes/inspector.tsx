import React from "react";
import { NoteId } from "../../lib/rrrighter/src/notebook";
import Notebook from "../../lib/rrrighter/src/notebook";
import FormattedText from "./formatted-text";
import Outline from "../notebook/outline/outline";

export default function Inspector(props: {
  notebook: Notebook;
  id: NoteId;
  onSelect?: Function;
}) {
  return (
    <div>
      <FormattedText text={props.notebook.get(props.id) || ""} />
      <Outline
        notebook={props.notebook}
        parentId={props.id}
        onSelect={props.onSelect}
      />
    </div>
  );
}
