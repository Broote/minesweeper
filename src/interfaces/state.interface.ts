export enum CellPositionEnum {
    CLOSED = 'closed',
    PRESSED = 'pressed',
    OPENED = 'opened',
    FLAGGED = 'flagged',
}

export enum GameStatusEnum {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    WIN = 'won',
    LOSE = 'lost',
}

export type BoardCellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BoardType = BoardCellType[][];

export interface IState {
    readonly width: number;
    readonly height: number;
    readonly minesNumber: number;
    readonly minesLeft: number;
    readonly gameStatus: GameStatusEnum;
    readonly lastClick: [number, number] | null;
    readonly isMoveInProgress: boolean;
    readonly isHeadPressed: boolean;
    readonly reservedMineCoordinates: [number, number];
    readonly board: BoardType;
    readonly cellsPositions: CellPositionEnum[][];
    readonly gameStartedAt: number | null;
}
