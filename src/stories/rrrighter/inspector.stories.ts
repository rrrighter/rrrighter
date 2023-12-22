import type { Meta, StoryObj } from "@storybook/react";

import Inspector from "../../components/notes/inspector";
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
    title: "Rrrighter/Note/Inspector",
    component: Inspector,
    argTypes: {
        onSelect: { action: "onSelect" }
    },
} satisfies Meta<typeof Inspector>;

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

export const Home: Story = {
    args: {
        notebook: family,
        id: family.homeId()
    },
};

export const Descendant: Story = {
    args: {
        notebook: family,
        id: grandparent.id,
    },
};
