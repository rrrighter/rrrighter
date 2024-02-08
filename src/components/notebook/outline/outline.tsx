import React from "react";
import Notebook, { NoteId } from "../../../lib/rrrighter/src/notebook";
import { Tree } from "antd";
import NoteItem from "../../notes/note-item";
import "./outline.css";

interface TreeDataNodeType {
  key: string;
  path: NoteId[];
  children?: TreeDataNodeType[];
}

const treeNode = (
  notebook: Notebook,
  path: NoteId[],
): TreeDataNodeType => {
  return {
    path,
    key: path.map(encodeURIComponent).join("/"),
    children: notebook.children(path[path.length - 1])?.map((childId) => {
      return treeNode(notebook, path.concat(childId));
    }),
  };
};

export default function Outline(props: {
  notebook: Notebook;
  parentId?: NoteId;
  selectedKey?: string; // todo: path: NoteId[]
  onSelect?: Function;
  onDrop?: Function;
  onDelete?: Function;
}) {
  const titleRender = (node: TreeDataNodeType) => {
    return <NoteItem notebook={props.notebook} noteId={node.path[node.path.length - 1]} />;
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
            noteId: e.node.path[e.node.path.length - 1],
            parentNoteId: e.node.path[e.node.path.length - 2],
          });
        }
      }}
      treeData={[treeNode(props.notebook, [props.parentId || props.notebook.homeId()])]}
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
