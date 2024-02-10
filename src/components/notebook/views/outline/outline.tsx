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
interface ViewProps {
  notebook: Notebook,
  selected?: Set<Path>,
  onSelect?: onSelectFunction,
  onOpen?: onOpenFunction, // TODO: double click to open, i.e. narrow the original scope and feed scoped notebook
  onDrop?: onDropFunction
}

// TODO: deprecate in favor of View
interface OutlineProps extends ViewProps {
  path?: NoteId[]; // todo: deprecate in favor of scoped notebook
}

interface TreeDataNodeType {
  key: string;
  path: NoteId[];
  children?: TreeDataNodeType[];
}

// todo: implement NotebookViewComponent interface { props: NotebookViewProps } => JSX.Element
export default function Outline(props: OutlineProps) {
  const path = props.path || [props.notebook.homeId()];
  const defaultSelectedPath = [props.notebook.homeId() as NoteId]
  const selectedSet = props.selected || new Set<Path>([defaultSelectedPath]);
  const selectedPath = Array.from(selectedSet.values()).pop() as Path;
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

  const changeActive = (key?: React.Key) => {
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

  const expand = (_expandedKeys: React.Key[], event: { node: TreeDataNodeType }) => {
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
      onExpand={expand}
      onActiveChange={changeActive}
      draggable={!!props.onDrop}
      onSelect={onSelect}
    />
  );
}
