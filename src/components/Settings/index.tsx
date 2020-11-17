import { Button, TextField } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { INITIAL_HEIGHT, INITIAL_WIDTH, INITIAL_MINES_NUMBER } from '../../constants';

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
                    onClick={() => onStart({ width, height, minesNumber })}
                >
                    Start Game
                </Button>
            </StyledForm>
        </StyledContainer>
    );
};

export default Settings;
