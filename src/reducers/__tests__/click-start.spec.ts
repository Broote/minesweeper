import { BoardType, CellPositionEnum, GameStatusEnum } from '../../interfaces/state.interface';
import { reducer } from '../app-reducer';

describe('CLICK_START action', function () {
    it('presses unopened cell', () => {
        const state = {
            width: 3,
            height: 3,
            minesNumber: 2,
            minesLeft: 2,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            lastClick: null,
            isMoveInProgress: false,
            isHeadPressed: false,
            reservedMineCoordinates: [2, 2] as [number, number],
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ] as BoardType,
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
            ] as CellPositionEnum[][],
            gameStartedAt: null,
        };
        const action = { type: 'CLICK_START' as any, payload: [2, 1] as [number, number] };
        expect(reducer(state, action)).toEqual({
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ],
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'pressed', 'closed'],
            ],
            gameStartedAt: null,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            height: 3,
            isHeadPressed: false,
            isMoveInProgress: true,
            lastClick: null,
            minesLeft: 2,
            minesNumber: 2,
            reservedMineCoordinates: [2, 2],
            width: 3,
        });
    });

    it('do nothing with opened cell', () => {
        const state = {
            width: 3,
            height: 3,
            minesNumber: 2,
            minesLeft: 2,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            lastClick: null,
            isMoveInProgress: false,
            isHeadPressed: false,
            reservedMineCoordinates: [2, 2] as [number, number],
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ] as BoardType,
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'opened', 'closed'],
            ] as CellPositionEnum[][],
            gameStartedAt: null,
        };
        const action = { type: 'CLICK_START' as any, payload: [2, 1] as [number, number] };
        expect(reducer(state, action)).toEqual({
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ],
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'opened', 'closed'],
            ],
            gameStartedAt: null,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            height: 3,
            isHeadPressed: false,
            isMoveInProgress: false,
            lastClick: null,
            minesLeft: 2,
            minesNumber: 2,
            reservedMineCoordinates: [2, 2],
            width: 3,
        });
    });

    it('do nothing with flagged cell', () => {
        const state = {
            width: 3,
            height: 3,
            minesNumber: 2,
            minesLeft: 2,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            lastClick: null,
            isMoveInProgress: false,
            isHeadPressed: false,
            reservedMineCoordinates: [2, 2] as [number, number],
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ] as BoardType,
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'flagged', 'closed'],
            ] as CellPositionEnum[][],
            gameStartedAt: null,
        };
        const action = { type: 'CLICK_START' as any, payload: [2, 1] as [number, number] };
        expect(reducer(state, action)).toEqual({
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ],
            cellsPositions: [
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
                ['closed', 'flagged', 'closed'],
            ],
            gameStartedAt: null,
            gameStatus: GameStatusEnum.IN_PROGRESS,
            height: 3,
            isHeadPressed: false,
            isMoveInProgress: false,
            lastClick: null,
            minesLeft: 2,
            minesNumber: 2,
            reservedMineCoordinates: [2, 2],
            width: 3,
        });
    });

    it('do nothing if user lost', () => {
        const state = {
            width: 3,
            height: 3,
            minesNumber: 2,
            minesLeft: 2,
            gameStatus: GameStatusEnum.LOSE,
            lastClick: null,
            isMoveInProgress: false,
            isHeadPressed: false,
            reservedMineCoordinates: [2, 2] as [number, number],
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ] as BoardType,
            cellsPositions: [
                ['closed', 'opened', 'opened'],
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
            ] as CellPositionEnum[][],
            gameStartedAt: null,
        };
        const action = { type: 'CLICK_START' as any, payload: [2, 1] as [number, number] };
        expect(reducer(state, action)).toEqual({
            board: [
                [1, 9, 1],
                [2, 2, 1],
                [9, 1, 0],
            ],
            cellsPositions: [
                ['closed', 'opened', 'opened'],
                ['closed', 'closed', 'closed'],
                ['closed', 'closed', 'closed'],
            ],
            gameStartedAt: null,
            gameStatus: GameStatusEnum.LOSE,
            height: 3,
            isHeadPressed: false,
            isMoveInProgress: false,
            lastClick: null,
            minesLeft: 2,
            minesNumber: 2,
            reservedMineCoordinates: [2, 2],
            width: 3,
        });
    });
});
