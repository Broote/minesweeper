import shuffle from 'lodash/shuffle';
import take from 'lodash/take';
import { CellPositionEnum, ICells } from '../interfaces/state.interface';

interface IGenerateCellsParams {
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

export const getCoordinatesByIndex = (index: number, width: number): [number, number] => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [x, y];
};

export const generateKeyByCoordinates = ([x, y]: [number, number]) => `${x},${y}`;

export const generateCells = ({ width, height, minesNumber }: IGenerateCellsParams): ICells => {
    const area = width * height;

    const randomNumbers = getNRandomNumbers(area, minesNumber);
    const mines = new Array(area).fill(null).map((_, index) => randomNumbers.includes(index));

    const result = mines.reduce((acc, _, index) => {
        const [x, y] = getCoordinatesByIndex(index, width);
        const key = generateKeyByCoordinates([x, y]);
        acc[key] = {
            x,
            y,
            hasMine: mines[index],
            position: CellPositionEnum.CLOSED,
            value: 0,
        };
        return acc;
    }, {} as ICells);

    Object.values(result).forEach(({ x, y, hasMine }) => {
        if (!hasMine) {
            return;
        }

        const cellsCoordinates: [number, number][] = getNeighbors({ x, y, width, height });

        cellsCoordinates.forEach(([x, y]) => {
            const key = generateKeyByCoordinates([x, y]);
            result[key].value += 1;
        });
    });

    return result;
};

const getNRandomNumbers = (max: number, n: number): number[] =>
    take(shuffle(new Array(max).fill(null).map((_, index) => index)), n);

const getNeighbors = ({ x, y, width, height }: IGetNeighborsParams): [number, number][] => {
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
    cells: ICells,
    width: number,
    height: number,
    minesNumber: number,
    isFirstMove: boolean
): ICells => {
    const cellKey = generateKeyByCoordinates([x, y]);
    const currentCell = cells[cellKey];

    if (
        currentCell.position === CellPositionEnum.OPENED ||
        currentCell.position === CellPositionEnum.FLAGGED
    ) {
        return cells;
    }

    if (isFirstMove && currentCell.hasMine) {
        const regeneratedCells = generateCells({ width, height, minesNumber });
        return openCell([x, y], regeneratedCells, width, height, minesNumber, true);
    }

    return recursiveOpenCells([x, y], cells, width, height);
};

const recursiveOpenCells = (
    [x, y]: [number, number],
    cells: ICells,
    width: number,
    height: number
): ICells => {
    const cellKey = generateKeyByCoordinates([x, y]);
    const currentCell = cells[cellKey];

    if (
        currentCell.position === CellPositionEnum.OPENED ||
        currentCell.position === CellPositionEnum.FLAGGED
    ) {
        return cells;
    }

    cells[cellKey].position = CellPositionEnum.OPENED;

    if (currentCell.value !== 0 || currentCell.hasMine) {
        return cells;
    }

    const neighbors = getNeighbors({ x, y, width, height });

    return neighbors.reduce((acc, [x, y]) => recursiveOpenCells([x, y], acc, width, height), cells);
};
