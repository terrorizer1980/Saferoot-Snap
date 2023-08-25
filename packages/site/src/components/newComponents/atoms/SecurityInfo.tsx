import React from "react";
import { Color } from "../globalStyles";
import {
  SecurityInfoContainer,
} from "./styles";
import { ButtonTypes, defaultTagIcon } from "../constants";
import { Tag } from "./Tag";
import { Button } from "./Button";
import { AssetGuard } from "../../../hooks/Assets/types";

export type SecurityInfoProps = {
  data?: AssetGuard;
  onClick?: () => void;
};

export const SecurityInfo = (props: SecurityInfoProps) => {
  const { data, onClick } = props;

  return (
    <SecurityInfoContainer>
      {data &&
        data.security.map((securityType) => {
          return (
            <Tag
              onClick={() => {
                if (!data.isPreGuarded) {
                  onClick();
                }
              }}
              color={Color["secondaryTextColor"] as string}
              text={securityType}
              bgColor={Color["limeGreen"] as string}
              image={defaultTagIcon}
            />
          );
        })}
      {(data.security.length == 0 && !data.isPreGuarded) && (
        <Button
          onClick={() => {
            if (!data.isPreGuarded) {
              onClick();
            }
          }}
          type={ButtonTypes.Small}
          image={defaultTagIcon}
          text="Setup Safeguard"
          border="rounded"
        />
      )}
    </SecurityInfoContainer>
  );
};
