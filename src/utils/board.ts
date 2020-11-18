import { MINE_VALUE } from '../constants';
import { BoardType } from '../interfaces/state.interface';
import { getCoordinatesByIndex, getNRandomNumbers } from './general';

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
