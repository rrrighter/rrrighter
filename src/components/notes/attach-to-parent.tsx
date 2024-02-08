import React, { useState } from "react";
import { Button } from "antd";
import SearchDrawer from "../notebook/search/search-drawer";
import Notebook, { NoteId } from "../../lib/rrrighter/src/notebook";
import { PullRequestOutlined } from "@ant-design/icons";

export default function AttachToParent(props: {
  notebook: Notebook;
  childId: NoteId;
  onAttach: Function;
}) {
  const [open, setOpen] = useState(false);

  const potentialParentsNotebook = (
    notebook: Notebook,
    childId: NoteId,
  ): Notebook => {
    const deleteNote = (child: NoteId) => {
      notebook.parents(child)?.forEach((parent) => {
        notebook.unrelate({ parent, child });
      });
    };

    const result = new Notebook(notebook);
    result
      .descendants(childId)
      ?.forEach((descendant) => deleteNote(descendant));
    deleteNote(childId);
    return result;
  };
  const potentialParents = open
    ? potentialParentsNotebook(new Notebook(props.notebook), props.childId)
    : new Notebook(props.notebook.homeId());

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSelect = ({ noteId }: { noteId?: NoteId }) => {
    //
    props.onAttach(noteId, props.childId);
    onClose();
  };

  return (
    <>
      <Button
        disabled={props.childId === props.notebook.homeId()}
        type="text"
        size="small"
        onClick={showDrawer}
      >
        <PullRequestOutlined />
      </Button>
      <SearchDrawer
        notebook={potentialParents}
        onSelect={onSelect}
        onClose={onClose}
        open={open}
      />
    </>
  );
}
