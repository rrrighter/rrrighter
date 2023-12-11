import type { Meta, StoryObj } from '@storybook/react';

import NoteOutline from '../../components/notes/note-outline';
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: 'Rrrighter/Note/NoteOutline',
    component: NoteOutline
} satisfies Meta<typeof NoteOutline>;

export default meta;
type Story = StoryObj<typeof meta>;

const home = { text: '🏡' }
const person = { text: '🧍' }

const notebook = new Notebook(home);
notebook.relate([
    { parent: home, child: person }
]);

export const WithoutDescendantsCountBadge: Story = {
    args: {
        notebook,
        note: person,
    },
};

export const WithDescendantsCountBadge: Story = {
    args: {
        notebook,
        note: home,
    },
};
