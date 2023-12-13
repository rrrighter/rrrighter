import React from "react";
import { Select } from "antd";
import Notebook from "../../../lib/rrrighter/src/notebook";
import NoteItem from "../../notes/note-item";

const { Option } = Select;

export default function SearchSelect(props: {
  notebook: Notebook;
  onSelect?: Function;
}) {
  const notesArray = [...props.notebook.notes()];

  const searchOptions = notesArray.map((note, index) => {
    return (
      <Option key={index} value={note.text}>
        <NoteItem notebook={props.notebook} note={note} />
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
        props.onSelect && props.onSelect(notesArray[option.key])
      }
    >
      {searchOptions}
    </Select>
  );
}
