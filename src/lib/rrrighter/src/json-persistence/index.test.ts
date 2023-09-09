import Note from "./../note";
import { fromJsonObject, toJsonObject } from "./index";
import Notebook from "./../notebook";

describe('JSON persistence', () => {
    let notebook: Notebook

    beforeEach(() => {
        notebook = new Notebook()
    })

    const mother: Note = { id: '1', text: 'mother' }
    const father: Note = { id: '2', text: 'father' }
    const child: Note = { id: '3', text: 'child' }
    const grandchild: Note = { id: '4', text: 'grandchild' }

    const threeLevelHierarchyWithChildrenJsonObject = {
        // Having top-level "notes" key makes it extendable in future versions
        // which may add more keys like "author", "license", "drafts", "sops", etc.
        'notes': [
            { id: '1', text: 'mother', children: ['3'] },
            { id: '2', text: 'father', children: ['3'] },
            { id: '3', text: 'child', children: ['4'] },
            { id: '4', text: 'grandchild' }
        ]
    }

    describe('.toJsonObject()', () => {
        test('Converts empty notebook to JSON object', () => {
            expect(toJsonObject(notebook)).toStrictEqual({ notes: [] })
        })

        test('Converts hierarchical notebook to JSON object', () => {
            notebook.upsert(mother)
            notebook.upsert(father)
            notebook.upsert(child)
            notebook.upsert(grandchild)
            notebook.attach(mother.id, child.id)
            notebook.attach(father.id, child.id)
            notebook.attach(child.id, grandchild.id)
            expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        })

        // TODO tests for notebook mutations
    })

    describe('.fromJsonObject()', () => {
        test('Converts empty JSON object to empty notebook', () => {
            const notebook = fromJsonObject({ notes: [] })
            expect(Array.from(notebook.notes())).toStrictEqual([])
        })

        test('Converts JSON object with children to hierarchical notebook', () => {
            notebook = fromJsonObject(threeLevelHierarchyWithChildrenJsonObject)
            expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        })
    })
})
