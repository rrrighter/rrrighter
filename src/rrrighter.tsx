import { fromJsonObject } from './lib/rrrighter/src/json-persistence'
import Note from './lib/rrrighter/src/note'
import Notebook from './lib/rrrighter/src/notebook'
import React, {useState} from 'react'
import {App, ConfigProvider, theme, Button, Drawer} from 'antd'
import {HomeOutlined, PlusOutlined} from '@ant-design/icons'
import UpdateNote from './components/notes/update-note'
import Outline from './components/notebook/outline/outline'
import Inspector from './components/notes/inspector'
import NotebookRepository from './components/notebook/repository/notebook-repository'
import welcome from './welcome.json'
import SearchSelect from './components/notebook/search/search-select'
import './rrrighter.css'
import NoteToolbar from "./components/notes/note-toolbar";
import Parents from "./components/notes/parents";

const initialNotebook = new Notebook(fromJsonObject(welcome))

function Rrrighter() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook)
  const [newNoteParentId, setNewNoteParentId] = useState<string | undefined>(undefined)
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [editNote, setEditNote] = useState<Note | undefined>(undefined)
  const [inspectorNote, setInspectorNote] = useState<Note | undefined>(undefined)

  const showCreateNote = () => {
    setNewNoteParentId(undefined)
    // eslint-disable-next-line no-restricted-globals
    setNewNote({ id: self.crypto.randomUUID(), text: '' })
  }

  const hideNoteEditor = () => {
    setNewNote(undefined)
    setEditNote(undefined)
  }

  const onCreateSave = (newNote: Note) => {
    notebook.upsert(newNote)
    if (newNoteParentId) {
        notebook.attach(newNoteParentId, newNote.id)
    }
    setNotebook(new Notebook(notebook))
    hideNoteEditor()
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

  const onCreateChild = (parentId: string) => {
    setNewNoteParentId(parentId)
    // eslint-disable-next-line no-restricted-globals
    setNewNote({ id: self.crypto.randomUUID(), text: '' })
  }

  const onEditSave = (note: Note) => {
    notebook.upsert(note)
    setNotebook(new Notebook(notebook))
    setInspectorNote({ id: note.id, text: note.text })
    hideNoteEditor()
  }

  const onEdit = (note: Note) => {
    setEditNote(note)
  }

  const onInspect = (id: string) => {
    setInspectorNote(notebook.get(id))
  }

  let inspectorDrawer = <></>
  if (inspectorNote) {
    const noteParents = <Parents notebook={notebook} note={inspectorNote} onDetach={onDetach} onSelect={onInspect} />
    const noteToolbar = <NoteToolbar
        notebook={notebook}
        noteId={inspectorNote.id}
        onEdit={() => onEdit(inspectorNote)}
        onCreateChild={onCreateChild}
        onAttach={onAttach}
        onDelete={() => onDelete(inspectorNote)}
    />
    inspectorDrawer = <Drawer open={true} size={'large'} title={noteParents} extra={noteToolbar} onClose={() => setInspectorNote(undefined)}>
      <Inspector notebook={notebook} note={inspectorNote} onEdit={onEdit} onInspect={onInspect} />
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
            <SearchSelect notebook={notebook} onSelect={onInspect} />
            <Button type='text' icon={<PlusOutlined />} onClick={showCreateNote}  aria-label="Add note" title="Add note" />
          </div>
        </header>
        <main>
          <Outline notebook={notebook} onSelect={onInspect} />
        </main>
        <aside>
          {inspectorDrawer}
          {newNote && <UpdateNote note={newNote} onClose={hideNoteEditor} onSave={onCreateSave} />}
          {editNote && <UpdateNote note={editNote} onClose={hideNoteEditor} onSave={onEditSave} />}
        </aside>
      </App>
    </ConfigProvider>
  )
}

export default Rrrighter
