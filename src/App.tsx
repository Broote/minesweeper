import React, { useReducer } from 'react';
import styled from 'styled-components';

import Board from './Board';
import Settings from './Settings';

import { INITIAL_HEIGHT, INITIAL_WIDTH, INITIAL_MINES_NUMBER } from './constants';
import { IState, GameStatusEnum, CellPositionEnum, BoardType } from './interfaces/state.interface';
import { generateBoard, openCell, getNeighbors } from './utils';

const [initialBoard, reservedMineCoordinates] = generateBoard({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    minesNumber: INITIAL_MINES_NUMBER,
});

const initialCellsPositions = initialBoard.map((column) =>
    column.map((_) => CellPositionEnum.CLOSED)
);

const initialState: IState = {
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    minesNumber: INITIAL_MINES_NUMBER,
    minesLeft: INITIAL_MINES_NUMBER,
    gameStatus: GameStatusEnum.IN_PROGRESS,
    lastClick: null,
    isMoveInProgress: false,
    isHeadPressed: false,
    reservedMineCoordinates,
    board: initialBoard,
    cellsPositions: initialCellsPositions,
};

interface IClickStartAction {
    readonly type: 'CLICK_START';
    readonly payload: [number, number];
}

interface IClickFinishAction {
    readonly type: 'CLICK_FINISH';
    readonly payload: [number, number];
}

interface IMouseLeaveAction {
    readonly type: 'MOUSE_LEAVE';
    readonly payload: [number, number];
}

interface IRightClickAction {
    readonly type: 'RIGHT_CLICK';
    readonly payload: [number, number];
}

interface IPressHeadAction {
    readonly type: 'PRESS_HEAD';
}

interface IUnpressHeadAction {
    readonly type: 'UNPRESS_HEAD';
}

interface IResetAction {
    readonly type: 'RESET';
}

interface IStartGameAction {
    readonly type: 'START_GAME';
    readonly payload: {
        readonly width: number;
        readonly height: number;
        readonly minesNumber: number;
    };
}

type ActionType =
    | IClickStartAction
    | IClickFinishAction
    | IMouseLeaveAction
    | IRightClickAction
    | IPressHeadAction
    | IUnpressHeadAction
    | IResetAction
    | IStartGameAction;

const reducer = (state: IState, action: ActionType) => {
    switch (action.type) {
        case 'CLICK_START': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellPosition = state.cellsPositions[x][y];
            if (
                cellPosition === CellPositionEnum.OPENED ||
                cellPosition === CellPositionEnum.FLAGGED
            ) {
                return { ...state };
            }

            const cellsPositionsCopy = state.cellsPositions.map((column) => column.slice());
            cellsPositionsCopy[x][y] = CellPositionEnum.PRESSED;

            return {
                ...state,
                isMoveInProgress: true,
                cellsPositions: cellsPositionsCopy,
            };
        }
        case 'CLICK_FINISH': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellPosition = state.cellsPositions[x][y];
            if (
                cellPosition === CellPositionEnum.OPENED ||
                cellPosition === CellPositionEnum.FLAGGED
            ) {
                return { ...state };
            }

            const isFirstMove = state.lastClick === null;
            const isLose = state.board[x][y] === 9;

            if (isFirstMove && isLose) {
                const { width, height } = state;
                const boardCopy: BoardType = state.board.map((column) => column.slice());
                const [i, j] = state.reservedMineCoordinates;

                boardCopy[i][j] = 9;
                boardCopy[x][y] = 0;

                const neighborsIJ = getNeighbors({ x: i, y: j, width, height });
                neighborsIJ.forEach(([ii, jj]) => {
                    if (boardCopy[ii][jj] !== 9) {
                        boardCopy[ii][jj] += 1;
                    }
                });

                const neighborsXY = getNeighbors({ x, y, width, height });
                neighborsXY.forEach(([xx, yy]) => {
                    if (boardCopy[xx][yy] === 9) {
                        boardCopy[x][y] += 1;
                    } else {
                        boardCopy[xx][yy] -= 1;
                    }
                });

                const newCellsPositions = openCell(
                    [x, y],
                    boardCopy,
                    state.cellsPositions,
                    state.width,
                    state.height
                );

                return {
                    ...state,
                    board: boardCopy,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    cellsPositions: newCellsPositions,
                };
            }

            if (isLose) {
                const mines: string[] = [];
                state.board.forEach((column, i) => {
                    column.forEach((cell, j) => {
                        if (cell === 9) {
                            mines.push([i, j].toString());
                        }
                    });
                });

                const newCellsPositions = state.cellsPositions.map((column, i) =>
                    column.map((cell, j) =>
                        mines.includes([i, j].toString()) && cell !== CellPositionEnum.FLAGGED
                            ? CellPositionEnum.OPENED
                            : cell
                    )
                );

                return {
                    ...state,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    gameStatus: GameStatusEnum.LOSE,
                    cellsPositions: newCellsPositions,
                };
            }

            const newCellsPositions = openCell(
                [x, y],
                state.board,
                state.cellsPositions,
                state.width,
                state.height
            );

            const isWin = newCellsPositions.every((column, i) =>
                column.every(
                    (cell, j) =>
                        [CellPositionEnum.OPENED, CellPositionEnum.FLAGGED].includes(cell) ||
                        state.board[i][j] === 9
                )
            );

            if (isWin) {
                const winCellsPositions = newCellsPositions.map((column, i) =>
                    column.map((cell, j) =>
                        state.board[i][j] === 9 ? CellPositionEnum.FLAGGED : cell
                    )
                );

                return {
                    ...state,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    gameStatus: GameStatusEnum.WIN,
                    cellsPositions: winCellsPositions,
                };
            }

            return {
                ...state,
                isMoveInProgress: false,
                lastClick: action.payload,
                cellsPositions: newCellsPositions,
            };
        }
        case 'MOUSE_LEAVE': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellPosition = state.cellsPositions[x][y];
            if (cellPosition !== CellPositionEnum.PRESSED) {
                return { ...state };
            }

            const cellsPositionsCopy = state.cellsPositions.map((column) => column.slice());
            cellsPositionsCopy[x][y] = CellPositionEnum.CLOSED;

            return {
                ...state,
                isMoveInProgress: false,
                cellsPositions: cellsPositionsCopy,
            };
        }
        case 'RIGHT_CLICK': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellPosition = state.cellsPositions[x][y];
            if (cellPosition === CellPositionEnum.OPENED) {
                return { ...state };
            }

            const isCurrentFlagged = cellPosition === CellPositionEnum.FLAGGED;

            if (!isCurrentFlagged && state.minesLeft === 0) {
                return { ...state };
            }

            const cellsPositionsCopy = state.cellsPositions.map((column) => column.slice());
            cellsPositionsCopy[x][y] = isCurrentFlagged
                ? CellPositionEnum.CLOSED
                : CellPositionEnum.FLAGGED;

            return {
                ...state,
                lastClick: action.payload,
                minesNumber: isCurrentFlagged ? state.minesLeft - 1 : state.minesLeft + 1,
                cellsPositions: cellsPositionsCopy,
            };
        }
        case 'START_GAME': {
            const {
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
            } = action.payload;

            const [newBoard, reservedMineCoordinates] = generateBoard({
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
            });

            return {
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
                minesLeft: newMinesNumber,
                gameStatus: GameStatusEnum.IN_PROGRESS,
                lastClick: null,
                isMoveInProgress: false,
                isHeadPressed: false,
                reservedMineCoordinates,
                board: newBoard,
                cellsPositions: newBoard.map((column) =>
                    column.map((_) => CellPositionEnum.CLOSED)
                ),
            };
        }
        case 'RESET': {
            const [newBoard, reservedMineCoordinates] = generateBoard({
                width: state.width,
                height: state.height,
                minesNumber: state.minesNumber,
            });

            return {
                ...state,
                minesLeft: state.minesNumber,
                gameStatus: GameStatusEnum.IN_PROGRESS,
                lastClick: null,
                isMoveInProgress: false,
                isHeadPressed: false,
                reservedMineCoordinates,
                board: newBoard,
                cellsPositions: newBoard.map((column) =>
                    column.map((_) => CellPositionEnum.CLOSED)
                ),
            };
        }
        case 'PRESS_HEAD': {
            return { ...state, isHeadPressed: true };
        }
        case 'UNPRESS_HEAD': {
            return { ...state, isHeadPressed: false };
        }
        default: {
            return { ...state };
        }
    }
};

const StyledContainer = styled.div`
    padding: 30px;
    font-family: 'Nunito Sans', sans-serif;
    display: flex;
`;

const StyledSettingsContainer = styled.div`
    margin-top: 4px;
    margin-right: 32px;
`;

const StyledBoardContainer = styled.div``;

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StyledContainer>
            <StyledSettingsContainer>
                <Settings
                    onStart={({ width, height, minesNumber }) => {
                        dispatch({ type: 'START_GAME', payload: { width, height, minesNumber } });
                    }}
                />
            </StyledSettingsContainer>
            <StyledBoardContainer>
                <Board
                    width={state.width}
                    height={state.height}
                    lastClick={state.lastClick}
                    gameStatus={state.gameStatus}
                    isMoveInProgress={state.isMoveInProgress}
                    isHeadPressed={state.isHeadPressed}
                    cellsPositions={state.cellsPositions}
                    board={state.board}
                    onReset={() => {
                        dispatch({ type: 'RESET' });
                    }}
                    onPressHead={() => {
                        dispatch({ type: 'PRESS_HEAD' });
                    }}
                    onUnpressHead={() => {
                        dispatch({ type: 'UNPRESS_HEAD' });
                    }}
                    onCellClickStart={([x, y]: [number, number]) => {
                        dispatch({ type: 'CLICK_START', payload: [x, y] });
                    }}
                    onCellClickFinish={([x, y]: [number, number]) => {
                        dispatch({ type: 'CLICK_FINISH', payload: [x, y] });
                    }}
                    onCellMouseLeave={([x, y]: [number, number]) => {
                        dispatch({ type: 'MOUSE_LEAVE', payload: [x, y] });
                    }}
                    onCellRightClick={([x, y]: [number, number]) => {
                        dispatch({ type: 'RIGHT_CLICK', payload: [x, y] });
                    }}
                />
            </StyledBoardContainer>
        </StyledContainer>
    );
}

export default App;
