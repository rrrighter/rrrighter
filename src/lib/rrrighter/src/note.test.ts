describe('Note', () => {
    test('Has string text', () => {
        const note = { text: '' }
        expect(note.text).toStrictEqual('')
    })
})
