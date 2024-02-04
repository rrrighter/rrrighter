import React, {ReactElement} from "react";
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
  const _treeData = (ids: NoteId[], parentNoteId?: string): TreeDataNodeType[] => {
    return ids.map((noteId: NoteId) => {
      const key = `${parentNoteId}/${noteId}`;
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
  selectIcon?: ReactElement;
  onSelect?: Function;
  onDrop?: Function;
  onEdit?: Function;
  onDelete?: Function;
}) {
  const titleRender = (node: TreeDataNodeType) => {
    return <NoteItem notebook={props.notebook} noteId={node.noteId}/>
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
          onActiveChange={(activeKey) => {
            console.log('onActiveChange', activeKey);
            // TODO: call onSelect with activeKey not IF activeKey IS NOT NULL
          }}
          draggable={!!props.onDrop}
      onDrop={onDrop}
      onSelect={(keys, e) => {
        console.dir(keys);
        console.dir(e.node);
        const selectedNoteId = keys.length ? e.node.noteId : undefined;
        props.onSelect?.(selectedNoteId ? { noteId: e.node.noteId, parentNoteId: e.node.parentNoteId } : undefined);
      }}
      treeData={treeData(props.notebook, props.parentId)}
      defaultSelectedKeys={props.parentId ? [] : [`undefined/${props.notebook.homeId()}`]}
      defaultExpandedKeys={props.parentId ? [] : [`undefined/${props.notebook.homeId()}`]}
      blockNode
      titleRender={titleRender}
    />
  );
}
