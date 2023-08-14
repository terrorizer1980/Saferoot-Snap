import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { Tag } from "../../atoms/Tag";
import { NFTData } from "../TableView";
import {
  MobileViewButtonsContainer,
  MobileViewIcon,
  MobileViewLine,
  MobileViewMainContainer,
  MobileViewRootContainer,
  MobileViewSpreadContainer,
  MobileViewTagsContainer,
} from "../MobileViewTokenCard/styles";
import { defaultAvatar, defaultTagIcon } from "../../constants";
import { SelectionButton } from "../../atoms/SelectionButton";
import { SelectionModal } from "../SelectionModal";
import { SecurityInfo } from "../../atoms/SecurityInfo";

export type MobileViewNftCardProps = {
  type: string;
  tableHeader: string;
  headerOptions?: { sort: boolean; selectAll: boolean };
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data?: NFTData[];
};

export const MobileViewNftCard = (props: MobileViewNftCardProps) => {
  const { type, tableHeader, headerOptions, selectable, data, buttonOptions } = props;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeModalRow, setActiveModalRow] = useState<number>();
  const [activeModalValue, setActiveModalValue] = useState<boolean>();

  const handleOpenModal = (rowIndex: number) => {
    setActiveModalRow(rowIndex);
    setOpenModal(true);
  };

  return (
    <MobileViewRootContainer>
      <div className="tokens_table_header_container">
        <div>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {tableHeader}
          </Typography>
        </div>
      </div>
      {data?.map((item, index) => {
        return (
          <>
            <MobileViewMainContainer>
              <div>
                <MobileViewIcon
                  src={item?.asset?.image ? item.asset.image : defaultAvatar}
                ></MobileViewIcon>
              </div>
              <div className="mobile_token_card_info_container">
                <div className="mobile_token_card_values">
                  <MobileViewSpreadContainer>
                    <div>
                      <Typography {...TextStyle.blackMediumLabel}>
                        {item.asset?.name}
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
                <MobileViewLine />
                {item.security && (
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
                )}
                <MobileViewLine />
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
                <MobileViewButtonsContainer>
                  <SelectionButton
                    enabledText="Disable"
                    disabledText="Enable"
                    onClick={() => {
                      handleOpenModal(index);
                    }}
                    changeButtonStateTo={
                      activeModalRow == index ? activeModalValue : null
                    }
                  />
                  {activeModalRow == index && openModal ? (
                    <SelectionModal
                      onClickBoolean={(val: boolean) => {
                        setActiveModalValue(val);
                        setOpenModal(false);
                      }}
                      text="Do you want to enable the NFT?"
                    />
                  ) : null}
                </MobileViewButtonsContainer>
              </div>
            </MobileViewMainContainer>
            <MobileViewLine />
          </>
        );
      })}
    </MobileViewRootContainer>
  );
};
