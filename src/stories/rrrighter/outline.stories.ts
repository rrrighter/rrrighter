import type { Meta, StoryObj } from "@storybook/react";

import Outline from "../../components/notebook/outline/outline";
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
  title: "Rrrighter/Notebook/Outline",
  component: Outline,
  argTypes: {
    onSelect: { action: "onSelect" },
    onEdit: { action: "onEdit" },
    onDrop: { action: "onDrop" },
  },
} satisfies Meta<typeof Outline>;

export default meta;
type Story = StoryObj<typeof meta>;

// todo: load from jsonObjectLiteral to simplify setup
const home = { id: "0", text: "🏡 Home" };
const family = new Notebook(home.id);
const grandparent = { id: "1", text: "grandparent" };
const parent = { id: "2", text: "parent" };
const child1 = { id: "3", text: "child1" };
const child2 = { id: "4", text: "child2" };
const child3 = { id: "5", text: "child3" };
family.relate([
  { parent: home.id, child: grandparent.id },
  { parent: grandparent.id, child: parent.id },
  { parent: parent.id, child: child1.id },
  { parent: parent.id, child: child2.id },
  { parent: parent.id, child: child3.id },
]);
[home, grandparent, parent, child1, child2, child3].forEach(({ id, text }) =>
  family.set(id, text),
);

export const Family: Story = {
  args: {
    notebook: family,
  },
};

export const Parent: Story = {
  args: {
    notebook: family,
    parentId: parent.id,
  },
};
