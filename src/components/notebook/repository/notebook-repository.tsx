import React, { useState } from "react";
import { Badge, Button, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Notebook from "../../../lib/rrrighter/src/notebook";
import {
  convertToUUIDs,
  fromJsonObjectLiteral,
  toJsonObjectLiteral,
} from "../../../lib/rrrighter/src/json-repository";
import { fileOpen, fileSave } from "browser-fs-access";
import type { MenuProps } from "antd";

export default function NotebookRepository(props: {
  filename: string;
  notebook: Notebook;
  onNotebookOpen: Function;
}) {
  const onOpen = async () => {
    const fileWithHandle = await fileOpen({
      description: "Rrrighter notebook",
      extensions: [".rrrighter"],
    });
    const originalNotebook = new Notebook(
      fromJsonObjectLiteral(JSON.parse(await fileWithHandle.text())),
    );
    const openedNotebook = convertToUUIDs(originalNotebook);
    setFileName(fileWithHandle.name);
    setFileHandle(fileWithHandle.handle || null);
    setSavedNotebook(openedNotebook);
    props.onNotebookOpen(openedNotebook);
  };

  const onSave = async () => {
    const json = JSON.stringify(
      toJsonObjectLiteral(props.notebook),
      null,
      "  ",
    );
    const blob = new Blob([json]);
    await fileSave(blob, { fileName, extensions: [".rrrighter"] }, fileHandle);
    setSavedNotebook(props.notebook);
  };

  const [savedNotebook, setSavedNotebook] = useState<Notebook>(props.notebook);
  const [fileName, setFileName] = useState<string>(props.filename);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null,
  );
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(false);

  const isSaved = savedNotebook === props.notebook;
  if (isAutoSaveEnabled && !isSaved) {
    onSave().then();
  }

  const items: MenuProps["items"] = [
    {
      key: "open",
      label: "Open",
      onClick: onOpen,
    },
    {
      type: "divider",
    },
    {
      key: "persist",
      label: isSaved ? "Saved" : "Save",
      disabled: isSaved,
      onClick: onSave,
    },
    {
      key: "toggleAutoSave",
      label: isAutoSaveEnabled ? "Disable AutoSave" : "Enable AutoSave",
      onClick: () => setIsAutoSaveEnabled(!isAutoSaveEnabled),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button type="text">
        <Space>
          {fileName.split(".rrrighter")[0]}
          <Badge
            status="default"
            style={{ visibility: isSaved ? "hidden" : "visible" }}
          />
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
