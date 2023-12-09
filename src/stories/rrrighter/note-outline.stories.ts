import type { Meta, StoryObj } from '@storybook/react';

import NoteOutline from '../../components/notes/note-outline';
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: 'Rrrighter/Note/NoteOutline',
    component: NoteOutline
} satisfies Meta<typeof NoteOutline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrphanHierarch: Story = {
    args: {
        notebook: new Notebook(),
        note: { id: 'orphan hierarch', text: 'orphan hierarch' },
    },
};

const parentChildNotebook = new Notebook();
const parent = { id: 'parent', text: 'parent' }
parentChildNotebook.upsert(parent);
parentChildNotebook.upsert({ id: 'child', text: 'child' });
parentChildNotebook.relate('parent', 'child')

export const ParentWithOneChild: Story = {
    args: {
        notebook: parentChildNotebook,
        note: parent,
    },
};
