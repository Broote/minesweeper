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

interface IOpenCellParams {
    readonly coordinates: [number, number];
    readonly board: BoardType;
    readonly cellsPositions: CellPositionEnum[][];
    readonly width: number;
    readonly height: number;
}

interface IMakeCellsListToOpenParams {
    readonly acc: [number, number][];
    readonly visited: boolean[][];
    readonly board: BoardType;
    readonly width: number;
    readonly height: number;
}

// 1    => 001
// 12   => 012
// 123  => 123
// 1234 => 234
export const prependTwoZeros = (index: number | string): string => `00${index}`.slice(-3);

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

export const openCell = ({
    coordinates: [x, y],
    board,
    cellsPositions,
    width,
    height,
}: IOpenCellParams): CellPositionEnum[][] => {
    const cellPosition = cellsPositions[x][y];

    if (cellPosition === CellPositionEnum.OPENED || cellPosition === CellPositionEnum.FLAGGED) {
        return cellsPositions;
    }

    const visited = board.map((column) => column.map(() => false));

    const cellsToExplore = [[x, y]] as [number, number][];

    while (cellsToExplore.length > 0) {
        makeCellsListToOpen({ acc: cellsToExplore, visited, board, width, height });
    }

    return cellsPositions.map((column, i) =>
        column.map((cell, j) => (visited[i][j] ? CellPositionEnum.OPENED : cell))
    );
};

const makeCellsListToOpen = ({
    acc,
    visited,
    board,
    width,
    height,
}: IMakeCellsListToOpenParams) => {
    const [x, y] = acc.pop() as [number, number];

    if (visited[x][y]) {
        return;
    }

    visited[x][y] = true;

    if (board[x][y] !== 0) {
        return;
    }

    const notVisitedNeighbors = getNeighbors({ x, y, width, height }).filter(
        ([x, y]) => !visited[x][y]
    );

    acc.push(...notVisitedNeighbors);
};

const getNRandomNumbers = (max: number, n: number): number[] =>
    take(shuffle(new Array(max).fill(null).map((_, index) => index)), n);

const getCoordinatesByIndex = (index: number, width: number): [number, number] => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [x, y];
};
