import React, {useState} from "react"
import {Button} from "antd";
import SearchDrawer from "../notebook/search/search-drawer";
import Notebook from "../../lib/rrrighter/src/notebook";
import {PullRequestOutlined} from "@ant-design/icons";

export default function AttachToParent(props: { notebook: Notebook, childId: string, onAttach: Function }) {
    const [open, setOpen] = useState(false);

    const potentialParentsNotebook = (notebook: Notebook, childId: string): Notebook => { // todo: extract to Rrrighter app class?
        const result = new Notebook(notebook)
        result.descendants(childId)?.forEach((descendant) => result.delete(descendant.id))
        result.delete(childId)
        return result
    }
    const potentialParents = potentialParentsNotebook(props.notebook, props.childId)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onSelect = (parentId: string) => {
        props.onAttach(parentId, props.childId)
        onClose()
    }

    return (
        <>
            <Button type="text" size="small" onClick={showDrawer}><PullRequestOutlined /></Button>
            <SearchDrawer notebook={potentialParents} onSelect={onSelect} onClose={onClose} open={open} />
        </>
    )
}
