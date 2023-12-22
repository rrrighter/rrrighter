import { fromJsonObjectLiteral } from "./lib/rrrighter/src/json-repository";
import Notebook, { NoteId } from "./lib/rrrighter/src/notebook";
import React, { ReactNode, useState } from "react";
import { App, ConfigProvider, theme, Drawer, Button } from "antd";
import Outline from "./components/notebook/outline/outline";
import Inspector from "./components/notes/inspector";
import NotebookRepository from "./components/notebook/repository/notebook-repository";
import help from "./help.json";
import SearchSelect from "./components/notebook/search/search-select";
import "./rrrighter.css";
import NoteToolbar from "./components/notes/note-toolbar";
import Parents from "./components/notes/parents";
import CreateNoteButton from "./components/notes/create-note-button";

const urlParams = new URLSearchParams(window.location.search);
const repository = urlParams.get("repository");
const readonly = !!repository;

const fetch = async (url: string) => {
  const response = await window.fetch(url);
  return await response.text();
};

const fetchJsonObjectLiteral = async (url: string) => {
  return JSON.parse(await fetch(url));
};

const sourceJSON = repository ? await fetchJsonObjectLiteral(repository) : help;
const initialNotebook = fromJsonObjectLiteral(sourceJSON);

function Rrrighter() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook);
  const [inspectorNoteId, setInspectorNoteId] = useState<NoteId | undefined>(
    undefined,
  );

  const onDelete = (id: NoteId) => {
    if (notebook.descendants(id)?.size) {
      alert("Cannot delete note with children. Delete the children first."); // todo: implement wizard drawer OR batch actions with descendants
    } else {
      notebook
        .parents(id)
        ?.forEach((parent) => notebook.unrelate({ parent, child: id }));
      setInspectorNoteId(undefined);
      setNotebook(new Notebook(notebook));
    }
  };

  const onDetach = (parentId: NoteId, childId: NoteId) => {
    if (notebook.parents(childId)?.size === 1) {
        alert("Note must have at least one parent.");
    } else {
      notebook.unrelate({ parent: parentId, child: childId });
    }
    setNotebook(new Notebook(notebook));
    setInspectorNoteId(childId)
  };

  const onAttach = (parentId: NoteId, childId: NoteId, childIndex?: number) => {
    notebook.relate([{ parent: parentId, child: childId, childIndex }]);
    setNotebook(new Notebook(notebook));
  };

  const newNoteId = (): NoteId => {
    // eslint-disable-next-line no-restricted-globals
    return self.crypto.randomUUID();
  };

  const onCreateHierarch = (text: string) => {
    const id = newNoteId();
    notebook.relate([{ parent: notebook.homeId(), child: id }]);
    notebook.set(id, text);
    setNotebook(new Notebook(notebook));
  };

  let inspectorDrawer = <></>; // todo extract into InspectorDrawer component (notebook, note, actions..) & onNoteAction(inspectorNote.id, action)
  if (inspectorNoteId) {
    const onCreateChild = (text: string) => {
      const id = newNoteId();
      notebook.relate([{ parent: inspectorNoteId, child: id }]);
      notebook.set(id, text);
      setNotebook(new Notebook(notebook));
    };

    const onEdit = (text: string) => {
      notebook.set(inspectorNoteId, text);
      setNotebook(new Notebook(notebook));
      setInspectorNoteId(inspectorNoteId);
    };

    const noteParents = (
      <Parents
        notebook={notebook}
        id={inspectorNoteId}
        onDetach={readonly ? undefined : onDetach}
        onSelect={setInspectorNoteId}
      />
    );
    const noteToolbar = (
      <NoteToolbar
        notebook={notebook}
        id={inspectorNoteId}
        onEdit={onEdit}
        onCreateChild={onCreateChild}
        onAttach={onAttach}
        onDelete={() => onDelete(inspectorNoteId)}
      />
    );
    const parents = Array.from(notebook.parents(inspectorNoteId) || []);
    const parentIndexes: ReactNode[] = parents.map((parent): ReactNode => {
      const index = notebook.children(parent)?.indexOf(inspectorNoteId) || 0;
      return (
        <div>
          <Button
            type="link"
            onClick={() => onAttach(parent, inspectorNoteId, index - 1)}
          >
            🔼
          </Button>
          <Button
            type="link"
            onClick={() => onAttach(parent, inspectorNoteId, index + 1)}
          >
            🔽
          </Button>
          {notebook.get(parent) || ""} @ {index}
        </div>
      );
    });
    inspectorDrawer = (
      <Drawer
        open={true}
        size={"large"}
        title={noteParents}
        extra={!readonly && noteToolbar}
        onClose={() => setInspectorNoteId(undefined)}
      >
        {!readonly && parentIndexes}
        <Inspector
          notebook={notebook}
          id={inspectorNoteId}
          onSelect={setInspectorNoteId}
        />
      </Drawer>
    );
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <header>
          <div style={{ float: "left" }}>
            {!readonly && (
              <NotebookRepository
                filename="welcome"
                notebook={notebook}
                onNotebookOpen={setNotebook}
              />
            )}
          </div>
          <div style={{ float: "right" }}>
            <SearchSelect notebook={notebook} onSelect={setInspectorNoteId} />
            {!readonly && <CreateNoteButton onCreate={onCreateHierarch} />}
          </div>
        </header>
        <main>
          <Outline
            notebook={notebook}
            defaultExpandedHome={true}
            onSelect={setInspectorNoteId}
          />
        </main>
        <aside>{inspectorDrawer}</aside>
      </App>
    </ConfigProvider>
  );
}

export default Rrrighter;
