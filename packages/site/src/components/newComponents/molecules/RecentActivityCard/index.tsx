import React from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { Color, TextStyle } from "../../globalStyles";
import { Tag } from "../../atoms/Tag";
import { AvatarId } from "../../atoms/AvatarId";

export type RecentActivityCardProps = {
  coinAmount: string;
  amount: string;
  network: string;
};

export const RecentActivityCard = (props: RecentActivityCardProps) => {

  return (
    <div className="recent_activity_root_container">
      <div>
        <Typography {...TextStyle.headingColorExtraSmallLabel}>
          Recent Activity
        </Typography>
      </div>
      <div className="recent_activity_protected_status">
        <div>
          <Typography
            {...TextStyle.darkNavyBlueMediumLabel}
            {...TextStyle.boldText}
          >
            Protection Update
          </Typography>
        </div>
        <div>
          <Tag text={"Updated"} bgColor={Color["darkNavyBlue"] as string}></Tag>
        </div>
      </div>
      <div className="recent_avtivity_id">
        <AvatarId />
      </div>
      <div className="recent_avtivity_bottom_text">
        <Typography {...TextStyle.headingColorLargeLabel}>
          Lorem ipsum is simply dummy
        </Typography>
      </div>
    </div>
  );
};
