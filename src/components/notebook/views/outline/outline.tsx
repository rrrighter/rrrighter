import React from "react";
import Notebook, { NoteId } from "../../../../lib/rrrighter/src/notebook";
import { Tree } from "antd";
import NoteItem from "../../../notes/note-item";
import "./outline.css";

// TODO: all content components should be responsible only for rendering the notebook and for indicating [selected] path
// TODO: keyboard navigation and all actions should be handled by higher order components
// TODO: example: Outline, Sunburst, Treemap, etc.
// TODO: path should be replaced with a notebook scoped to note
// TODO: depth should be replaced with a notebook scoped to depth

type Path = NoteId[];

interface onSelectFunction {
  (selectedPath: Path): void;
}

interface onOpenFunction {
  (selectedPath: Path): void;
}

interface onDropFunction {
  (sourcePath: Path, targetPath: Path, targetIndex?: number): void;
}

// TODO: implement clean universal interface for all view components
interface View {
  notebook: Notebook,
  selected?: Set<Path>,
  onSelect?: onSelectFunction,
  onOpen?: onOpenFunction, // TODO: double click to open, i.e. narrow the original scope and feed scoped notebook
  onDrop?: onDropFunction
}

// TODO: deprecate in favor of View
interface MainPanelProps extends View {
  path?: NoteId[]; // todo: deprecate in favor of scoped notebook
  selectedPath?: NoteId[]; // TODO: deprecate in favor of selected Set
}

interface TreeDataNodeType {
  key: string;
  path: NoteId[];
  children?: TreeDataNodeType[];
}

// todo: implement NotebookViewComponent interface { props: NotebookViewProps } => JSX.Element
export default function Outline(props: MainPanelProps) {
  const path = props.path || [props.notebook.homeId()];
  const selectedPath = props.selectedPath || [props.notebook.homeId()];
  const selectedKey = selectedPath.map(encodeURIComponent).join("/");

  const treeNode = (notebook: Notebook, path: NoteId[]): TreeDataNodeType => {
    return {
      path,
      key: path.map(encodeURIComponent).join("/"),
      children: notebook.children(path[path.length - 1])?.map((childId) => {
        return treeNode(notebook, path.concat(childId));
      }),
    };
  };

  const titleRender = (node: TreeDataNodeType) => {
    return (
      <NoteItem
        notebook={props.notebook}
        noteId={node.path[node.path.length - 1]}
      />
    );
  };

  // const onDrop = (e: any) => {
  //   console.dir(e);
  //
  //   if (props.onDrop) {
  //     const sourceNoteId = e.dragNode.note.id;
  //     const targetParentNoteId = e.node.parent?.id;
  //     const index = e.dropPosition;
  //
  //     props.onDrop(e, sourceNoteId, targetParentNoteId, index);
  //   }
  // };

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
  const onSelect = (keys: React.Key[], event: { node: TreeDataNodeType }) => {
    if (keys.length) {
      props.onSelect?.(Array.from(event.node.path));
    }
  };

  const onExpand = (_expandedKeys: React.Key[], event: { node: TreeDataNodeType }) => {
    onSelect([event.node.key], event)
  }

  return (
    <Tree
      blockNode
      titleRender={titleRender}
      treeData={treeData}
      activeKey={selectedKey}
      selectedKeys={[selectedKey]}
      defaultExpandedKeys={[treeData[0].key]}
      draggable={!!props.onDrop}
      onSelect={onSelect}
      onExpand={onExpand}
      onActiveChange={onActiveChange}
    />
  );
}
