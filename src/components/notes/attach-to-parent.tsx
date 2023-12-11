import React, {useState} from "react"
import {Button} from "antd";
import SearchDrawer from "../notebook/search/search-drawer";
import Notebook, { Note } from "../../lib/rrrighter/src/notebook";
import {PullRequestOutlined} from "@ant-design/icons";

export default function AttachToParent(props: { notebook: Notebook, child: Note, onAttach: Function }) {
    const [open, setOpen] = useState(false);

    const potentialParentsNotebook = (notebook: Notebook, child: Note): Notebook => {
        const deleteNote = (child: Note) => {
            notebook.parents(child)?.forEach((parent) => {
                notebook.unrelate({ parent, child })
            })
        }

        const result = new Notebook(notebook)
        result.descendants(child)?.forEach((descendant) => deleteNote(descendant))
        deleteNote(child)
        return result
    }
    const potentialParents = open ? potentialParentsNotebook(new Notebook(props.notebook), props.child) : new Notebook(props.notebook.home)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onSelect = (parent: Note) => {
        props.onAttach(parent, props.child)
        onClose()
    }

    return (
        <>
            <Button type="text" size="small" onClick={showDrawer}><PullRequestOutlined /></Button>
            <SearchDrawer notebook={potentialParents} onSelect={onSelect} onClose={onClose} open={open} />
        </>
    )
}
