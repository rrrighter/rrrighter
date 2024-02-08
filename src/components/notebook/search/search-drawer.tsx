import React from "react";
import { Drawer } from "antd";
import SearchSelect from "./search-select";
import Outline from "../outline/outline";
import Notebook, {NoteId} from "../../../lib/rrrighter/src/notebook";

export default function SearchDrawer(props: {
  notebook: Notebook;
  onSelect: Function;
  onClose: Function;
  open: boolean;
}) {
  return (
    <Drawer
      title="Select a note"
      placement="right"
      size="large"
      bodyStyle={{ padding: 0 }}
      onClose={() => props.onClose()}
      open={props.open}
      extra={
        <SearchSelect notebook={props.notebook} onSelect={props.onSelect} />
      }
    >
      <Outline notebook={props.notebook} onSelect={(path: NoteId[]) => { props.onSelect(path[path.length - 1]) } } />
    </Drawer>
  );
}
