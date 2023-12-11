import { fromJsonObjectLiteral } from "./index"; // todo: toJsonObjectLiteral
import Notebook, { Note } from "./../notebook";

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
            { id: '', text: home.text, children: ['0', '1'] },
            { id: '0', text: mother.text, children: ['2'] },
            { id: '1', text: father.text, children: ['2'] },
            { id: '2', text: child.text, children: ['3'] },
            { id: '3', text: grandchild.text }
        ]
    }

    describe('.fromJsonObjectLiteral()', () => {
        test('When notes array is empty, notebook home note is blank', () => {
            const notebook = fromJsonObjectLiteral({ notes: [] })
            expect(Array.from(notebook.notes())).toStrictEqual([{ text: '' }])
        })

        test('Returns notebook', () => {
            notebook = fromJsonObjectLiteral(threeLevelHierarchyWithChildrenJsonObject)
            expect(notebook.relationships()).toStrictEqual(new Set([
                { parent: home, child: mother, childIndex: 0 },
                { parent: home, child: father, childIndex: 1 },
                { parent: mother, child: child, childIndex: 0 },
                { parent: father, child: child, childIndex: 0 },
                { parent: child, child: grandchild, childIndex: 0 },
            ]))
        })
    })

    // todo: case with empty string as valid id with default implementation
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
})
