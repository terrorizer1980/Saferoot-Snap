import React, { useMemo, useState } from "react";
import "./styles.css";
import { Typography } from "../../atoms/Typography";
import { Spacing, TextStyle } from "../../globalStyles";
import { useTable } from "react-table";
import { TableRootContainer } from "../TokensInfoTable/styles";
import { useData } from "../../../../hooks/DataContext";
import { AssetGuard, AssetGuards } from "../../../../hooks/Assets/types";
import { TableRow } from "./TableRow";

export type NftsInfoTableProps = {
  type: string;
  tableHeader: string;
  headerOptions?: { sort: boolean; selectAll: boolean };
  labels: string[];
  buttonOptions?: { edit: boolean; delete: boolean };
  selectable?: boolean;
  data?: AssetGuard[];
  setData?: React.Dispatch<React.SetStateAction<AssetGuards>>;
  refetch?: () => void;
};

export const NftsInfoTable = (props: NftsInfoTableProps) => {
  const { type, tableHeader, labels, data, setData, buttonOptions, refetch } = props;
  const { state, dispatch } = useData();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [activeModalRow, setActiveModalRow] = useState<string>();
  const [activeModalRowEdit, setActiveModalRowEdit] = useState<string>();

  const handleOpenModal = (rowIndex: string) => {
    setActiveModalRow(rowIndex);
    setOpenModal(true);
  };

  const defineAccessor = (key: string) => {
    const value =
      typeof data[0][key.toLowerCase()] === "string" ? key.toLowerCase() : "";
    return value;
  };

  const defineMinWidth = (key: string) => {
    // explain what this function does
    const value =
      typeof data[0][key.toLowerCase()] === "string" ||
        key.toLowerCase() == "nft"
        ? `${40 /
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
      <div className="tokens_table_header_container">
        <div>
          <Typography {...TextStyle.blackExtraLargeLabel}>
            {tableHeader}
          </Typography>
        </div>
      </div>
      <table
        {...getTableProps({
          style: {
            width: "100%",
          },
        })}
      >
        <thead style={{ marginBottom: "50px" }}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
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
                type={type}
                openModalEdit={openModalEdit}
                setOpenModalEdit={setOpenModalEdit}
                activeModalRowEdit={activeModalRowEdit}
                setActiveModalRowEdit={setActiveModalRowEdit}
                refetch={refetch}
                activeModalRow={activeModalRow}
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleOpenModal={handleOpenModal}
              />
            );
          })}
        </tbody>
      </table>
    </TableRootContainer>
  );
};
