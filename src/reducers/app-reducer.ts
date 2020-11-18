import { MINE_VALUE } from '../constants';
import { IState, GameStatusEnum, CellPositionEnum, BoardType } from '../interfaces/state.interface';
import { generateBoard, openCell, getNeighbors } from '../utils';

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

export const reducer = (state: IState, action: ActionType): IState => {
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
            const gameStartedAt = isFirstMove ? Date.now() : state.gameStartedAt;
            const isLose = state.board[x][y] === MINE_VALUE;

            if (isFirstMove && isLose) {
                const { width, height } = state;
                const boardCopy: BoardType = state.board.map((column) => column.slice());
                const [i, j] = state.reservedMineCoordinates;

                boardCopy[i][j] = MINE_VALUE;

                const neighborsIJ = getNeighbors({ x: i, y: j, width, height });
                neighborsIJ.forEach(([ii, jj]) => {
                    if (boardCopy[ii][jj] !== MINE_VALUE) {
                        boardCopy[ii][jj] += 1;
                    }
                });

                boardCopy[x][y] = 0;

                const neighborsXY = getNeighbors({ x, y, width, height });
                neighborsXY.forEach(([xx, yy]) => {
                    if (boardCopy[xx][yy] === MINE_VALUE) {
                        boardCopy[x][y] += 1;
                    } else {
                        boardCopy[xx][yy] -= 1;
                    }
                });

                const newCellsPositions = openCell({
                    coordinates: [x, y],
                    board: boardCopy,
                    cellsPositions: state.cellsPositions,
                    width: state.width,
                    height: state.height,
                });

                return {
                    ...state,
                    gameStatus: GameStatusEnum.IN_PROGRESS,
                    gameStartedAt,
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
                        if (cell === MINE_VALUE) {
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

            const newCellsPositions = openCell({
                coordinates: [x, y],
                board: state.board,
                cellsPositions: state.cellsPositions,
                width: state.width,
                height: state.height,
            });

            const isWin = newCellsPositions.every((column, i) =>
                column.every(
                    (cell, j) =>
                        [CellPositionEnum.OPENED, CellPositionEnum.FLAGGED].includes(cell) ||
                        state.board[i][j] === MINE_VALUE
                )
            );

            if (isWin) {
                const winCellsPositions = newCellsPositions.map((column, i) =>
                    column.map((cell, j) =>
                        state.board[i][j] === MINE_VALUE ? CellPositionEnum.FLAGGED : cell
                    )
                );

                return {
                    ...state,
                    minesLeft: 0,
                    isMoveInProgress: false,
                    lastClick: action.payload,
                    gameStatus: GameStatusEnum.WIN,
                    cellsPositions: winCellsPositions,
                };
            }

            return {
                ...state,
                gameStatus: GameStatusEnum.IN_PROGRESS,
                gameStartedAt,
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
                isMoveInProgress: false,
                lastClick: action.payload,
                minesLeft: isCurrentFlagged ? state.minesLeft + 1 : state.minesLeft - 1,
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
                gameStartedAt: null,
                width: newWidth,
                height: newHeight,
                minesNumber: newMinesNumber,
                minesLeft: newMinesNumber,
                gameStatus: GameStatusEnum.NOT_STARTED,
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
                gameStatus: GameStatusEnum.NOT_STARTED,
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
