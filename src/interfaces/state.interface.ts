import { PossibleNumberType } from './cell.type';

export enum CellPositionEnum {
    CLOSED = 'closed',
    PRESSED = 'pressed',
    OPENED = 'opened',
    FLAGGED = 'flagged',
}

export enum GameStatusEnum {
    IN_PROGRESS = 'in-progress',
    WIN = 'won',
    LOSE = 'lost',
}

export interface ICellMeta {
    readonly x: number;
    readonly y: number;
    readonly hasMine: boolean;
    position: CellPositionEnum;
    value: PossibleNumberType;
}

export interface ICells {
    [key: string]: ICellMeta;
}

export interface IState {
    readonly width: number;
    readonly height: number;
    readonly minesNumber: number;
    readonly gameStatus: GameStatusEnum;
    readonly lastClick: [number, number] | null;
    readonly isMoveInProgress: boolean;
    readonly isHeadPressed: boolean;
    readonly cells: ICells;
}
