import { fromJsonObjectLiteral } from "./lib/rrrighter/src/json-repository";
import Notebook, { Note } from "./lib/rrrighter/src/notebook";
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
  const [inspectorNote, setInspectorNote] = useState<Note | undefined>(
    undefined,
  );

  const onDelete = (child: Note) => {
    if (notebook.descendants(child)?.size) {
      alert("Cannot delete note with children. Delete the children first."); // todo: implement wizard drawer OR batch actions with descendats
    } else {
      notebook
        .parents(child)
        ?.forEach((parent) => notebook.unrelate({ parent, child }));
      setInspectorNote(undefined);
      setNotebook(new Notebook(notebook));
    }
  };

  const onDetach = (parent: Note, child: Note) => {
    notebook.unrelate({ parent, child });

    setNotebook(new Notebook(notebook));
  };

  const onAttach = (parent: Note, child: Note, childIndex?: number) => {
    notebook.relate([{ parent, child, childIndex }]);
    setNotebook(new Notebook(notebook));
  };

  const onSelect = (note: Note) => {
    setInspectorNote(note);
  };

  const onCreateHierarch = (text: string) => {
    notebook.relate([{ parent: notebook.home, child: { text } }]);
    setNotebook(new Notebook(notebook));
  };

  let inspectorDrawer = <></>; // todo extract into InspectorDrawer component (notebook, note, actions..) & onNoteAction(inspectorNote.id, action)
  if (inspectorNote) {
    const onCreateChild = (text: string) => {
      notebook.relate([{ parent: inspectorNote, child: { text } }]);
      setNotebook(new Notebook(notebook));
    };

    const onEdit = (text: string) => {
      inspectorNote.text = text;
      setNotebook(new Notebook(notebook));
      setInspectorNote(inspectorNote);
    };

    const noteParents = (
      <Parents
        notebook={notebook}
        note={inspectorNote}
        onDetach={readonly ? undefined : onDetach}
        onSelect={onSelect}
      />
    );
    const noteToolbar = (
      <NoteToolbar
        notebook={notebook}
        note={inspectorNote}
        onEdit={onEdit}
        onCreateChild={onCreateChild}
        onAttach={onAttach}
        onDelete={() => onDelete(inspectorNote)}
      />
    );
    const parents = Array.from(notebook.parents(inspectorNote) || []);
    const parentIndexes: ReactNode[] = parents.map((parent): ReactNode => {
      const index = notebook.children(parent)?.indexOf(inspectorNote) || 0;
      return (
        <div>
          <Button
            type="link"
            onClick={() => onAttach(parent, inspectorNote, index - 1)}
          >
            🔼
          </Button>
          <Button
            type="link"
            onClick={() => onAttach(parent, inspectorNote, index + 1)}
          >
            🔽
          </Button>
          {parent.text} @ {index}
        </div>
      );
    });
    inspectorDrawer = (
      <Drawer
        open={true}
        size={"large"}
        title={noteParents}
        extra={!readonly && noteToolbar}
        onClose={() => setInspectorNote(undefined)}
      >
        {!readonly && parentIndexes}
        <Inspector
          notebook={notebook}
          note={inspectorNote}
          onSelect={onSelect}
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
            <SearchSelect notebook={notebook} onSelect={onSelect} />
            {!readonly && <CreateNoteButton onCreate={onCreateHierarch} />}
          </div>
        </header>
        <main>
          <Outline notebook={notebook} onSelect={onSelect} />
        </main>
        <aside>{inspectorDrawer}</aside>
      </App>
    </ConfigProvider>
  );
}

export default Rrrighter;
