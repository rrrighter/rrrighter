import React from "react";
import {Select} from "antd";
import FormattedText from "../../notes/formatted-text";
import Notebook from "../../../lib/rrrighter/src/notebook";
import { useHotkeys } from 'react-hotkeys-hook';

const {Option} = Select;

export default function Search(props: { notebook: Notebook, onSelect: Function }) {
    useHotkeys('/', (e) => {
        e.preventDefault()
        document.getElementById('search')?.focus()
    })

    const searchOptions = Array.from(props.notebook.notes()).map((note) => {
        const firstLine = note.text.split('\n')[0]
        return <Option key={note.id} value={firstLine}>
            <FormattedText text={firstLine}/>
        </Option>
    })

    return <Select
        id='search'
        showAction={['focus', 'click']}
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
