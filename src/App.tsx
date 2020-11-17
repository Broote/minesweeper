import React, { useReducer } from 'react';
import styled from 'styled-components';

import { INITIAL_HEIGHT, INITIAL_WIDTH, INITIAL_MINES_NUMBER } from './constants';
import { IState, GameStatusEnum, CellPositionEnum } from './interfaces/state.interface';
import { generateBoard } from './utils';

import { reducer } from './app-reducer';

import Board from './components/Board';
import Settings from './components/Settings';

const StyledContainer = styled.div`
    padding: 30px;
    font-family: 'Nunito Sans', sans-serif;
    display: flex;
`;

const StyledSettingsContainer = styled.div`
    margin-top: 4px;
    margin-right: 32px;
`;

const StyledBoardContainer = styled.div``;

const [initialBoard, reservedMineCoordinates] = generateBoard({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    minesNumber: INITIAL_MINES_NUMBER,
});

const initialCellsPositions = initialBoard.map((column) =>
    column.map((_) => CellPositionEnum.CLOSED)
);

const initialState: IState = {
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    minesNumber: INITIAL_MINES_NUMBER,
    minesLeft: INITIAL_MINES_NUMBER,
    gameStatus: GameStatusEnum.IN_PROGRESS,
    lastClick: null,
    isMoveInProgress: false,
    isHeadPressed: false,
    reservedMineCoordinates,
    board: initialBoard,
    cellsPositions: initialCellsPositions,
    gameStartedAt: null,
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StyledContainer>
            <StyledSettingsContainer>
                <Settings
                    onStart={({ width, height, minesNumber }) => {
                        dispatch({ type: 'START_GAME', payload: { width, height, minesNumber } });
                    }}
                />
            </StyledSettingsContainer>
            <StyledBoardContainer>
                <Board
                    width={state.width}
                    height={state.height}
                    minesLeft={state.minesLeft}
                    lastClick={state.lastClick}
                    gameStatus={state.gameStatus}
                    isMoveInProgress={state.isMoveInProgress}
                    isHeadPressed={state.isHeadPressed}
                    cellsPositions={state.cellsPositions}
                    board={state.board}
                    gameStartedAt={state.gameStartedAt}
                    onReset={() => {
                        dispatch({ type: 'RESET' });
                    }}
                    onPressHead={() => {
                        dispatch({ type: 'PRESS_HEAD' });
                    }}
                    onUnpressHead={() => {
                        dispatch({ type: 'UNPRESS_HEAD' });
                    }}
                    onCellClickStart={([x, y]: [number, number]) => {
                        dispatch({ type: 'CLICK_START', payload: [x, y] });
                    }}
                    onCellClickFinish={([x, y]: [number, number]) => {
                        dispatch({ type: 'CLICK_FINISH', payload: [x, y] });
                    }}
                    onCellMouseLeave={([x, y]: [number, number]) => {
                        dispatch({ type: 'MOUSE_LEAVE', payload: [x, y] });
                    }}
                    onCellRightClick={([x, y]: [number, number]) => {
                        dispatch({ type: 'RIGHT_CLICK', payload: [x, y] });
                    }}
                />
            </StyledBoardContainer>
        </StyledContainer>
    );
}

export default App;
