import { generateBoard, getNeighbors } from '../board';

jest.mock('../general', () => ({
    getNRandomNumbers: () => {
        return [8, 5, 4, 7, 1, 9];
    },
}));

describe('board utils', function () {
    describe('#generatesBoard', function () {
        it('generates board 3x4', () => {
            const [board, reservedMineCoordinates] = generateBoard({
                width: 3,
                height: 4,
                minesNumber: 5,
            });
            expect(board).toEqual([
                [2, 3, 3, 9],
                [9, 9, 9, 2],
                [3, 9, 3, 1],
            ]);
            expect(reservedMineCoordinates).toEqual([2, 2]);
        });
    });

    describe('#getNeighbors', function () {
        it('gets neighbors for a center cell', () => {
            const neightbors = getNeighbors({
                width: 4,
                height: 5,
                x: 2,
                y: 2,
            });
            expect(neightbors).toEqual([
                [1, 2],
                [1, 1],
                [1, 3],
                [2, 1],
                [2, 3],
                [3, 2],
                [3, 1],
                [3, 3],
            ]);
        });

        it('gets neighbors for a boundary cell', () => {
            const neightbors = getNeighbors({
                width: 4,
                height: 5,
                x: 2,
                y: 0,
            });
            expect(neightbors).toEqual([
                [1, 0],
                [1, 1],
                [2, 1],
                [3, 0],
                [3, 1],
            ]);
        });

        it('gets neighbors for a corner cell', () => {
            const neightbors = getNeighbors({
                width: 4,
                height: 5,
                x: 3,
                y: 4,
            });
            expect(neightbors).toEqual([
                [2, 4],
                [2, 3],
                [3, 3],
            ]);
        });
    });
});
