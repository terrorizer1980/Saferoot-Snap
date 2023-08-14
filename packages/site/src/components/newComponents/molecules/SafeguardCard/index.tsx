import React, { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import {
  SafeguardCardButtonsContainer,
  SafeguardCardCustomText,
  SafeguardCardOtherOptions,
  SafeguardCardRoot,
  SafeguardItemImage,
  SafeguardItemInfo,
  SafeguardItemValue,
} from "./styles";
import { Color, TextStyle } from "../../globalStyles";
import { SelectionButton } from "../../atoms/SelectionButton";
import { RoundedInput } from "../../atoms/RoundedInput";
import { AssetTypes, defaultIcon } from "../../constants";
import { Typography } from "../../atoms/Typography";
// Styles for the safeguard list component

export interface SafeguardCardProps {
  type: AssetTypes;
  name: string;
  subText: string;
  image?: string;
  checkboxHandler?: (value: boolean) => void;
  presentThreshold?: number;
  setDesiredThreshold?: (value: string) => void;
}

// Safeguard Item is the component that manages the individual configuration container, it allows expanding and collapsing its children
export const SafeguardCard = (props: SafeguardCardProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const { type, name, subText, image, checkboxHandler, presentThreshold = '0', setDesiredThreshold } = props;
  const [testValue, setTestValue] = useState(presentThreshold);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    setDesiredThreshold(testValue?.toString());
  }, [testValue]);

  useEffect(() => {
    if (isCustom) {
      setTestValue("");
    }
  }, [isCustom]);

  return (
    <SafeguardCardRoot
      style={{
        height: isChecked ? "400px" : "200px",
        border: isChecked
          ? isChecked
            ? "2px solid #27FB6B"
            : "2px solid red"
          : "2px solid #E0E0E0",
        backgroundColor: isChecked ? "#FFFFFF" : "#F6F6F6",
      }}
    >
      <SafeguardItemInfo>
        <SafeguardItemImage>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <img src={image ?? defaultIcon} height={"70px"} />
            <div>
              <Checkbox
                // checked={isChecked}
                onChange={() => {
                  checkboxHandler ? checkboxHandler(!isChecked) : null;
                  setIsChecked(!isChecked);
                }}
              />
            </div>
          </div>
        </SafeguardItemImage>
        <SafeguardItemValue>
          <Typography {...TextStyle.blackLargeLabel} {...TextStyle.boldText}>
            {type == AssetTypes.Token ? "Threshold" : "NFT-Lock"}
          </Typography>
          <Typography
            {...TextStyle.headingColorSmallLabel}
            {...TextStyle.opacity}
          >
            {subText}
          </Typography>
        </SafeguardItemValue>
      </SafeguardItemInfo>
      {isChecked && type == AssetTypes.Token ? (
        <SafeguardCardOtherOptions>
          <Typography
            {...TextStyle.headingColorSmallLabel}
            {...TextStyle.opacity}
          >
            {"Choose amongst the following options:"}
          </Typography>
          <SafeguardCardButtonsContainer>
            <SelectionButton
              enabledText={"10 " + name}
              disabledText={"10 " + name}
              disabledBgColor={Color.black as string}
              disabledTextColor={Color.white as string}
              onClick={() => {
                setTestValue("10");
                setIsCustom(false);
              }}
              changeButtonStateTo={testValue == "10" ? true : false}
            ></SelectionButton>
            <SelectionButton
              enabledText={"50 " + name}
              disabledText={"50 " + name}
              disabledBgColor={Color.black as string}
              disabledTextColor={Color.white as string}
              onClick={() => {
                setTestValue("50");
                setIsCustom(false);
              }}
              changeButtonStateTo={testValue == "50" ? true : false}
            ></SelectionButton>
            <SelectionButton
              enabledText={"100 " + name}
              disabledText={"100 " + name}
              // width={110}
              disabledBgColor={Color.black as string}
              disabledTextColor={Color.white as string}
              onClick={() => {
                setTestValue("100");
                setIsCustom(false);
              }}
              changeButtonStateTo={testValue == "100" ? true : false}
            ></SelectionButton>
            <SelectionButton
              enabledText={"Custom"}
              disabledText={"Custom"}
              disabledBgColor={Color.black as string}
              disabledTextColor={Color.white as string}
              onClick={() => {
                setIsCustom(true)
              }}
              changeButtonStateTo={isCustom}
            ></SelectionButton>
          </SafeguardCardButtonsContainer>
          {isCustom ? (
            <SafeguardCardCustomText>
              <RoundedInput
                text={testValue?.toString()}
                setText={setTestValue}
              />
            </SafeguardCardCustomText>
          ) : null}
        </SafeguardCardOtherOptions>
      ) : null}
    </SafeguardCardRoot>
  );
};
