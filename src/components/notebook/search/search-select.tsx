import React from "react";
import { Select } from "antd";
import Notebook from "../../../lib/rrrighter/src/notebook";
import NoteItem from "../../notes/note-item";

const { Option } = Select;

export default function SearchSelect(props: {
  notebook: Notebook;
  onSelect?: Function;
}) {
  const ids = [...props.notebook.ids()];

  const searchOptions = ids.map((id, index) => {
    return (
      <Option key={index} value={props.notebook.get(id) || ""}>
        <NoteItem notebook={props.notebook} id={id} />
      </Option>
    );
  });

  return (
    <Select
      style={{ width: "20em" }}
      showSearch
      bordered={false}
      placeholder="Search"
      value={[]}
      onSelect={(_val: string, option: any) =>
        props.onSelect && props.onSelect(ids[option.key])
      }
    >
      {searchOptions}
    </Select>
  );
}
