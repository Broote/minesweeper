import { Button, TextField } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import {
    INITIAL_HEIGHT,
    INITIAL_WIDTH,
    INITIAL_MINES_NUMBER,
    MIN_LINEAR_SIZE,
    MAX_LINEAR_SIZE,
    MIN_MINES_NUMBER,
    MAX_MINES_NUMBER,
} from '../../constants';

interface IOnStartParams {
    readonly width: number;
    readonly height: number;
    readonly minesNumber: number;
}

interface IProps {
    readonly onStart: (params: IOnStartParams) => void;
}

const StyledContainer = styled.div`
    width: 200px;
`;

const StyledTextField = styled(TextField)``;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;

    & ${StyledTextField}:not(:last-child) {
        margin-bottom: 16px;
    }
`;

const getSize = (input: number, defaultValue: number): number => {
    if (isNaN(input)) {
        return defaultValue;
    }

    const roundedInput = Math.round(input);

    if (roundedInput < MIN_LINEAR_SIZE) {
        return MIN_LINEAR_SIZE;
    }

    if (roundedInput > MAX_LINEAR_SIZE) {
        return MAX_LINEAR_SIZE;
    }

    return roundedInput;
};

const getMinesNumber = (input: number, width: number, height: number): number => {
    if (isNaN(input)) {
        return INITIAL_MINES_NUMBER;
    }

    const roundedInput = Math.round(input);

    if (roundedInput < MIN_MINES_NUMBER) {
        return MIN_MINES_NUMBER;
    }

    if (roundedInput > MAX_MINES_NUMBER) {
        return MAX_MINES_NUMBER;
    }

    return Math.min(roundedInput, width * height - 2);
};

const Settings: FunctionComponent<IProps> = ({ onStart }) => {
    const [width, setWidth] = useState(INITIAL_WIDTH);
    const [height, setHeight] = useState(INITIAL_HEIGHT);
    const [minesNumber, setMinesNumner] = useState(INITIAL_MINES_NUMBER);

    return (
        <StyledContainer>
            <StyledForm autoComplete='off'>
                <StyledTextField
                    label='Columns'
                    type='number'
                    variant='outlined'
                    size='small'
                    value={width}
                    onChange={(e) => {
                        setWidth(Number(e.target.value));
                    }}
                />
                <StyledTextField
                    label='Rows'
                    type='number'
                    variant='outlined'
                    size='small'
                    value={height}
                    onChange={(e) => {
                        setHeight(Number(e.target.value));
                    }}
                />
                <StyledTextField
                    label='Number of bombs'
                    type='number'
                    variant='outlined'
                    size='small'
                    value={minesNumber}
                    onChange={(e) => {
                        setMinesNumner(Number(e.target.value));
                    }}
                />
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                        const checkedWidth = getSize(width, INITIAL_WIDTH);
                        const checkedHeight = getSize(height, INITIAL_HEIGHT);
                        const checkedMinesNumber = getMinesNumber(
                            minesNumber,
                            checkedWidth,
                            checkedHeight
                        );

                        setWidth(checkedWidth);
                        setHeight(checkedHeight);
                        setMinesNumner(checkedMinesNumber);

                        onStart({
                            width: checkedWidth,
                            height: checkedHeight,
                            minesNumber: checkedMinesNumber,
                        });
                    }}
                >
                    Start Game
                </Button>
            </StyledForm>
        </StyledContainer>
    );
};

export default Settings;
