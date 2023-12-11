import { fromJsonObject } from "./index"; // todo: toJsonObject
import Notebook, { Note } from "./../notebook";

interface PersistableNote {
    id: string
    text: string
}

describe('JSON persistence', () => {
    const home = { text: '🏡 Home' }
    let notebook: Notebook

    beforeEach(() => {
        notebook = new Notebook(home)
    })

    const mother: Note = { text: 'mother' }
    const father: Note = { text: 'father' }
    const child: Note = { text: 'child' }
    const grandchild: Note = { text: 'grandchild' }

    const threeLevelHierarchyWithChildrenJsonObject = {
        // Having top-level "notes" key makes it extendable in future versions
        // which may add more keys like "author", "license", "drafts", "sops", etc.
        'notes': [
            { id: '', text: home.text, children: ['1', '2'] },
            { id: '1', text: mother.text, children: ['3'] },
            { id: '2', text: father.text, children: ['3'] },
            { id: '3', text: child.text, children: ['4'] },
            { id: '4', text: grandchild.text }
        ]
    }

    // describe('.toJsonObject()', () => {
    //     test('Converts empty notebook to JSON object', () => {
    //         expect(toJsonObject(notebook)).toStrictEqual({ notes: [{ id: '', text: ''}] })
    //     })
    //
    //     test('Converts hierarchical notebook to JSON object', () => {
    //         notebook.relate([{ parent: notebook.home, child: mother }])
    //         notebook.relate([{ parent: notebook.home, child: father }])
    //         notebook.relate([{ parent: notebook.home, child: child }])
    //         notebook.relate([{ parent: notebook.home, child: grandchild }])
    //         notebook.relate([{ parent: mother, child }])
    //         notebook.relate([{ parent: father, child }])
    //         notebook.relate([{ parent: child, child: grandchild }])
    //         expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
    //     })
    //
    //     // TODO tests for notebook mutations
    // })

    describe('.fromJsonObject()', () => {
        test('When notes array is empty, returns notebook with blank home note', () => {
            const notebook = fromJsonObject({ notes: [] })
            expect(Array.from(notebook.notes())).toStrictEqual([{ text: '' }])
        })

        test('Converts JSON object with children to hierarchical notebook', () => {
            notebook = fromJsonObject(threeLevelHierarchyWithChildrenJsonObject)
            expect(notebook.relationships()).toStrictEqual(new Set([
                { parent: home, child: mother, childIndex: 0 },
                { parent: home, child: father, childIndex: 1 },
                { parent: mother, child: child, childIndex: 0 },
                { parent: father, child: child, childIndex: 0 },
                { parent: child, child: grandchild, childIndex: 0 },
            ]))
        })
    })
})
