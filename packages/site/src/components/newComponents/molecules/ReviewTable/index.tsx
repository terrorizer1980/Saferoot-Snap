import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "../../atoms/Typography";
import { Color, Spacing, TextStyle } from "../../globalStyles";
import { useTable } from "react-table";
import { Button } from "../../atoms/Button";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import {
  ButtonTypes,
  defaultIcon,
  mobileViewWidthBreak,
} from "../../constants";
import {
  ButtonContainer,
  TableHeaderContainer,
  TableRootContainer,
  TokenIDContainer,
} from "./styles";
import {
  MobileViewIcon,
  MobileViewLine,
  MobileViewMainContainer,
  MobileViewSpreadContainer,
  MobileViewTagsContainer,
} from "./styles";
import { AssetGuard } from "../../../../hooks/Assets/useAssetGuards";
import { TableRow } from "./TableRow";

export type ReviewTableProps = {
  tableHeader: string;
  labels: string[];
  data?: AssetGuard[];
  setData?: React.Dispatch<React.SetStateAction<Object[]>>;
  refetch?: () => void;
};

export const ReviewTable = (props: ReviewTableProps) => {

  const { tableHeader, labels, data, setData, refetch } = props;
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const columns = useMemo<object[]>(() => {
    let newObj = labels.map((item) => {
      return {
        Header: item,
        accessor: "",
        maxWidth: "400px",
        minWidth: "15vw",
        width: "fit-content",
      };
    });
    newObj.push({
      Header: "APPROVAL",
      accessor: "",
      maxWidth: "400px",
      minWidth: "150px",
      width: "fit-content",
    });

    return newObj;
  }, []);

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    // @ts-ignore
    useTable({ columns, data });

  return (
    <TableRootContainer>
      {windowDimensions.width > mobileViewWidthBreak ? (
        <>
          <TableHeaderContainer>
            <div>
              <Typography {...TextStyle.blackLargeLabel}>
                {tableHeader}
              </Typography>
            </div>
          </TableHeaderContainer>
          <table
            {...getTableProps({
              style: {
                width: "100%",
                borderCollapse: "collapse",
                border: "none",
              },
            })}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps({
                    style: {
                      borderBottom: `solid 0.5px ${Color.borderColor}`,
                    },
                  })}
                  className="table-header"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps({
                        style: {
                          minWidth: column.minWidth,
                          width: column.width,
                          textAlign: "left",
                          padding: Spacing.tableHeaderBottomPadding,
                        },
                      })}
                    >
                      <Typography
                        {...TextStyle.headingColorExtraSmallLabel}
                        {...TextStyle.opacity}
                      >
                        {column.Header as string}
                      </Typography>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow
                    row={row}
                    data={data}
                    setData={setData}
                    openModalEdit={openModalEdit}
                    setOpenModalEdit={setOpenModalEdit}
                    refetch={refetch}
                  />
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <TableHeaderContainer>
            <div>
              <Typography {...TextStyle.blackExtraLargeLabel}>
                {tableHeader}
              </Typography>
            </div>
          </TableHeaderContainer>
          {data.map((item, index) => {
            return (
              <>
                <MobileViewMainContainer>
                  <TokenIDContainer>
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
                        <MobileViewTagsContainer>
                          <SecurityInfo data={item} />
                        </MobileViewTagsContainer>
                      </MobileViewSpreadContainer>
                    </div>
                  </div>
                </MobileViewMainContainer>
                <ButtonContainer>
                  <Button
                    text="Approve"
                    border="rounded"
                    bgColor={Color.black as string}
                    color={Color.white as string}
                    type={ButtonTypes.Small}
                  />
                </ButtonContainer>
                <MobileViewLine />
              </>
            );
          })}
        </>
      )}
    </TableRootContainer>
  );
};
