import React, { useState } from 'react'
import {Button, Dropdown, MenuProps, Switch, Typography} from 'antd'
import {PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined, EditOutlined, FolderOpenOutlined, SaveOutlined} from '@ant-design/icons'
import Notebook from '../../../lib/rrrighter/src/notebook'
import { fromJsonObject, toJsonObject } from '../../../lib/rrrighter/src/json-persistence'
import { fileOpen, fileSave, supported } from 'browser-fs-access';

const { Text } = Typography;

export default function NotebookRepository(props: { filename: string, notebook: Notebook, onNotebookOpen: Function }) {
  const onOpen = async () => {
    const fileWithHandle = await fileOpen({ description: 'Rrrighter notebook', extensions: ['.rrrighter'] })
    const openedNotebook = new Notebook(fromJsonObject(JSON.parse(await fileWithHandle.text())))
    setFileName(fileWithHandle.name)
    setFileHandle(fileWithHandle.handle || null)
    setSavedNotebook(openedNotebook)
    props.onNotebookOpen(openedNotebook)
  }

  const onSave = async () => {
    const json = JSON.stringify(toJsonObject(props.notebook), null, '  ')
    const blob = new Blob([json])
    await fileSave(blob, { fileName, extensions: ['.rrrighter'] }, fileHandle)
    setSavedNotebook(props.notebook)
  }

  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled)
  }

  const saveIcon = supported ? <SaveOutlined/> : <DownloadOutlined/>

  const [savedNotebook, setSavedNotebook] = useState<Notebook>(props.notebook)
  const [fileName, setFileName] = useState<string>(props.filename)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(false)

  const isSaved = savedNotebook === props.notebook
  if (isAutoSaveEnabled && !isSaved) {
    onSave().then()
  }

  return <div>
    <div style={{ float: 'left' }}><Button type="text" icon={<FolderOpenOutlined/>} aria-label="Open" title="Open" onClick={onOpen} /></div>
    <div style={{ float: 'left' }}>
      <Button disabled={isSaved} type="text" icon={saveIcon} aria-label="Save" title="Save" onClick={onSave} />
      <Text>{fileName.split('.rrrighter')[0]}</Text>
      &nbsp;<Switch size="small" checked={isAutoSaveEnabled} onChange={setIsAutoSaveEnabled} /> AutoSave
    </div>
  </div>
}
