import React from "react";
import Notebook, {
  NoteId,
  NoteText,
} from "../../../lib/rrrighter/src/notebook";
import { Tree } from "antd";
import NoteItem from "../../notes/note-item";
import "./outline.css";

interface TreeDataNodeType {
  key: string;
  noteId: NoteId;
  text: NoteText;
  parentNoteId?: NoteId;
  children?: TreeDataNodeType[];
}

const treeData = (
  notebook: Notebook,
  parentId?: NoteId,
): TreeDataNodeType[] => {
  // todo: move to Rrrighter app presentation layer?
  const _treeData = (
    ids: NoteId[],
    parentNoteId?: string,
  ): TreeDataNodeType[] => {
    return ids.map((noteId: NoteId) => {
      let key = encodeURIComponent(noteId);
      if (parentNoteId) {
        key = `${encodeURIComponent(parentNoteId)}/${key}`;
      }
      const text = notebook.get(noteId) || "";
      const childrenIds = notebook.children(noteId);
      const children =
        childrenIds && childrenIds?.length > 0
          ? _treeData(childrenIds, noteId)
          : undefined;
      return {
        key,
        noteId,
        parentNoteId,
        text,
        children,
      };
    });
  };

  const ids = parentId
    ? (notebook.children(parentId) as NoteId[])
    : [notebook.homeId()];
  return _treeData(ids, parentId);
};

export default function Outline(props: {
  notebook: Notebook;
  parentId?: NoteId;
  selectedKey?: string;
  onSelect?: Function;
  onDrop?: Function;
  onEdit?: Function;
  onDelete?: Function;
}) {
  const titleRender = (node: TreeDataNodeType) => {
    return <NoteItem notebook={props.notebook} noteId={node.noteId} />;
  };

  const onDrop = (e: any) => {
    console.dir(e);

    if (props.onDrop) {
      const sourceNoteId = e.dragNode.note.id;
      const targetParentNoteId = e.node.parent?.id;
      const index = e.dropPosition;

      props.onDrop(e, sourceNoteId, targetParentNoteId, index);
    }
  };

  return (
    <Tree
      draggable={!!props.onDrop}
      onDrop={onDrop}
      onActiveChange={(key?) => {
        if (key) {
          console.log("onActiveChange", key);
          const path = key.toString().split("/").map(decodeURIComponent) as NoteId[];
          console.dir(path);
          const noteId = path.pop() as NoteId;
          const parentNoteId = path.pop();
          props.onSelect?.({ noteId, parentNoteId })
        }
      }}
      onSelect={(keys, e) => {
        if (keys.length) {
          props.onSelect?.({
            noteId: e.node.noteId,
            parentNoteId: e.node.parentNoteId,
          });
        }
      }}
      treeData={treeData(props.notebook, props.parentId)}
      selectedKeys={props.selectedKey ? [props.selectedKey] : []}
      activeKey={props.selectedKey}
      defaultExpandedKeys={
        [props.notebook.homeId()]
      }
      blockNode
      titleRender={titleRender}
    />
  );
}
