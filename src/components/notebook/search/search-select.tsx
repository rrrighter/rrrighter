import React from "react";
import {Select} from "antd";
import FormattedText from "../../notes/formatted-text";
import Notebook from "../../../lib/rrrighter/src/notebook";

const {Option} = Select;

export default function SearchSelect(props: { notebook: Notebook, onSelect: Function }) {
    const searchOptions = Array.from(props.notebook.notes()).map((note) => {
        const firstLine = note.text.split('\n')[0]
        return <Option key={note.id} value={firstLine}>
            <FormattedText text={firstLine}/>
        </Option>
    })

    return <Select
        style={{width: '20em'}}
        showSearch
        bordered={false}
        placeholder="Search"
        value={[]}
        onSelect={(_val: string, option: any) => props.onSelect(option.key)}
    >
        {searchOptions}
    </Select>
}
