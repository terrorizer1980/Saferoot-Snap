import React, { useState } from "react";
import {
  RoundedInputContainer,
  RoundedInputPasteButton,
  RoundedInputRoot,
} from "./styles";
import { Color, Dimensions } from "../globalStyles";
import { Button } from "./Button";
import { ButtonTypes, defaultIcon } from "../constants";

export type RoundedInputProps = {
  onChange?: (value: string) => void;
  text?: string;
  setText?: (value: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  pasteOption?: boolean;
};

export const RoundedInput = (props: RoundedInputProps) => {
  const [focus, setFocus] = useState(false);
  const {
    onChange,
    text = "",
    setText,
    placeholder,
    width = Dimensions.roundedInputWidth,
    height = Dimensions.roundedInputHeight,
    pasteOption = false,
  } = props;

  const onClickPaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  return (
    <RoundedInputRoot
      style={{
        borderColor: focus
          ? (Color.neonGreen as string)
          : (Color.borderColor as string),
      }}
    >
      <RoundedInputContainer
        value={text}
        onChange={onChange ? () => {onChange} : (e) => { setText(e.target.value) }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        placeholder={placeholder ?? ""}
        style={{
          width: width,
          height: height,
          borderColor: focus
            ? (Color.neonGreen as string)
            : (Color.borderColor as string),
        }}
      />

      {pasteOption && (
        <RoundedInputPasteButton>
          <Button
            type={ButtonTypes.Small}
            image={'/paste.svg'}
            text="Paste"
            bgColor={Color.backgroundGrey as string}
            border="rounded"
            width={Dimensions.InputPasteButtonWidth}
            onClick={onClickPaste}
          />
        </RoundedInputPasteButton>
      )}
    </RoundedInputRoot>
  );
};
