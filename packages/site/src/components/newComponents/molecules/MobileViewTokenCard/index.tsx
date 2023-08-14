import React, { useState } from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { Color, Dimensions, TextStyle } from "../../globalStyles";
import { Tag } from "../../atoms/Tag";
import { Button } from "../../atoms/Button";
import { NFTData } from "../TableView";
import {
  AssetSelectionFilter,
  defaultAvatar,
  defaultIcon,
  defaultTagIcon,
} from "../../constants";
import {
  MobileViewButtonsContainer,
  MobileViewIcon,
  MobileViewLine,
  MobileViewMainContainer,
  MobileViewRootContainer,
  MobileViewSpreadContainer,
  MobileViewTagsContainer,
} from "./styles";
import { SelectionModal } from "../SelectionModal";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import {
  TableFilterContainer,
  TableHeaderContainer,
  TokenIDContainer,
} from "../TokensInfoTable/styles";
import { GenericHorizontalSpacer } from "../../organisms/commonStyles";
import { DropDown } from "../../atoms/DropDown";
import { Checkbox, Switch } from "@mui/material";

export type MobileViewTokenCardProps = {
  type: string;
  tableHeader: string;
  headerOptions?: { sort: boolean; selectAll: boolean };
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data?: NFTData[];
};

export const MobileViewTokenCard = (props: MobileViewTokenCardProps) => {
  const { type, tableHeader, headerOptions, selectable, data, buttonOptions } =
    props;

  const [activeModalRow, setActiveModalRow] = useState<number>();

  const onClickDelete = (rowIndex) => {
    setActiveModalRow(rowIndex);
  };

  return (
    <MobileViewRootContainer>
      <TableHeaderContainer>
        <div>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {tableHeader}
          </Typography>
        </div>
        <TableFilterContainer>
          <GenericHorizontalSpacer>
            <DropDown data={AssetSelectionFilter} label="Sort" />
          </GenericHorizontalSpacer>
          <Typography {...TextStyle.blackMediumLabel}>Select All</Typography>
          <GenericHorizontalSpacer>
            <Typography
              {...TextStyle.headingColorMediumLabel}
              {...TextStyle.opacity}
            >
              {"(" + data.length + ")"}
            </Typography>
          </GenericHorizontalSpacer>
          <Switch onChange={() => {}} />
        </TableFilterContainer>
      </TableHeaderContainer>
      {data.map((item, index) => {
        return (
          <>
            <MobileViewMainContainer
              style={{
                backgroundColor:
                  index % 2
                    ? (Color.limeGreen as string)
                    : (Color.white as string),
              }}
            >
              <TokenIDContainer>
                {selectable && (
                  <div>
                    <Checkbox
                      // checked={}
                      sx={{
                        color: Color.black,
                        "&.Mui-checked": {
                          color: Color.black,
                        },
                        "& .MuiSvgIcon-root": { fontSize: 24 },
                      }}
                      onChange={() => {}}
                    />
                  </div>
                )}
                <MobileViewIcon
                  src={item.asset.image ? item.asset.image : defaultIcon}
                ></MobileViewIcon>
              </TokenIDContainer>
              <div className="mobile_token_card_info_container">
                <div className="mobile_token_card_values">
                  <MobileViewSpreadContainer>
                    <div>
                      <Typography {...TextStyle.blackMediumLabel}>
                        {item.asset.name}
                      </Typography>
                    </div>
                    <div>
                      <Typography {...TextStyle.blackMediumLabel}>
                        {item.balance}
                      </Typography>
                    </div>
                  </MobileViewSpreadContainer>
                  <MobileViewSpreadContainer>
                    <div>
                      <Typography
                        {...TextStyle.headingColorMediumLabel}
                        {...TextStyle.opacity}
                      >
                        {item.price}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        {...TextStyle.headingColorMediumLabel}
                        {...TextStyle.opacity}
                      >
                        {item.value}
                      </Typography>
                    </div>
                  </MobileViewSpreadContainer>
                </div>
                {item.security && (
                  <>
                    <MobileViewLine />
                    <MobileViewSpreadContainer>
                      <div>
                        <Typography
                          {...TextStyle.secondaryTextColorExtraSmallLabel}
                          {...TextStyle.opacity}
                        >
                          Security
                        </Typography>
                      </div>
                      <MobileViewTagsContainer>
                        <SecurityInfo type={type} data={item} />
                      </MobileViewTagsContainer>
                    </MobileViewSpreadContainer>
                    <MobileViewLine />
                  </>
                )}
                {item.status && (
                  <MobileViewSpreadContainer>
                    <div>
                      <Typography
                        {...TextStyle.secondaryTextColorExtraSmallLabel}
                        {...TextStyle.opacity}
                      >
                        Status
                      </Typography>
                    </div>
                    <div className="tokens_table_labels_status">
                      <Typography
                        {...TextStyle.secondaryTextColorExtraSmallLabel}
                        {...TextStyle.opacity}
                      >
                        {item.status.time}
                      </Typography>
                      <div style={{ marginLeft: 5 }}>
                        <Tag
                          color={Color["white"] as string}
                          text={item.status.isProtected ? "Protected" : "At Risk"}
                          bgColor={item.status.isProtected ? Color["oceanGreen"] as string : Color["black"] as string}
                         />
                      </div>
                    </div>
                  </MobileViewSpreadContainer>
                )}
                {buttonOptions && (
                  <MobileViewButtonsContainer>
                    <Button text="Edit" width="80%" border="rounded" image="" />
                    <Button
                      image="/defaultCoin.png"
                      onClick={() => {
                        onClickDelete(index);
                      }}
                    />
                    {activeModalRow == index ? (
                      <SelectionModal
                        enableText="Confirm"
                        disableText="Cancel"
                        onClickBoolean={(val: boolean) => {
                          setActiveModalRow(-1);
                        }}
                        text="Do you want to delete the Token?"
                      />
                    ) : null}
                  </MobileViewButtonsContainer>
                )}
              </div>
            </MobileViewMainContainer>
            <MobileViewLine />
          </>
        );
      })}
    </MobileViewRootContainer>
  );
};
