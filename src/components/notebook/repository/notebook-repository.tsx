import React, { useState } from 'react'
import { Button, Typography } from 'antd'
import { DownloadOutlined, FolderOpenOutlined, SaveOutlined } from '@ant-design/icons'
import Notebook from '../../../lib/rrrighter/src/notebook'
import { fromJsonObject, toJsonObject } from '../../../lib/rrrighter/src/json-persistence'
import { fileOpen, fileSave, supported } from 'browser-fs-access';

const { Text } = Typography;

export default function NotebookRepository(props: { filename: string, notebook: Notebook, onNotebookOpen: Function }) {
  const [fileName, setFileName] = useState<string>(props.filename)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)

  const onOpen = async () => {
    const fileWithHandle = await fileOpen({ description: 'Rrrighter notebook', extensions: ['.rrrighter'] })
    const openedNotebook = new Notebook(fromJsonObject(JSON.parse(await fileWithHandle.text())))
    setFileName(fileWithHandle.name)
    setFileHandle(fileWithHandle.handle || null)
    props.onNotebookOpen(openedNotebook)
  }

  const onSave = async () => {
    const json = JSON.stringify(toJsonObject(props.notebook), null, '  ')
    const blob = new Blob([json])
    await fileSave(blob, { fileName, extensions: ['.rrrighter'] }, fileHandle)
  }

  const saveIcon = supported ? <SaveOutlined/> : <DownloadOutlined/>

  return <div>
    <div style={{ float: 'left' }}><Button type="text" icon={<FolderOpenOutlined/>} aria-label="Open" title="Open" onClick={onOpen} /></div>
    <div style={{ float: 'left' }}><Button type="text" icon={saveIcon} aria-label="Download" title="Download" onClick={onSave} /></div>
    <div style={{ float: 'left' }}><Text>{fileName.split('.rrrighter')[0]}</Text></div>
  </div>
}
