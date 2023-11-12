import { fromJsonObject } from './lib/rrrighter/src/json-persistence'
import Note from './lib/rrrighter/src/note'
import Notebook from './lib/rrrighter/src/notebook'
import React, {ReactElement, useState} from 'react'
import {App, ConfigProvider, theme, Space, Button, Drawer, Input} from 'antd'
import {HomeOutlined, PlusOutlined} from '@ant-design/icons'
import CreateNote from './components/notes/create-note'
import Outline from './components/notebook/outline/outline'
import Inspector from './components/notes/inspector'
import NotebookRepository from './components/notebook/repository/notebook-repository'
import welcome from './welcome.json'
import SearchSelect from './components/notebook/search/search-select'
import './rrrighter.css'
import Prompt from "./components/prompt/prompt";
import NoteActions from "./components/notes/note-actions";

const { TextArea } = Input
const initialNotebook = new Notebook(fromJsonObject(welcome))

type PromptProps = {
  title: string,
  children: ReactElement,
  onDismiss: Function
}

function Rrrighter() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook)
  const [newNoteParentId, setNewNoteParentId] = useState<string | undefined>(undefined)
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [inspectorNote, setInspectorNote] = useState<Note | undefined>(undefined)
  const [editorText, setEditorText] = useState<string | undefined>(undefined)
  const [prompt, setPrompt] = useState<PromptProps | undefined>(undefined)

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

  const onEdit = (note: Note) => {
    setEditorText(note.text)
  }

  const onInspect = (id: string) => {
    setInspectorNote(notebook.get(id))
  }

  const onPromptDismiss = () => {
    setPrompt(undefined)
  }

  const onNoteAction = (noteId: string, action: string) => {
    console.log(`action ${noteId}: ${action}`)
    notebook.delete(noteId)
    setPrompt(undefined)
  }

  const onSecondaryAction = (id: string) => {
    setPrompt({
        onDismiss: onPromptDismiss,
        title: 'Note actions',
        children: <NoteActions note={notebook.get(id)!} onAction={(action: string) => onNoteAction(id, action)} />
    })
  }

  let inspectorDrawer = <></>
  if (inspectorNote) {
    inspectorDrawer = <Drawer size={'large'} open={true} onClose={() => setInspectorNote(undefined)}>
      <Inspector
          notebook={notebook}
          note={inspectorNote}
          onEdit={onEdit}
          onDelete={onDeleteFromInspector}
          onDetach={onDetach}
          onAttach={onAttach}
          onCreateChild={onCreateChild}
          onInspect={onInspect}
      />
    </Drawer>
  }

  const promptComponent = prompt ? <Prompt title={prompt.title} onDismiss={prompt.onDismiss}>{prompt.children}</Prompt> : <></>

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
        {promptComponent}

        <Drawer zIndex={3000} open={!!editorText} size={'large'} onClose={onEditorClose} extra={
          <Space>
            <Button onClick={onEditorClose}>Cancel</Button>
            <Button type="primary" onClick={onEditorSave}>Save</Button>
          </Space>
        }>
          <TextArea style={{ height: '100%' }} rows={10} value={editorText} onChange={onEditorTextChange} />
        </Drawer>
        <header>
          <div style={{ float: 'left' }}>
            <NotebookRepository filename="welcome" notebook={notebook} onNotebookOpen={setNotebook} />
            <Button type="text" icon={<HomeOutlined />} size="small" aria-label="Home" title="Home" onClick={() => setInspectorNote(undefined)} />
          </div>

          <div style={{ float: 'right' }}>
            <SearchSelect notebook={notebook} onSelect={onInspect} />
            <Button type='text' icon={<PlusOutlined />} onClick={showCreateNote}  aria-label="Add note" title="Add note" />
            {newNote && <CreateNote note={newNote} onCancel={hideCreateNote} onCreate={onCreate} />}
          </div>
        </header>
        <main>
          <Outline notebook={notebook} onPrimaryAction={onInspect} onSecondaryAction={onSecondaryAction} />
          {inspectorDrawer}
        </main>
      </App>
    </ConfigProvider>
  )
}

export default Rrrighter
