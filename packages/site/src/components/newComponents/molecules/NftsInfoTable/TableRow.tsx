import React, { useEffect } from 'react';
import { Tag } from '../../atoms/Tag';
import { AssetGuard, AssetGuards, updateAssetProperties } from "../../../../hooks/Assets/useAssetGuards";
import { AvatarId } from "../../atoms/AvatarId";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import { Color, Spacing, TextStyle } from "../../globalStyles";
import { EditTokenModal } from "../EditTokenModal";
import { IDContainer } from "../TokensInfoTable/styles";
import { Typography } from "@mui/material";
import { SelectionButton } from "../../../SelectionButton";
import { SelectionModal } from "../SelectionModal";
import { ETHEREUM_TOKEN_STANDARD } from "../../../../constants";
import { approve721 } from "../../../../blockchain/functions";
import { useData } from "../../../../hooks/DataContext";
import { Address, useWaitForTransaction } from "wagmi";
import { SimpleButton } from '../../../SimpleButton';

export interface TableRowProps {
    row: any;
    data: AssetGuard[]
    setData: React.Dispatch<React.SetStateAction<AssetGuards>>;
    type: string;
    openModalEdit: boolean
    setOpenModalEdit: (boolean) => void
    activeModalRowEdit: string
    setActiveModalRowEdit: (string) => void
    refetch: () => void
    activeModalRow: string
    openModal: boolean
    setOpenModal: (boolean) => void
    handleOpenModal: (string) => void
}

export const TableRow = (props: TableRowProps) => {

    const {
        row,
        data,
        setData,
        type,
        openModalEdit,
        setOpenModalEdit,
        activeModalRowEdit,
        setActiveModalRowEdit,
        refetch,
        activeModalRow,
        openModal,
        setOpenModal,
        handleOpenModal,
    } = props;

    const { state } = useData();

    const makeApproveAssetTrigger = (row) => {
        return approve721({
            to: row.address,
            saferootAddress: state.deployedSaferootAddress as Address,
            tokenId: row.tokenId
        })

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
            updateAssetProperties(setData, "ERC721Assets", { address: data[row.id]?.address, tokenId: data[row.id]?.tokenId }, { isApproved: true })
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
                            padding: Spacing.tableHeaderBottomPadding,
                        },
                    })}
                >
                    {cell.column.id.toLowerCase() == "nft" && (
                        <IDContainer>
                            <AvatarId id={data[cell.row.id].asset.name} image={data[cell.row.id].asset.image}></AvatarId>
                        </IDContainer>
                    )}
                    {cell.column.id.toLowerCase() == "security" && (
                        <SecurityInfo
                            data={data[cell.row.id]}
                            onClick={() => { setOpenModalEdit(true); setActiveModalRowEdit(cell.row.id); }}
                        />
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
                    {cell.column.id == "actions" && (
                        <div className="tokens_single_data_status_container">
                            <div className="tokens_single_data_indiv_button">
                                <SimpleButton
                                    type={data[cell.row.id].safeguards[0].enabled ? "default" : "primary"}
                                    onClick={() => {
                                        handleOpenModal(cell.row.id);
                                    }}
                                >
                                    {data[cell.row.id].safeguards[0].enabled ? "Disable" : "Enable"}
                                </SimpleButton>
                                {activeModalRow == cell.row.id && openModal ? (
                                    <SelectionModal
                                        onClickBoolean={(val: boolean) => {
                                            setOpenModal(false);
                                        }}
                                        openModal={openModal}
                                        setOpenModal={setOpenModal}
                                        text={`Do you want to ${data[cell.row.id].safeguards[0].enabled ? "disable" : "enable"} protection for this NFT?`}
                                        enableText="Confirm"
                                        disableText="Cancel"
                                        tokenType={ETHEREUM_TOKEN_STANDARD.ERC721}
                                        safeGuardId={data[cell.row.id].safeguardID}
                                        enabled={!data[cell.row.id].safeguards[0].enabled}
                                        refetch={refetch}
                                    />
                                ) : null}
                            </div>
                            <div className="tokens_single_data_indiv_button">
                            <SimpleButton
                                    type={approveRes.isSuccess ? "default" : "primary"}
                                    onClick={() => {
                                        approveAssetTrigger.write?.()
                                    }}
                                    disabled={approveRes.isLoading || data[cell.row.id].isApproved }>
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