import type { Meta, StoryObj } from '@storybook/react';

import Outline from '../../components/notebook/outline/outline';
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: 'Rrrighter/Notebook/Outline',
    component: Outline,
    argTypes: {
        onSelect: { action: "onSelect" },
        onDrop: { action: "onDrop" }
    },
} satisfies Meta<typeof Outline>;

export default meta;
type Story = StoryObj<typeof meta>;

const home = { text: '🏡' }
const family = new Notebook(home);
const grandparent = { text: 'grandparent' }
const parent = { text: 'parent' }
const child1 = { text: 'child1' }
const child2 = { text: 'child2' }
const child3 = { text: 'child3' }
family.relate([
    { parent: home, child: grandparent },
    { parent: grandparent, child: parent },
    { parent: parent, child: child1 },
    { parent: parent, child: child2 },
    { parent: parent, child: child3 }
]);

export const Family: Story = {
    args: {
        notebook: family
    },
};

export const Parent: Story = {
    args: {
        notebook: family,
        parent: parent
    },
};
