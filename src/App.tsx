import React, { useReducer } from 'react';
import styled from 'styled-components';

import Board from './Board';
import Settings from './Settings';

import { INITIAL_HEIGHT, INITIAL_WIDTH, INITIAL_MINES_NUMBER } from './constants';
import { IState, GameStatusEnum, CellPositionEnum, ICells } from './interfaces/state.interface';
import { generateCells, generateKeyByCoordinates, recursiveOpenCells } from './utils';

const initialState: IState = {
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    minesNumber: INITIAL_MINES_NUMBER,
    gameStatus: GameStatusEnum.IN_PROGRESS,
    lastClick: null,
    isMoveInProgress: false,
    isHeadPressed: false,
    cells: generateCells({
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
        minesNumber: INITIAL_MINES_NUMBER,
    }),
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
            const cellKey = generateKeyByCoordinates([x, y]);
            const currentCell = state.cells[cellKey];
            if (
                currentCell.position === CellPositionEnum.OPENED ||
                currentCell.position === CellPositionEnum.FLAGGED
            ) {
                return { ...state };
            }
            return {
                ...state,
                isMoveInProgress: true,
                cells: {
                    ...state.cells,
                    [cellKey]: {
                        ...currentCell,
                        position: CellPositionEnum.PRESSED,
                    },
                },
            };
        }
        case 'CLICK_FINISH': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellKey = generateKeyByCoordinates([x, y]);
            const currentCell = state.cells[cellKey];
            if (
                currentCell.position === CellPositionEnum.OPENED ||
                currentCell.position === CellPositionEnum.FLAGGED
            ) {
                return { ...state };
            }

            const isFirstMove = state.lastClick === null;

            const newCells = recursiveOpenCells(
                [x, y],
                state.cells,
                state.width,
                state.height,
                state.minesNumber,
                isFirstMove
            );

            const isLose = newCells[cellKey].hasMine;

            if (isLose) {
                return {
                    ...state,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    gameStatus: GameStatusEnum.LOSE,
                    cells: Object.entries(newCells).reduce((acc, [key, cellMeta]) => {
                        acc[key] = {
                            ...cellMeta,
                            position: cellMeta.hasMine
                                ? CellPositionEnum.OPENED
                                : cellMeta.position,
                        };
                        return acc;
                    }, {} as ICells),
                };
            }

            const isWin = Object.values(newCells).every(
                ({ hasMine, position }) => hasMine || position === CellPositionEnum.OPENED
            );

            if (isWin) {
                return {
                    ...state,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    gameStatus: GameStatusEnum.WIN,
                    cells: Object.entries(newCells).reduce((acc, [key, cellMeta]) => {
                        acc[key] = {
                            ...cellMeta,
                            position: cellMeta.hasMine
                                ? CellPositionEnum.FLAGGED
                                : cellMeta.position,
                        };
                        return acc;
                    }, {} as ICells),
                };
            }

            return {
                ...state,
                isMoveInProgress: false,
                lastClick: action.payload,
                cells: newCells,
            };
        }
        case 'MOUSE_LEAVE': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellKey = generateKeyByCoordinates([x, y]);
            const currentCell = state.cells[cellKey];
            if (currentCell.position !== CellPositionEnum.PRESSED) {
                return { ...state };
            }
            return {
                ...state,
                isMoveInProgress: false,
                cells: {
                    ...state.cells,
                    [cellKey]: {
                        ...currentCell,
                        position: CellPositionEnum.CLOSED,
                    },
                },
            };
        }
        case 'RIGHT_CLICK': {
            const isFinished = [GameStatusEnum.WIN, GameStatusEnum.LOSE].includes(state.gameStatus);
            if (isFinished) {
                return { ...state };
            }
            const [x, y] = action.payload;
            const cellKey = generateKeyByCoordinates([x, y]);
            const currentCell = state.cells[cellKey];
            if (currentCell.position === CellPositionEnum.OPENED) {
                return { ...state };
            }
            return {
                ...state,
                lastClick: action.payload,
                cells: {
                    ...state.cells,
                    [cellKey]: {
                        ...currentCell,
                        position:
                            currentCell.position === CellPositionEnum.FLAGGED
                                ? CellPositionEnum.CLOSED
                                : CellPositionEnum.FLAGGED,
                    },
                },
            };
        }
        case 'START_GAME': {
            const {
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
            } = action.payload;
            return {
                ...state,
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
                gameStatus: GameStatusEnum.IN_PROGRESS,
                lastClick: null,
                isMoveInProgress: false,
                isHeadPressed: false,
                cells: generateCells({
                    width: newWidth,
                    height: newHeight,
                    minesNumber: newMinesNumber,
                }),
            };
        }
        case 'RESET': {
            return {
                ...state,
                gameStatus: GameStatusEnum.IN_PROGRESS,
                lastClick: null,
                isMoveInProgress: false,
                isHeadPressed: false,
                cells: generateCells({
                    width: state.width,
                    height: state.height,
                    minesNumber: state.minesNumber,
                }),
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
                    cells={state.cells}
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
