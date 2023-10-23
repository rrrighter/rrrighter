import type { Meta, StoryObj } from '@storybook/react';

import Outline from '../../components/notebook/outline/outline';
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: 'Rrrighter/Notebook/Outline',
    component: Outline
} satisfies Meta<typeof Outline>;

export default meta;
type Story = StoryObj<typeof meta>;

const family = new Notebook();
family.upsert({ id: 'grandparent', text: 'grandparent' });
family.upsert({ id: 'parent', text: 'parent' });
family.upsert({ id: 'child', text: 'child' });
family.attach('grandparent', 'parent')
family.attach('parent', 'child')

export const Family: Story = {
    args: {
        notebook: family
    },
};
