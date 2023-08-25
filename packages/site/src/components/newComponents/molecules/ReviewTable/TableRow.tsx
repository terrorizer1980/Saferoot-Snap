import { Address, useWaitForTransaction } from "wagmi";
import { useData } from "../../../../hooks/DataContext";
import { approve, approve721 } from "../../../../blockchain/functions";
import { ethers } from "ethers";
import { Spacing } from "../../globalStyles";
import { IDContainer, TokenIDContainer } from "./styles";
import { CoinId } from "../../atoms/CoinId";
import { AvatarId } from "../../atoms/AvatarId";
import { SecurityInfo } from "../../atoms/SecurityInfo";
import { SimpleButton } from "../../../SimpleButton";
import { useEffect } from "react";
import { updateAssetProperties } from "../../../../hooks/Assets/useAssetGuards";
import { AssetGuard } from "../../../../hooks/Assets/types";

export interface TableRowProps {
    row: any;
    data: AssetGuard
    setData: React.Dispatch<React.SetStateAction<Object[]>>;
}

export const TableRow = (props: TableRowProps) => {

    const { row, data, setData } = props;
    const { state } = useData();

    const makeApproveAssetTrigger = (row) => {
        if (row.tokenId) {
            return approve721({
                to: row.address,
                saferootAddress: state.deployedSaferootAddress as Address,
                tokenId: row.tokenId
            })
        } else {
            return approve({
                tokenAddress: row.address,
                saferootAddress: state.deployedSaferootAddress as Address,
                amount: ethers.constants.MaxUint256.toString()
            });
        }
    }


    const approveAssetTrigger = makeApproveAssetTrigger(data[row.id]);
    const { isLoading, isSuccess, isError } = useWaitForTransaction({ hash: approveAssetTrigger.data?.hash })

    const getApprovalText = () => {
        switch (true) {
            case isLoading:
                return "Approving...";
            case isSuccess:
                return "Approved";
            case isError:
                return "Failed"
            default:
                return "Approved";
        }
    }

    useEffect(() => {
        if (isSuccess) {
            if (data[row.id].tokenId) {
                updateAssetProperties(setData, "ERC721Assets", { address: data[row.id]?.address, tokenId: data[row.id]?.tokenId }, { isApproved: true })
            } else {
                updateAssetProperties(setData, "ERC20Assets", { address: data[row.id]?.address }, { isApproved: true })
            }
        }
    }, [isSuccess])

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
                        },
                    })}
                >
                    {data[cell.row.id].collection ?
                        cell.column.id.toLowerCase() == "asset" && (
                            <TokenIDContainer>
                                <CoinId
                                    id={data[cell.row.id].asset.name}
                                ></CoinId>
                            </TokenIDContainer>
                        ) :
                        cell.column.id.toLowerCase() == "asset" && (
                            <IDContainer>
                                <AvatarId
                                    id={data[cell.row.id].asset.name}
                                    image={data[cell.row.id].asset.image}
                                ></AvatarId>
                            </IDContainer>
                        )
                    }
                    {cell.column.id.toLowerCase() == "security" && (
                        <SecurityInfo
                            data={data[cell.row.id]}
                            openModal={false}
                            setOpenModal={() => { }}
                            refetch={() => { }}
                        />
                    )}
                    {cell.column.id.toLowerCase() == "approval" && (
                        <div className="tokens_single_data_indiv_button">
                            <SimpleButton
                                type={isSuccess ? "default" : "primary"}
                                onClick={() => {
                                    approveAssetTrigger.write?.()
                                }}
                                disabled={isLoading || isSuccess}>
                                {getApprovalText()}
                            </SimpleButton>
                        </div>
                    )}
                </td>
            ))}
        </tr>
    );
};