import { fromJsonObject } from "./index"; // todo: toJsonObject
import Notebook, { Note } from "./../notebook";

interface PersistableNote {
    id: string
    text: string
}

describe('JSON persistence', () => {
    const home = { text: '🏡' }
    let notebook: Notebook

    beforeEach(() => {
        notebook = new Notebook(home)
    })

    const mother: PersistableNote = { id: '1', text: 'mother' }
    const father: PersistableNote = { id: '2', text: 'father' }
    const child: PersistableNote = { id: '3', text: 'child' }
    const grandchild: PersistableNote = { id: '4', text: 'grandchild' }

    const threeLevelHierarchyWithChildrenJsonObject = {
        // Having top-level "notes" key makes it extendable in future versions
        // which may add more keys like "author", "license", "drafts", "sops", etc.
        'notes': [
            { id: '', text: '', children: ['1', '2'] },
            { id: '1', text: 'mother', children: ['3'] },
            { id: '2', text: 'father', children: ['3'] },
            { id: '3', text: 'child', children: ['4'] },
            { id: '4', text: 'grandchild' }
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
        test('Converts empty JSON object to empty notebook', () => {
            const notebook = fromJsonObject({ notes: [] })
            expect(Array.from(notebook.notes())).toStrictEqual([{ id: '', text: '' }])
        })

        // test('Converts JSON object with children to hierarchical notebook', () => {
        //     notebook = fromJsonObject(threeLevelHierarchyWithChildrenJsonObject)
        //     expect(toJsonObject(notebook)).toStrictEqual(threeLevelHierarchyWithChildrenJsonObject)
        // })
    })
})
