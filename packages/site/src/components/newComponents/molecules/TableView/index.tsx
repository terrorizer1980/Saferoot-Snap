import React, { useEffect, useState } from "react";
import "./styles.css";
import { MobileViewNftCard } from "../MobileViewNftCard";
import { NftsInfoTable } from "../NftsInfoTable";
import { TokensInfoTable } from "../TokensInfoTable";
import { MobileViewTokenCard } from "../MobileViewTokenCard";
import { AssetGuard, AssetGuards } from "../../../../hooks/Assets/useAssetGuards";

export type TokenData = {
  asset?: {
    name: string;
    image: string;
  };
  price?: string | number;
  collection?: string | number;
  balance?: string | number;
  value?: string | number;
  valueProtected?: string | number;
  security?: string[];
  status?: {
    isProtected: string;
    time: string;
  };
  address: string;
  isApproved: boolean;
  isPreGuarded: boolean;
  safeguardID: string;
  safeguards: Object[];
};

export type NFTData = {
  asset?: {
    name: string;
    image: string;
  };
  price?: string | number;
  collection?: string | number;
  balance?: string | number;
  value?: string | number;
  valueProtected?: string | number;
  security?: string[];
  status?: {
    isProtected: string;
    time: string;
  };
  address: string;
  isApproved: boolean;
  isPreGuarded: boolean;
  tokenId: string;
  isSafeguarded: boolean;
  safeguardID: string;
  safeguards: Object[];
};

export type TableViewProps = {
  type: "token" | "nft";
  tableHeader: string;
  headerOptions?: boolean;
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data?: AssetGuard[];
  setData?: React.Dispatch<React.SetStateAction<AssetGuards>>;
  refetch?: () => void;
};

export const TableView = (props: TableViewProps) => {
  const { type, tableHeader, labels, data, setData, buttonOptions, selectable = false, refetch } = props;

  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    const handleResize = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {windowDimensions.width > 900 ? (
        <>
          {data && type == "token" && (
            <div>
              <TokensInfoTable
                selectable={selectable}
                type={type}
                data={data}
                setData={setData}
                tableHeader={tableHeader}
                labels={labels}
                buttonOptions={buttonOptions}
                refetch={refetch}
              />
            </div>
          )}
          {data && type == "nft" && (
            <div>
              <NftsInfoTable
                type={type}
                data={data}
                setData={setData}
                tableHeader={tableHeader}
                labels={labels}
                buttonOptions={buttonOptions}
                refetch={refetch}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {data && type == "token" && (
            <div>
              <MobileViewTokenCard
                selectable={selectable}
                type={type}
                data={data}
                tableHeader={tableHeader}
                labels={labels}
                buttonOptions={buttonOptions}
              />
            </div>
          )}
          {data && type == "nft" && (
            <div>
              <MobileViewNftCard
                selectable={selectable}
                type={type}
                data={data}
                tableHeader={tableHeader}
                labels={labels}
                buttonOptions={buttonOptions}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
