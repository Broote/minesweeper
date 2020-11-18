import { BoardType, CellPositionEnum } from '../interfaces/state.interface';
import { getNeighbors } from './board';

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
