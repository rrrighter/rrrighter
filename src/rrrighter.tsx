import { fromJsonObject } from './lib/rrrighter/src/json-persistence'
import Note from './lib/rrrighter/src/note'
import Notebook from './lib/rrrighter/src/notebook'
import React, {useState} from 'react'
import {App, ConfigProvider, theme, Button, Drawer} from 'antd'
import {HomeOutlined} from '@ant-design/icons'
import UpdateNote from './components/notes/update-note'
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
  const [editNote, setEditNote] = useState<Note | undefined>(undefined)

  const hideNoteEditor = () => {
    setEditNote(undefined)
  }

  const onEditSave = (note: Note) => {
    notebook.upsert(note)
    setInspectorNote({ id: note.id, text: note.text })
    hideNoteEditor()

    setNotebook(new Notebook(notebook))
  }

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

  const onAttach = (parentId: string, childId: string) => {
    notebook.descendants(parentId)?.forEach((descendant) => notebook.detach(descendant.id, childId))
    notebook.ancestors(parentId)?.forEach((ancestor) => notebook.detach(ancestor.id, childId))
    console.log(notebook.attach(parentId, childId))

    setNotebook(new Notebook(notebook))
  }

  const onEdit = (note: Note) => {
    setEditNote(note)
  }

  const onSelect = (id: string) => {
    setInspectorNote(notebook.get(id))
  }

  const onCreateHierarchNote = (text: string) => {
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
    const noteParents = <Parents notebook={notebook} note={inspectorNote} onDetach={onDetach} onSelect={onSelect} />
    const noteToolbar = <NoteToolbar
        notebook={notebook}
        noteId={inspectorNote.id}
        onEdit={() => onEdit(inspectorNote)}
        onCreateChild={onCreateChild}
        onAttach={onAttach}
        onDelete={() => onDelete(inspectorNote)}
    />
    inspectorDrawer = <Drawer open={true} size={'large'} title={noteParents} extra={noteToolbar} onClose={() => setInspectorNote(undefined)}>
      <Inspector notebook={notebook} note={inspectorNote} onEdit={onEdit} onSelect={onSelect} />
    </Drawer>
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <header>
          <div style={{ float: 'left' }}>
            <NotebookRepository filename="welcome" notebook={notebook} onNotebookOpen={setNotebook} />
            <Button type="text" icon={<HomeOutlined />} size="small" aria-label="Home" title="Home" onClick={() => setInspectorNote(undefined)} />
          </div>
          <div style={{ float: 'right' }}>
            <SearchSelect notebook={notebook} onSelect={onSelect} />
            <CreateNoteButton onCreate={onCreateHierarchNote} />
          </div>
        </header>
        <main>
          <Outline notebook={notebook} onSelect={onSelect} />
        </main>
        <aside>
          {inspectorDrawer}
          {editNote && <UpdateNote note={editNote} onClose={hideNoteEditor} onSave={onEditSave} />}
        </aside>
      </App>
    </ConfigProvider>
  )
}

export default Rrrighter
