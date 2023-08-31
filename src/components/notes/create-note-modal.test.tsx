import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateNote from "./create-note";
import userEvent from '@testing-library/user-event'

const id = Math.random().toString()
const text = Math.random().toString()
const note = { id, text }
const onCancel = jest.fn()
const onCreate = jest.fn()

const renderComponent = () => {
    render(<CreateNote note={note} onCancel={onCancel} onCreate={onCreate} />)
}

beforeEach(renderComponent)

test('Has new note indication', async () => {
    expect(screen.getByText('New note')).toBeInTheDocument()
})

test('Shows note text', async () => {
    expect(await screen.findByText(text)).toBeInTheDocument()
})

test('Clicking Cancel triggers onCancel', async () => {
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toBeCalled()
})

test('Clicking X triggers onCancel', async () => {
    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))
    expect(onCancel).toBeCalled()
})

test('Create triggers onCreate with empty text by default', async () => {
    fireEvent.click(screen.getByText('Create'))
    expect(onCreate).toBeCalledWith({ id, text })
})

test('Create triggers onCreate with replaced text', async () => {
    const text = Math.random().toString()
    const textarea = screen.getByRole('textbox')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, text)
    fireEvent.click(screen.getByText('Create'))
    expect(onCreate).toBeCalledWith({ id, text })
})
