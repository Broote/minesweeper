import shuffle from 'lodash/shuffle';
import take from 'lodash/take';

import { MINE_VALUE } from '../constants';
import { BoardType, CellPositionEnum } from '../interfaces/state.interface';

interface IGenerateBoardParams {
    readonly width: number;
    readonly height: number;
    readonly minesNumber: number;
}

interface IGetNeighborsParams {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

const getCoordinatesByIndex = (index: number, width: number): [number, number] => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [x, y];
};

export const generateBoard = ({
    width,
    height,
    minesNumber,
}: IGenerateBoardParams): [BoardType, [number, number]] => {
    const area = width * height;

    const randomNumbers = getNRandomNumbers(area, minesNumber + 1);
    const [reservedMinePlace, ...minePlaces] = randomNumbers;
    const mines = new Array(area).fill(null).map((_, index) => minePlaces.includes(index));

    const board: BoardType = mines.reduce(
        (acc, _, index) => {
            const [x, y] = getCoordinatesByIndex(index, width);
            acc[x][y] = mines[index] ? MINE_VALUE : 0;
            return acc;
        },
        new Array(width).fill(null).map(() => new Array(height).fill(0))
    );

    board.forEach((column, i) => {
        column.forEach((_, j) => {
            if (board[i][j] === MINE_VALUE) {
                return;
            }

            const neighbors = getNeighbors({ x: i, y: j, width, height });
            neighbors.forEach(([x, y]) => {
                if (board[x][y] === MINE_VALUE) {
                    board[i][j] += 1;
                }
            });
        });
    });

    const reservedMineCoordinates = getCoordinatesByIndex(reservedMinePlace, width);

    return [board, reservedMineCoordinates];
};

const getNRandomNumbers = (max: number, n: number): number[] =>
    take(shuffle(new Array(max).fill(null).map((_, index) => index)), n);

export const getNeighbors = ({ x, y, width, height }: IGetNeighborsParams): [number, number][] => {
    const result = [] as [number, number][];
    if (x > 0) {
        result.push([x - 1, y]);
    }

    if (x > 0 && y > 0) {
        result.push([x - 1, y - 1]);
    }

    if (x > 0 && y < height - 1) {
        result.push([x - 1, y + 1]);
    }

    if (y > 0) {
        result.push([x, y - 1]);
    }

    if (y < height - 1) {
        result.push([x, y + 1]);
    }

    if (x < width - 1) {
        result.push([x + 1, y]);
    }

    if (x < width - 1 && y > 0) {
        result.push([x + 1, y - 1]);
    }

    if (x < width - 1 && y < height - 1) {
        result.push([x + 1, y + 1]);
    }

    return result;
};

export const openCell = (
    [x, y]: [number, number],
    board: BoardType,
    cellsPositions: CellPositionEnum[][],
    width: number,
    height: number
): CellPositionEnum[][] => {
    const cellPosition = cellsPositions[x][y];

    if (cellPosition === CellPositionEnum.OPENED || cellPosition === CellPositionEnum.FLAGGED) {
        return cellsPositions;
    }

    const visited = board.map((column) => column.map(() => false));

    makeCellsListToOpen(visited, [x, y], board, width, height);

    return cellsPositions.map((column, i) =>
        column.map((cell, j) => (visited[i][j] ? CellPositionEnum.OPENED : cell))
    );
};

const makeCellsListToOpen = (
    visited: boolean[][],
    [x, y]: [number, number],
    board: BoardType,
    width: number,
    height: number
) => {
    if (visited[x][y]) {
        return;
    }

    visited[x][y] = true;

    if (board[x][y] !== 0) {
        return;
    }

    const neighbors = getNeighbors({ x, y, width, height });

    neighbors.forEach(([nx, ny]) => {
        makeCellsListToOpen(visited, [nx, ny], board, width, height);
    });
};

// 1    => 001
// 12   => 012
// 123  => 123
// 1234 => 234
export const prependTwoZeros = (index: number | string): string =>
    `00${index}`.slice(-3);
