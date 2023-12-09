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

const family = new Notebook();
family.upsert({ id: 'grandparent', text: 'grandparent' });
family.upsert({ id: 'parent', text: 'parent' });
family.upsert({ id: 'child1', text: 'child1' });
family.upsert({ id: 'child2', text: 'child2' });
family.upsert({ id: 'child3', text: 'child3' });
family.relate('grandparent', 'parent')
family.relate('parent', 'child1')
family.relate('parent', 'child2')
family.relate('parent', 'child3')

export const Family: Story = {
    args: {
        notebook: family
    },
};

export const Parent: Story = {
    args: {
        notebook: family,
        parentId: 'parent'
    },
};
