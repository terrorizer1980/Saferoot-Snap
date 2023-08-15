import React, { useEffect } from 'react';
import { Checkbox, Typography } from "@mui/material";
import { Color, Spacing, TextStyle } from "../../globalStyles";
import { TokenIDContainer } from "./styles";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import { CoinId } from "../../atoms/CoinId";
import { Tag } from '../../atoms/Tag';
import { EditTokenModal } from "../EditTokenModal";
import { Button } from "../../atoms/Button";
import { SelectionModal } from "../SelectionModal";
import { SelectionButton } from "../../../SelectionButton";
import { ActionType } from "../../../../hooks/actions";
import { AssetGuard, AssetGuards, updateAssetProperties } from "../../../../hooks/Assets/useAssetGuards";
import { ETHEREUM_TOKEN_STANDARD } from "../../../../constants";
import { SimpleButton } from "../../../SimpleButton";
import { approve, approve721 } from "../../../../blockchain/functions";
import { Address, useWaitForTransaction } from "wagmi";
import { ethers } from 'ethers';
import { useData } from '../../../../hooks/DataContext';

export interface TableRowProps {
    row: any;
    data: AssetGuard
    setData: React.Dispatch<React.SetStateAction<AssetGuards>>;
    selectable: boolean
    selectThisToken: (string) => void
    type: string;
    openModalEdit: boolean
    setOpenModalEdit: (boolean) => void
    setActiveModalRowEdit: (string) => void
    refetch: () => void
    activeModalRowEdit: string
    activeModalRowDelete: string
    setActiveModalRowDelete: (string) => void
    openModalDelete: boolean
    onClickEdit: (arg1: string, arg2: string, arg3: string) => void
    onClickDelete: (string) => void
    setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>
    defaultIcon: string
}
export const TableRow = (props: TableRowProps) => {
    const {
        row,
        data,
        setData,
        selectable,
        selectThisToken,
        type,
        openModalEdit,
        setOpenModalEdit,
        activeModalRowEdit,
        setActiveModalRowEdit,
        onClickEdit,
        activeModalRowDelete,
        setActiveModalRowDelete,
        openModalDelete,
        setOpenModalDelete,
        onClickDelete,
        refetch,
        defaultIcon,
    } = props;

    const { state } = useData();

    const makeApproveAssetTrigger = (row) => {
        return approve({
            tokenAddress: row.address,
            saferootAddress: state.deployedSaferootAddress as Address,
            amount: ethers.constants.MaxUint256.toString()
        });
    }

    const makeApproveRes = (hash) => {
        return useWaitForTransaction({
            hash: hash,
            onSettled: (data, error) => {
                if (!error) {

                }
                return data;
            }
        });
    }
    const approveAssetTrigger = makeApproveAssetTrigger(data[row.id]);
    const approveRes = makeApproveRes(approveAssetTrigger.data?.hash)

    const getApprovalText = () => {
        switch (true) {
            case approveRes.isLoading:
                return "Approving...";
            case approveRes.isSuccess:
                return "Approved";
            case approveRes.isError:
                return "Failed"
            default:
                return "Approved";
        }
    }

    useEffect(() => {
        if (approveRes.isSuccess) {
            updateAssetProperties(setData, "ERC20Assets", { address: data[row.id]?.address }, { isApproved: true })
        }
    }, [approveRes])

    return (
        <tr {...row.getRowProps()}>
            {row.cells.map((cell) => (
                <td
                    {...cell.getCellProps({
                        style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                            verticalAlign: "center",
                            padding: Spacing.GenericSpacerMargin10,
                            backgroundColor:
                                !(Number(cell.row.id) % 2) && selectable
                                    ? (Color.limeGreen as string)
                                    : (Color.white as string),
                        },
                    })}
                >
                    {cell.column.id.toLowerCase() == "token" && (
                        <TokenIDContainer>
                            {selectable && (
                                <div>
                                    <Checkbox
                                        sx={{
                                            color: Color.black,
                                            "&.Mui-checked": {
                                                color: Color.black,
                                            },
                                            "& .MuiSvgIcon-root": { fontSize: 24 },
                                        }}
                                        onChange={() => selectThisToken(data[cell.row.id])}
                                    />
                                </div>
                            )}
                            <CoinId id={data[cell.row.id].asset.name}></CoinId>
                        </TokenIDContainer>
                    )}
                    {cell.column.id.toLowerCase() == "security" && (
                        <SecurityInfo
                            data={data[cell.row.id]}
                            onClick={() => { setOpenModalEdit(true); setActiveModalRowEdit(cell.row.id); }}
                        />
                    )}
                    {cell.column.id.toLowerCase() == "status" && (
                        <div className="tokens_table_labels_status">
                            <Tag
                                color={Color["white"] as string}
                                text={data[cell.row.id].status.isProtected ? "Protected" : "At Risk"}
                                bgColor={data[cell.row.id].status.isProtected ? Color["oceanGreen"] as string : Color["black"] as string}
                            />
                            <div style={{ marginLeft: 5 }}>
                                <Typography
                                    {...TextStyle.secondaryTextColorExtraSmallLabel}
                                    {...TextStyle.opacity}
                                >
                                    {data[cell.row.id].status.time}
                                </Typography>
                            </div>
                        </div>
                    )}
                    {activeModalRowEdit == cell.row.id ? (
                        <EditTokenModal
                            type={type}
                            data={data[cell.row.id]}
                            openModal={openModalEdit}
                            setOpenModal={setOpenModalEdit}
                            onClose={() => {
                                setActiveModalRowEdit("");
                            }}
                            setData={setData}
                            refetch={refetch}
                        />
                    ) : null}
                    {cell.column.id == "actions" && (
                        <div className="tokens_single_data_status_container">
                            <div className="tokens_single_data_indiv_button">
                                <Button text="Edit" image="/edit.svg" onClick={() => {
                                    onClickEdit(cell.row.id, data[cell.row.id].address, data[cell.row.id].asset.name);
                                }} />
                            </div>
                            <div className="tokens_single_data_indiv_button">
                                <Button
                                    image={'/delete.svg'}
                                    onClick={() => {
                                        onClickDelete(cell.row.id);
                                    }}
                                />
                                {activeModalRowDelete == cell.row.id ? (
                                    <SelectionModal
                                        enableText="Confirm"
                                        disableText="Cancel"
                                        onClickBoolean={(val: boolean) => {
                                            setActiveModalRowDelete("");
                                        }}
                                        openModal={openModalDelete}
                                        setOpenModal={setOpenModalDelete}
                                        text="Do you want to delete the Token Safeguard?"
                                        tokenType={ETHEREUM_TOKEN_STANDARD.ERC20}
                                        safeGuardId={data[cell.row.id].safeguardID}
                                        refetch={refetch}
                                    />
                                ) : null}
                            </div>
                            <div className="tokens_single_data_indiv_button">
                                <SimpleButton
                                    type={approveRes.isSuccess || data[cell.row.id].isApproved ? "default" : "primary"}
                                    onClick={() => {
                                        approveAssetTrigger.write?.()
                                    }}
                                    disabled={approveRes.isLoading}>
                                    {getApprovalText()}
                                </SimpleButton>
                            </div>
                        </div>
                    )}
                    {cell.value && (
                        <Typography
                            {...TextStyle.secondaryTextColorExtraSmallLabel}
                            {...TextStyle.opacity}
                        >
                            {cell.value}
                        </Typography>
                    )}
                </td>
            ))}
        </tr>
    )
}