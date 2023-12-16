import type { Meta, StoryObj } from "@storybook/react";

import SearchSelect from "../../components/notebook/search/search-select";
import Notebook from "../../lib/rrrighter/src/notebook";

const meta = {
  title: "Rrrighter/Notebook/Search",
  component: SearchSelect,
  argTypes: {
    notebook: Notebook,
    onSelect: { action: "onSelect" },
  },
} satisfies Meta<typeof SearchSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// todo: load from jsonObjectLiteral to simplify setup
const home = { id: "home", text: "🏡 Home" };
const person = { id: "person", text: "🧍 Person" };

const notebook = new Notebook(home.id);
notebook.set(home.id, home.text);
notebook.relate([{ parent: home.id, child: person.id }]);
notebook.set(person.id, person.text);

export const Search: Story = {
  args: {
    notebook,
  },
};
