import { fromJsonObjectLiteral } from "./lib/rrrighter/src/json-repository";
import Notebook, { NoteId } from "./lib/rrrighter/src/notebook";
import React, { useState } from "react";
import { App, ConfigProvider, theme } from "antd";
import Outline from "./components/notebook/views/outline/outline";
import Repository from "./components/repository/repository";
import help from "./help.json";
import SearchSelect from "./components/notebook/search/search-select";
import "./rrrighter.css";
import NoteToolbar from "./components/notes/note-toolbar";
import Parents from "./components/notes/parents";
import { HomeOutlined, AimOutlined, EyeOutlined } from "@ant-design/icons";
// TODO: use AimOutlined for focus action
import NoteButton from "./components/notes/note-button";

type Path = NoteId[];

const urlParams = new URLSearchParams(window.location.search);
const urlRepository = urlParams.get("repository");
const readonly = !!urlRepository;

const fetch = async (url: string) => {
  const response = await window.fetch(url);
  return await response.text();
};

const fetchJsonObjectLiteral = async (url: string) => {
  return JSON.parse(await fetch(url));
};

const sourceJSON = urlRepository ? await fetchJsonObjectLiteral(urlRepository) : help;
const initialNotebook = fromJsonObjectLiteral(sourceJSON);

function Rrrighter() {
  const [notebook, setNotebook] = useState<Notebook>(initialNotebook);
  const [path, setPath] = useState<NoteId[]>([notebook.homeId()]);
  const [selectedPath, setSelectedPath] = useState<NoteId[]>([
    notebook.homeId(),
  ]);

  const selectedNoteId = selectedPath[selectedPath.length - 1];
  const selectedNoteParentId = selectedPath[selectedPath.length - 2];
  const selectedNoteIndex =
    selectedNoteParentId && selectedNoteId
      ? notebook.children(selectedNoteParentId)?.indexOf(selectedNoteId)
      : undefined;

  const onNotebookOpen = (notebook: Notebook) => {
    setNotebook(notebook);
    setSelectedPath([notebook.homeId()]);
  };

  const onDelete = (id: NoteId) => {
    if (notebook.descendants(id)?.size) {
      // todo: move inside toolbar or delete button component
      alert("Cannot delete note with children. Delete the children first."); // todo: implement wizard drawer OR batch actions with descendants
    } else {
      notebook
        .parents(id)
        ?.forEach((parent) => notebook.unrelate({ parent, child: id }));
      setNotebook(new Notebook(notebook));
    }
  };

  const onDetach = ({
    parentId,
    childId,
  }: {
    parentId: NoteId;
    childId: NoteId;
  }) => {
    if (notebook.parents(childId)?.size === 1) {
      alert("Note must have at least one parent.");
    } else {
      notebook.unrelate({ parent: parentId, child: childId });
    }
    setNotebook(new Notebook(notebook));
  };

  const onAttach = (parentId: NoteId, childId: NoteId, childIndex?: number) => {
    notebook.relate([{ parent: parentId, child: childId, childIndex }]);
    setNotebook(new Notebook(notebook));
  };

  const newNoteId = (): NoteId => {
    // eslint-disable-next-line no-restricted-globals
    return self.crypto.randomUUID();
  };

  const onCreateNote = (text: string) => {
    const noteId = newNoteId();
    notebook.relate([{ parent: selectedNoteId as NoteId, child: noteId }]);
    notebook.set(noteId, text);
    setNotebook(new Notebook(notebook));
  };

  const onSelect = (path: NoteId[]) => {
    if (readonly) {
      zoomNote(path[path.length - 1]);
    } else {
      setSelectedPath(path);
    }
  };

  const raise = () => {
    onAttach(
      selectedNoteParentId as NoteId,
      selectedNoteId as NoteId,
      (selectedNoteIndex as number) - 1,
    );
  };

  const lower = () => {
    onAttach(
      selectedNoteParentId as NoteId,
      selectedNoteId as NoteId,
      (selectedNoteIndex as number) + 1,
    );
  };

  const outdent = () => {
    if (selectedPath.length > 1) {
      // TODO: OOH method / Notebook method to replace parent (with grandparent)
      // const grandparentId = selectedPath[selectedPath.length - 2];
      // const tmpId = newNoteId();
      // debugger;
      // notebook.relate([{ parent: notebook.homeId(), child: tmpId }]);
      // notebook.relate([{ parent: tmpId, child: selectedNoteId as NoteId }]);
      // notebook.set(tmpId, 'tmp');
      // // notebook.unrelate({ parent: selectedNoteParentId, child: selectedNoteId });
      // // notebook.relate([{ parent: grandparentId, child: selectedNoteId }]);
      // // notebook.unrelate({ parent: tmpId, child: selectedNoteId });
      // setNotebook(new Notebook(notebook));
    }
  }

  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    console.log("onKeyDown:", e.key);

    const onAction = (action: Function) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };

    if (e.metaKey) {
      if (e.key === "Backspace") {
        // todo delete
        // onAction(() => {
        //   onDelete(selectedNoteId as string);
        //   setSelectedNoteId(notebook.children()[selectedNoteIndex as number]);
        // });
      }
    } else if (e.altKey) {
      if (e.key === "ArrowUp") {
        onAction(raise);
      } else if (e.key === "ArrowDown") {
        onAction(lower);
      } else if (e.key === "ArrowLeft") {
        onAction(outdent);
      }
      // todo ArrowLeft -> onOutdent
      // todo ArrowRight -> onIndent
    }
  };

  const onSelectedNoteEdit = (text: string) => {
    notebook.set(selectedNoteId as string, text);
    setNotebook(new Notebook(notebook));
  };

  const onMainFocusClick = () => {
    (document.querySelector(".ant-tree input") as HTMLElement)?.focus();
  };

  const zoomNote = (noteId: NoteId) => {
    setPath([noteId])
    setSelectedPath([noteId])
  }

  // TODO: <ScopeFramedContainer (focus or intersection)><Outline /></Focus>

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App>
        <header>
          <div style={{ float: "left" }}>
            {!readonly && (
              <Repository
                filename="welcome"
                notebook={notebook}
                onNotebookOpen={onNotebookOpen}
              />
            )}
            {!readonly && selectedNoteId && notebook.get(selectedNoteId) && (
              <>
                {(!notebook.parents(selectedNoteId)?.has(notebook.homeId())) && (<NoteButton
                    notebook={notebook}
                    noteId={notebook.homeId()}
                    icon={<HomeOutlined />}
                    onClick={zoomNote}
                />)}
                {/*{(selectedPath[0] !== notebook.homeId()) && (<NoteButton*/}
                {/*    notebook={notebook}*/}
                {/*    noteId={selectedPath[0]}*/}
                {/*    icon={<CompressOutlined />}*/}
                {/*    onClick={zoomNote}*/}
                {/*/>)}*/}
                <Parents
                  notebook={notebook}
                  noteId={selectedNoteId}
                  onClick={zoomNote}
                  onDetach={readonly ? undefined : onDetach}
                />
                {selectedNoteId !== notebook.homeId() && (<NoteButton
                  notebook={notebook}
                  noteId={selectedNoteId}
                  icon={<EyeOutlined />}
                  onClick={zoomNote}
                />)}
                {selectedNoteId && (
                  <NoteToolbar
                    notebook={notebook}
                    noteId={selectedNoteId}
                    onEdit={onSelectedNoteEdit}
                    onCreate={onCreateNote}
                    onAttach={onAttach}
                    onDelete={() => onDelete(selectedNoteId)}
                  />
                )}
              </>
            )}
          </div>
          <div style={{ float: "right" }}>
            <SearchSelect notebook={notebook} onSelect={zoomNote} />
          </div>
        </header>
        <main
          tabIndex={-1}
          onClick={onMainFocusClick}
          onFocus={onMainFocusClick}
          onKeyDownCapture={onKeyDownCapture}
        >
          <Outline
            notebook={notebook}
            path={path}
            selected={new Set<Path>(selectedPath ? [selectedPath] : [])}
            onSelect={onSelect}
          />
        </main>
        <aside></aside>
        <footer>{/* TODO: consider breadcrumbs here like in Finder */}</footer>
      </App>
    </ConfigProvider>
  );
}

export default Rrrighter;
