import Note from "./../note";
import { fromJsonObject, toJsonObject } from "./index";
import Notebook from "./../notebook";

describe('JSON persistence', () => {
    let notebook: Notebook

    beforeEach(() => {
        notebook = new Notebook()
    })

    const grandparent: Note = { id: '1', text: 'grandparent' }
    const parent: Note = { id: '2', text: 'parent' }
    const child: Note = { id: '3', text: 'child' }

    const threeLevelHierarchyWithParentsJsonObject = {
        // Having top-level "notes" key makes it extendable in future versions
        // which may add more keys like "author", "license", "drafts", "sops", etc.
        //
        // Storing notes' parents instead of children
        // makes it harder to confuse the structure with a tree.
        // It clearly shows that nodes may have multiple parents.
        //
        // It also makes it easier to edit notebook manually
        // (e.g. to move a note to another parent).
        'notes': {
            '1': { text: 'grandparent' },
            '2': { text: 'parent', parents: ['1'] },
            '3': { text: 'child', parents: ['2'] }
        }
    }

    const threeLevelHierarchyWithChildrenJsonObject = {
        // Having top-level "notes" key makes it extendable in future versions
        // which may add more keys like "author", "license", "drafts", "sops", etc.
        //
        // Storing notes' parents instead of children
        // makes it harder to confuse the structure with a tree.
        // It clearly shows that nodes may have multiple parents.
        //
        // It also makes it easier to edit notebook manually
        // (e.g. to move a note to another parent).
        'notes': {
            '1': { text: 'grandparent', children: ['2'] },
            '2': { text: 'parent', children: ['3'] },
            '3': { text: 'child' }
        }
    }

    describe('.toJsonObject()', () => {
        test('Converts empty notebook to JSON object', () => {
            expect(toJsonObject(notebook)).toStrictEqual({ notes: {} })
        })

        test('Converts hierarchical notebook to JSON object', () => {
            notebook.upsert(grandparent)
            notebook.upsert(parent)
            notebook.upsert(child)
            notebook.attach(grandparent.id, parent.id)
            notebook.attach(parent.id, child.id)
            expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        })

        // TODO tests for notebook mutations
    })

    describe('.fromJsonObject()', () => {
        test('Converts empty JSON object to empty notebook', () => {
            const notebook = fromJsonObject({ notes: {} })
            expect(Array.from(notebook.notes())).toStrictEqual([])
        })

        test('Converts JSON object with parents to hierarchical notebook', () => {
            notebook = fromJsonObject(threeLevelHierarchyWithParentsJsonObject)
            expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        })

        test('Converts JSON object with children to hierarchical notebook', () => {
            notebook = fromJsonObject(threeLevelHierarchyWithChildrenJsonObject)
            expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        })
    })
})
