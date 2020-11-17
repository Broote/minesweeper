import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { CellValueType } from '../../interfaces/cell.type';
import sprite from '../../assets/sprite100.gif';

interface IProps {
    readonly value: CellValueType;
}

interface IStyledContainer {
    readonly isHit: boolean;
}

const StyledContainer = styled.div<IStyledContainer>`
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const StyledCell = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${sprite});
`;

const StyledClosedCell = styled(StyledCell)`
    background-position: 0 -39px;
`;

const StyledFlaggedCell = styled(StyledCell)`
    background-position: -16px -39px;
`;

const StyledHitCell = styled(StyledCell)`
    background-position: -32px -39px;
`;

const StyledMineCell = styled(StyledCell)`
    background-position: -64px -39px;
`;

const StyledEmptyCell = styled(StyledCell)`
    background-position: 0 -23px;
`;

const StyledOneCell = styled(StyledCell)`
    background-position: -16px -23px;
`;

const StyledTwoCell = styled(StyledCell)`
    background-position: -32px -23px;
`;

const StyledThreeCell = styled(StyledCell)`
    background-position: -48px -23px;
`;

const StyledFourCell = styled(StyledCell)`
    background-position: -64px -23px;
`;

const StyledFiveCell = styled(StyledCell)`
    background-position: -80px -23px;
`;

const StyledSixCell = styled(StyledCell)`
    background-position: -96px -23px;
`;

const StyledSevenCell = styled(StyledCell)`
    background-position: -112px -23px;
`;

const StyledEightCell = styled(StyledCell)`
    background-position: -128px -23px;
`;

const Cell: FunctionComponent<IProps> = ({ value }) => {
    return (
        <StyledContainer isHit={value === 'hit'}>
            {value === 'closed' && <StyledClosedCell />}
            {value === 'pressed' && <StyledEmptyCell />}
            {value === 'flagged' && <StyledFlaggedCell />}
            {value === 'hit' && <StyledHitCell />}
            {value === 'mined' && <StyledMineCell />}
            {value === 0 && <StyledEmptyCell />}
            {value === 1 && <StyledOneCell />}
            {value === 2 && <StyledTwoCell />}
            {value === 3 && <StyledThreeCell />}
            {value === 4 && <StyledFourCell />}
            {value === 5 && <StyledFiveCell />}
            {value === 6 && <StyledSixCell />}
            {value === 7 && <StyledSevenCell />}
            {value === 8 && <StyledEightCell />}
        </StyledContainer>
    );
};

export default Cell;
