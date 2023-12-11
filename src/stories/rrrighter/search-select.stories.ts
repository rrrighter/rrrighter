import type { Meta, StoryObj } from '@storybook/react';

import SearchSelect from "../../components/notebook/search/search-select";
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: 'Rrrighter/Notebook/Search',
    component: SearchSelect,
    argTypes: {
        notebook: Notebook,
        onSelect: { action: "onSelect" }
    },
} satisfies Meta<typeof SearchSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const home = { text: '🏡' }
const person = { text: '🧍' }

const notebook = new Notebook(home);
notebook.relate([
    { parent: home, child: person }
]);

export const Search: Story = {
    args: {
        notebook
    },
};
