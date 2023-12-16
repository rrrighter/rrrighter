import type { Meta, StoryObj } from "@storybook/react";

import NoteItem from "../../components/notes/note-item";
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
  title: "Rrrighter/Note/NoteOutline",
  component: NoteItem,
} satisfies Meta<typeof NoteItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// todo: load from jsonObjectLiteral to simplify setup
const home = { id: "0", text: "🏡" };
const person = { id: "1", text: "🧍" };

const notebook = new Notebook(home.id);
notebook.set(home.id, home.text);
notebook.relate([{ parent: home.id, child: person.id }]);
notebook.set(person.id, person.text);

export const WithoutDescendantsCountBadge: Story = {
  args: {
    notebook,
    id: person.id,
  },
};

export const WithDescendantsCountBadge: Story = {
  args: {
    notebook,
    id: home.id,
  },
};
