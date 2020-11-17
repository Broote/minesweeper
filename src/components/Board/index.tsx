import React, { FunctionComponent, MouseEvent } from 'react';
import styled from 'styled-components';

import Cell from '../Cell';
import Head from '../Head';
import MinesCounter from '../MinesCounter';

import { CellValueType } from '../../interfaces/cell.type';
import {
    BoardCellType,
    BoardType,
    CellPositionEnum,
    GameStatusEnum,
} from '../../interfaces/state.interface';

import { MINE_VALUE } from '../../constants';

interface IProps {
    readonly width: number;
    readonly height: number;
    readonly minesLeft: number;
    readonly lastClick: [number, number] | null;
    readonly gameStatus: GameStatusEnum;
    readonly isMoveInProgress: boolean;
    readonly isHeadPressed: boolean;
    readonly cellsPositions: CellPositionEnum[][];
    readonly board: BoardType;
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
    justify-content: space-between;
    background-color: #c0c0c0;
    margin-bottom: 6px;
    padding: 4px 6px;
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

const getValueByMeta = (
    boardValue: BoardCellType,
    position: CellPositionEnum,
    isLastClickThisCell: boolean
): CellValueType => {
    if (position === CellPositionEnum.CLOSED) {
        return 'closed';
    }

    if (position === CellPositionEnum.FLAGGED) {
        return 'flagged';
    }

    if (position === CellPositionEnum.PRESSED) {
        return 'pressed';
    }

    const hasMine = boardValue === MINE_VALUE;

    if (hasMine && isLastClickThisCell) {
        return 'hit';
    }

    if (hasMine) {
        return 'mined';
    }

    return boardValue as CellValueType;
};

const Board: FunctionComponent<IProps> = ({
    width,
    height,
    minesLeft,
    lastClick,
    isMoveInProgress,
    gameStatus,
    isHeadPressed,
    cellsPositions,
    board,
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
                <MinesCounter minesLeft={minesLeft} />
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
                <div />
            </StyledTop>
            <StyledFieldsContainer>
                <StyledFields width={width} height={height}>
                    {cellsPositions.map((column, x) =>
                        column.map((_, y) => (
                            <div
                                key={[x, y].toString()}
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
                                <Cell
                                    value={getValueByMeta(
                                        board[x][y],
                                        cellsPositions[x][y],
                                        !!(lastClick && lastClick[0] === x && lastClick[1] === y)
                                    )}
                                />
                            </div>
                        ))
                    )}
                </StyledFields>
            </StyledFieldsContainer>
        </StyledContainer>
    );
};

export default Board;
