import { fromJsonObject } from './lib/rrrighter/src/json-persistence'
import './App.css'
import Note from './lib/rrrighter/src/note'
import Notebook from './lib/rrrighter/src/notebook'
import React, { useState } from 'react'
import { App, ConfigProvider, theme, Space, Button, Drawer, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CreateNote from './components/notes/create-note'
import TreeTable from './components/notebook/tree-table/tree-table'
import Inspector from './components/notes/inspector'
import NotebookRepository from './components/notebook/repository/notebook-repository'
import welcome from './welcome.json'

const { TextArea } = Input
const initialNotebook = new Notebook(fromJsonObject(welcome))

function MyApp() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook)
  const [newNoteParentId, setNewNoteParentId] = useState<string | undefined>(undefined)
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [inspectorNote, setInspectorNote] = useState<Note | undefined>(undefined)
  const [editorText, setEditorText] = useState<string | undefined>(undefined)

  const showCreateNote = () => {
    setNewNoteParentId(undefined)
    // eslint-disable-next-line no-restricted-globals
    setNewNote({ id: self.crypto.randomUUID(), text: '' })
  }

  const hideCreateNote = () => {
    setNewNote(undefined)
  }

  const onCreate = (newNote: Note) => {
    notebook.upsert(newNote)
    if (newNoteParentId) {
        notebook.attach(newNoteParentId, newNote.id)
    }
    setNotebook(new Notebook(notebook))
    setInspectorNote(newNote)
    hideCreateNote()
  }

  const onDeleteFromInspector = (note: Note) => {
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

  const onAttach = (parent: Note, child: Note) => {
    notebook.descendants(parent.id)?.forEach((descendant) => notebook.detach(descendant.id, child.id))
    notebook.ancestors(parent.id)?.forEach((ancestor) => notebook.detach(ancestor.id, child.id))
    notebook.attach(parent.id, child.id)

    setNotebook(new Notebook(notebook))
  }

  const onCreateChild = (parentId: string) => {
    setNewNoteParentId(parentId)
    // eslint-disable-next-line no-restricted-globals
    setNewNote({ id: self.crypto.randomUUID(), text: '' })
  }

  const onEdit = (note: Note) => {
    setEditorText(note.text)
  }

  let inspectorPanel
  if (inspectorNote) {
    inspectorPanel =
      <Inspector
          notebook={notebook}
          note={inspectorNote}
          onEdit={onEdit}
          onDelete={onDeleteFromInspector}
          onDetach={onDetach}
          onAttach={onAttach}
          onCreateChild={onCreateChild}
      />
  } else {
    inspectorPanel = <span>Select note to inspect</span>
  }

  const onEditorClose = () => {
    setEditorText(undefined)
  }

  const onEditorTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorText(event.target.value)
  }

  const onEditorSave = () => {
    if (inspectorNote) {
      notebook.upsert({ id: inspectorNote.id, text: editorText || '' })
    }
    setEditorText(undefined)
    setNotebook(new Notebook(notebook))
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <div className='viewport'>
          <Drawer open={!!editorText} size={'large'} onClose={onEditorClose} extra={
            <Space>
              <Button onClick={onEditorClose}>Cancel</Button>
              <Button type="primary" onClick={onEditorSave}>Save</Button>
            </Space>
          }>
            <TextArea style={{ height: '100%' }} rows={10} value={editorText} onChange={onEditorTextChange} />
          </Drawer>
          <div className='header'>
            <div style={{ float: 'left' }}>
              <NotebookRepository filename="welcome" notebook={notebook} onNotebookOpen={setNotebook} />
            </div>
            <div style={{ float: 'right' }}>
              <Button type='text' icon={<PlusOutlined />} onClick={showCreateNote}  aria-label="Add note" title="Add note" />
              {newNote && <CreateNote note={newNote} onCancel={hideCreateNote} onCreate={onCreate} />}
            </div>
          </div>
          <div className='panels'>
            <div className='navigator'><TreeTable notebook={notebook} onSelect={setInspectorNote} /></div>
            <div className='inspector'>{inspectorPanel}</div>
          </div>
        </div>
      </App>
    </ConfigProvider>
  )
}

export default MyApp
