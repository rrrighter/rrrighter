import Note from "./note"

describe('Note', () => {
    const text = 'Title\nContent'
    const note: Note = { id: '1', text}

    test('Has id', () => {
        expect(note.id).toBe('1')
    })

    test('Has text', () => {
        expect(note.text).toBe(text)
    })
})
