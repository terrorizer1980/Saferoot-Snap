import React, { useState } from "react";
import {
  DropDownRoot,
  RoundedInputContainer,
  RoundedInputPasteButton,
  RoundedInputRoot,
} from "./styles";
import { Color, Dimensions, TextStyle } from "../globalStyles";
import { Button } from "./Button";
import { ButtonTypes, defaultIcon } from "../constants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Typography } from "./Typography";

export type DropDownProps = {
  data?: { value: string; label: string }[];
  label: string;
};

export const DropDown = (props: DropDownProps) => {
  const [value, setValue] = useState<string>("");
  const { data, label } = props;

  return (
    <DropDownRoot>
      <FormControl sx={{ m: 0.5, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">
          <Typography {...TextStyle.headingColorMediumLabel}>
            {label}
          </Typography>
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Age"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        >
          {data.map((item) => {
            return (
              <MenuItem  value={item.value}>
                <Typography {...TextStyle.headingColorSmallLabel}>
                  {item.label}
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </DropDownRoot>
  );
};
