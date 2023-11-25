import { fromJsonObject } from './lib/rrrighter/src/json-persistence'
import Note from './lib/rrrighter/src/note'
import Notebook from './lib/rrrighter/src/notebook'
import React, {ReactNode, useState} from 'react'
import {App, ConfigProvider, theme, Drawer, Divider, Button} from 'antd'
import Outline from './components/notebook/outline/outline'
import Inspector from './components/notes/inspector'
import NotebookRepository from './components/notebook/repository/notebook-repository'
import welcome from './welcome.json'
import SearchSelect from './components/notebook/search/search-select'
import './rrrighter.css'
import NoteToolbar from "./components/notes/note-toolbar";
import Parents from "./components/notes/parents";
import CreateNoteButton from "./components/notes/create-note-button";

const initialNotebook = new Notebook(fromJsonObject(welcome))

function Rrrighter() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook)
  const [inspectorNote, setInspectorNote] = useState<Note | undefined>(undefined)

  const onDelete = (note: Note) => {
    // todo: confirm action, show number of children
    // todo: handle case with children
    notebook.delete(note.id)
    setInspectorNote(undefined)

    setNotebook(new Notebook(notebook))
  }

  const onDetach = (parent: Note, child: Note) => {
    notebook.detach(parent.id, child.id)

    setNotebook(new Notebook(notebook))
  }

  const onAttach = (parentId: string, childId: string, index?: number) => {
    notebook.descendants(parentId)?.forEach((descendant) => notebook.detach(descendant.id, childId))
    notebook.ancestors(parentId)?.forEach((ancestor) => notebook.detach(ancestor.id, childId))
    console.log(notebook.attach(parentId, childId, index))

    setNotebook(new Notebook(notebook))
  }

  const onSelect = (id: string) => {
    setInspectorNote(notebook.get(id))
  }

  const onCreateHierarch = (text: string) => {
    // eslint-disable-next-line no-restricted-globals
    const id = self.crypto.randomUUID()
    notebook.upsert({ id, text})
    setNotebook(new Notebook(notebook))
  }

  let inspectorDrawer = <></> // todo extract into InspectorDrawer component (notebook, note, actions..) & onNoteAction(inspectorNote.id, action)
  if (inspectorNote) {
    const onCreateChild = (text: string) => {
      // eslint-disable-next-line no-restricted-globals
      const id = self.crypto.randomUUID()
      notebook.upsert({ id, text})
      notebook.attach(inspectorNote.id, id)
      setNotebook(new Notebook(notebook))
    }

    const onEdit = (text: string) => {
      const id = inspectorNote.id
      notebook.upsert({ id, text})
      setNotebook(new Notebook(notebook))
      setInspectorNote(notebook.get(id))
    }
    const noteParents = <Parents notebook={notebook} note={inspectorNote} onDetach={onDetach} onSelect={onSelect} />
    const noteToolbar = <NoteToolbar
        notebook={notebook}
        note={inspectorNote}
        onEdit={onEdit}
        onCreateChild={onCreateChild}
        onAttach={onAttach}
        onDelete={() => onDelete(inspectorNote)}
    />
    const parents = Array.from(notebook.parents(inspectorNote.id) || [])
    const parentIndexes: ReactNode[] = parents.map((parent): ReactNode => {
      const index = notebook.children(parent.id)?.indexOf(inspectorNote) || 0
      return <div>
        <Button type="link" onClick={() => onAttach(parent.id, inspectorNote.id, index - 1)}>🔼</Button>
        <Button type="link" onClick={() => onAttach(parent.id, inspectorNote.id, index + 1)}>🔽</Button>
        {parent.text} @ {index}
      </div>
    })
    inspectorDrawer = <Drawer open={true} size={'large'} title={noteParents} extra={noteToolbar} onClose={() => setInspectorNote(undefined)}>
      {parentIndexes}
      <Divider />
      <Inspector notebook={notebook} note={inspectorNote} onSelect={onSelect} />
    </Drawer>
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <header>
          <div style={{ float: 'left' }}>
            <NotebookRepository filename="welcome" notebook={notebook} onNotebookOpen={setNotebook} />
          </div>
          <div style={{ float: 'right' }}>
            <SearchSelect notebook={notebook} onSelect={onSelect} />
            <CreateNoteButton onCreate={onCreateHierarch} />
          </div>
        </header>
        <main>
          <Outline notebook={notebook} onSelect={onSelect} />
        </main>
        <aside>
          {inspectorDrawer}
        </aside>
      </App>
    </ConfigProvider>
  )
}

export default Rrrighter
