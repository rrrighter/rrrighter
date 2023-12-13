import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import TextareaPrompt from "../prompt/textarea-prompt";

export default function CreateNoteButton(props: { onCreate: Function }) {
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false);

  const showPrompt = () => {
    setIsPromptVisible(true);
  };

  const hidePrompt = () => {
    setIsPromptVisible(false);
  };

  const onInput = (text: string) => {
    hidePrompt();
    props.onCreate(text);
  };

  return (
    <>
      <Button
        type="text"
        size={"small"}
        icon={<PlusOutlined />}
        onClick={showPrompt}
        aria-label="Create note"
        title="Create note"
      />
      {isPromptVisible && (
        <TextareaPrompt
          title="Create note"
          buttonText="Create"
          onClose={hidePrompt}
          onInput={onInput}
        />
      )}
    </>
  );
}
