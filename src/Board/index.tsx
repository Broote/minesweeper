import React, { FunctionComponent, MouseEvent } from 'react';
import styled from 'styled-components';

import Cell from '../Cell';
import Head from '../Head';
import { CellValueType } from '../interfaces/cell.type';
import { CellPositionEnum, GameStatusEnum, ICellMeta, ICells } from '../interfaces/state.interface';
import { generateKeyByCoordinates, getCoordinatesByIndex } from '../utils';

interface IProps {
    readonly width: number;
    readonly height: number;
    readonly lastClick: [number, number] | null;
    readonly gameStatus: GameStatusEnum;
    readonly isMoveInProgress: boolean;
    readonly isHeadPressed: boolean;
    readonly cells: ICells;
    readonly onReset: () => void;
    readonly onPressHead: () => void;
    readonly onUnpressHead: () => void;
    readonly onCellClickStart: ([x, y]: [number, number]) => void;
    readonly onCellClickFinish: ([x, y]: [number, number]) => void;
    readonly onCellMouseLeave: ([x, y]: [number, number]) => void;
    readonly onCellRightClick: ([x, y]: [number, number]) => void;
}

interface IStyledFields {
    readonly width: number;
    readonly height: number;
}

const StyledContainer = styled.div`
    display: inline-block;
    background-color: #bdbdbd;
    padding: 6px;
    border-top: 2px solid #ffffff;
    border-left: 2px solid #ffffff;
    border-right: 2px solid #7b7b7b;
    border-bottom: 2px solid #7b7b7b;
`;

const StyledTop = styled.div`
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    background-color: #c0c0c0;
    margin-bottom: 6px;
    border-top: 2px solid #7b7b7b;
    border-left: 2px solid #7b7b7b;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
`;

const StyledHeadContainer = styled.div``;

const StyledFieldsContainer = styled.div`
    display: inline-block;
    border-top: 2px solid #7b7b7b;
    border-left: 2px solid #7b7b7b;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
`;

const StyledFields = styled.div<IStyledFields>`
    display: inline-grid;
    grid-template-columns: ${({ width }) => `repeat(${width}, 16px)`};
    grid-template-rows: ${({ height }) => `repeat(${height}, 16px)`};
`;

const getValueByMeta = (cellMeta: ICellMeta, lastClick: [number, number] | null): CellValueType => {
    if (cellMeta.position === CellPositionEnum.CLOSED) {
        return 'closed';
    }

    if (cellMeta.position === CellPositionEnum.FLAGGED) {
        return 'flagged';
    }

    if (cellMeta.position === CellPositionEnum.PRESSED) {
        return 'pressed';
    }

    if (lastClick !== null) {
        const [x, y] = lastClick;
        const isLastClickThisCell = x === cellMeta.x && y === cellMeta.y;

        if (cellMeta.hasMine && isLastClickThisCell) {
            return 'hit';
        }

        if (cellMeta.hasMine) {
            return 'mined';
        }
    }

    return cellMeta.value;
};

const Board: FunctionComponent<IProps> = ({
    width,
    height,
    lastClick,
    isMoveInProgress,
    gameStatus,
    isHeadPressed,
    cells,
    onReset,
    onPressHead,
    onUnpressHead,
    onCellClickStart,
    onCellClickFinish,
    onCellMouseLeave,
    onCellRightClick,
}) => {
    return (
        <StyledContainer>
            <StyledTop>
                <StyledHeadContainer
                    onMouseDown={onPressHead}
                    onMouseUp={onReset}
                    onMouseLeave={onUnpressHead}
                >
                    <Head
                        gameStatus={gameStatus}
                        isMoveInProgress={isMoveInProgress}
                        isHeadPressed={isHeadPressed}
                    />
                </StyledHeadContainer>
            </StyledTop>
            <StyledFieldsContainer>
                <StyledFields width={width} height={height}>
                    {Array(width * height)
                        .fill(null)
                        .map((_, index) => {
                            const [x, y] = getCoordinatesByIndex(index, width);
                            const key = generateKeyByCoordinates([x, y]);
                            const cellMeta = cells[key];
                            return (
                                <div
                                    key={key}
                                    onMouseDown={() => onCellClickStart([x, y])}
                                    onMouseUp={(e: MouseEvent<HTMLDivElement>) => {
                                        const isRightClick = e.button === 2;
                                        if (isRightClick || !isMoveInProgress) {
                                            return;
                                        }
                                        onCellClickFinish([x, y]);
                                    }}
                                    onMouseLeave={() => onCellMouseLeave([x, y])}
                                    onContextMenu={(e: MouseEvent<HTMLDivElement>) => {
                                        e.preventDefault();
                                        onCellRightClick([x, y]);
                                    }}
                                >
                                    <Cell value={getValueByMeta(cellMeta, lastClick)} />
                                </div>
                            );
                        })}
                </StyledFields>
            </StyledFieldsContainer>
        </StyledContainer>
    );
};

export default Board;
