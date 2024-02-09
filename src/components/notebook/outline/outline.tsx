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

const treeNode = (notebook: Notebook, path: NoteId[]): TreeDataNodeType => {
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
  path?: NoteId[];
  selectedPath?: NoteId[];
  onSelect?: Function;
  onDrop?: Function;
  onDelete?: Function;
}) {
  const path = props.path || [props.notebook.homeId()];
  const selectedPath = props.selectedPath || [props.notebook.homeId()];
  const selectedKey = selectedPath.map(encodeURIComponent).join("/");

  const titleRender = (node: TreeDataNodeType) => {
    return (
      <NoteItem
        notebook={props.notebook}
        noteId={node.path[node.path.length - 1]}
      />
    );
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

  const onActiveChange = (key?: React.Key) => {
    if (key) {
      const path = key
        .toString()
        .split("/")
        .map(decodeURIComponent) as NoteId[];
      props.onSelect?.(path);
    }
  };

  const treeData = [
    treeNode(props.notebook, path),
  ];
  const onSelect = (keys: React.Key[], e: { node: TreeDataNodeType }) => {
    if (keys.length) {
      props.onSelect?.(Array.from(e.node.path));
    }
  };

  return (
    <Tree
      blockNode
      titleRender={titleRender}
      treeData={treeData}
      activeKey={selectedKey}
      selectedKeys={[selectedKey]}
      defaultExpandedKeys={[treeData[0].key]}
      onActiveChange={onActiveChange}
      onSelect={onSelect}
      draggable={!!props.onDrop}
      onDrop={onDrop}
    />
  );
}
