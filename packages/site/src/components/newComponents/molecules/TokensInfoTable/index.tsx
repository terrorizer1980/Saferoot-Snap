import React, { useMemo, useState } from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { Color, Spacing, TextStyle } from "../../globalStyles";
import { useTable } from "react-table";
import { Tag } from "../../atoms/Tag";
import { Button } from "../../atoms/Button";
import { CoinId } from "../../atoms/CoinId";
import { SelectionModal } from "../SelectionModal";
import { EditTokenModal } from "../EditTokenModal";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import {
  AssetSelectionFilter,
  defaultIcon,
} from "../../constants";
import {
  TableFilterContainer,
  TableHeaderContainer,
  TableRootContainer,
  TokenIDContainer,
} from "./styles";
import { Checkbox, Switch } from "@mui/material";
import { useData } from "../../../../hooks/DataContext";
import { DropDown } from "../../atoms/DropDown";
import { GenericHorizontalSpacer } from "../../organisms/commonStyles";
import { ActionType } from "../../../../hooks/actions";
import { ASSET_TYPE, ETHEREUM_TOKEN_STANDARD } from "../../../../constants";
import { SelectionButton } from "../../atoms/SelectionButton";
import {
  AssetGuard,
  AssetGuards,
  updateAssetProperties,
} from "../../../../hooks/Assets/useAssetGuards";
import { TableRow } from "./TableRow";

export type TokensInfoTableProps = {
  type: string;
  tableHeader: string;
  headerOptions?: boolean;
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data?: AssetGuard;
  setData?: React.Dispatch<React.SetStateAction<AssetGuards>>;
  refetch?: () => void;
};

export const TokensInfoTable = (props: TokensInfoTableProps) => {
  const {
    type,
    tableHeader,
    headerOptions = false,
    labels,
    data,
    setData,
    buttonOptions,
    selectable,
    refetch,
  } = props;
  const { state, dispatch } = useData();

  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [activeModalRowDelete, setActiveModalRowDelete] = useState<string>();
  const [activeModalRowEdit, setActiveModalRowEdit] = useState<string>();

  const selectThisToken = (item) => {
    updateAssetProperties(
      setData,
      "ERC20Assets",
      { address: item?.address },
      { isSelected: !item?.isSelected }
    );
  };

  const onClickDelete = (rowIndex) => {
    setOpenModalDelete(true);
    setActiveModalRowDelete(rowIndex);
  };

  const onClickEdit = (rowIndex, address, symbol) => {
    dispatch({
      type: ActionType.SET_ASSET_TO_EDIT,
      payload: {
        assetType: ASSET_TYPE.TOKEN,
        address: address,
        id: null,
        symbol: symbol,
      },
    });
    setOpenModalEdit(true);
    setActiveModalRowEdit(rowIndex);
  };

  const defineAccessor = (key: string) => {
    const value =
      typeof data[0][key.toLowerCase()] === "string" ||
      typeof data[0][key.toLowerCase()] === "number"
        ? key.toLowerCase()
        : "";
    return value;
  };

  const defineMinWidth = (key: string) => {
    // explain what this function does
    const value =
      typeof data[0][key.toLowerCase()] === "string" ||
      key.toLowerCase() == "token" ||
      key.toLowerCase() == "nft"
        ? `${
            40 /
            Object.keys(data[0]).findIndex((x) => {
              return x == "security";
            })
          }vw`
        : "15vw";
    return value;
  };

  const columns = useMemo<object[]>(() => {
    let newObj = labels.map((item) => {
      return {
        Header: item,
        accessor: defineAccessor(item),
        maxWidth: "400px",
        minWidth: defineMinWidth(item),
        width: "fit-content",
      };
    });
    buttonOptions && (buttonOptions.edit || buttonOptions.delete)
      ? newObj.push({
          Header: "actions",
          accessor: "",
          maxWidth: "400px",
          minWidth: "150px",
          width: "fit-content",
        })
      : null;
    return newObj;
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    // @ts-ignore
    useTable({ columns, data });

  return (
    <TableRootContainer>
      <TableHeaderContainer>
        <div>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {tableHeader}
          </Typography>
        </div>
        {headerOptions && (
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
        )}
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
                  {column.id != "actions" ? (
                    <Typography
                      {...TextStyle.headingColorExtraSmallLabel}
                      {...TextStyle.opacity}
                    >
                      {column.Header as string}
                    </Typography>
                  ) : (
                    <></>
                  )}
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
                selectable={selectable}
                selectThisToken={selectThisToken}
                type={type}
                openModalEdit={openModalEdit}
                setOpenModalEdit={setOpenModalEdit}
                activeModalRowEdit={activeModalRowEdit}
                setActiveModalRowEdit={setActiveModalRowEdit}
                onClickEdit={onClickEdit}
                activeModalRowDelete={activeModalRowDelete}
                setActiveModalRowDelete={setActiveModalRowDelete}
                openModalDelete={openModalDelete}
                setOpenModalDelete={setOpenModalDelete}
                onClickDelete={onClickDelete}
                refetch={refetch}
                defaultIcon={defaultIcon}
              />
            );
          })}
        </tbody>
      </table>
    </TableRootContainer>
  );
};
