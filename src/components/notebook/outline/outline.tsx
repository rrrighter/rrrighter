import React, { ReactElement } from "react";
import Notebook, {
  NoteId,
  NoteText,
} from "../../../lib/rrrighter/src/notebook";
import { Tree } from "antd";
import NoteItem from "../../notes/note-item";
import "./outline.css";

interface TreeDataNodeType {
  key: string;
  id: NoteId;
  text: NoteText;
  children?: TreeDataNodeType[];
}

const treeData = (
  notebook: Notebook,
  parentId?: NoteId,
): TreeDataNodeType[] => {
  // todo: move to Rrrighter app presentation layer?
  const _treeData = (ids: NoteId[], prefix?: string): TreeDataNodeType[] => {
    return ids.map((id: NoteId, index) => {
      const key = prefix ? `${prefix}-${index}` : index.toString();
      const text = notebook.get(id) || "";
      const childrenIds = notebook.children(id);
      const children =
        childrenIds && childrenIds?.length > 0
          ? _treeData(childrenIds, key)
          : undefined;
      return {
        key,
        id,
        text,
        children,
      };
    });
  };

  const ids = parentId
    ? (notebook.children(parentId) as NoteId[])
    : [notebook.homeId()];
  return _treeData(ids);
};

export default function Outline(props: {
  notebook: Notebook;
  defaultExpandedHome?: boolean;
  parentId?: NoteId;
  selectIcon?: ReactElement;
  onSelect?: Function;
  onDrop?: Function;
}) {
  const titleRender = (node: TreeDataNodeType) => (
    <NoteItem notebook={props.notebook} id={node.id} />
  );

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
      onSelect={(_selectedKeys, e) => {
        props.onSelect && props.onSelect(e.node.id);
      }}
      treeData={treeData(props.notebook, props.parentId)}
      defaultExpandedKeys={props.defaultExpandedHome ? ["0"] : []}
      blockNode
      titleRender={titleRender}
    />
  );
}
