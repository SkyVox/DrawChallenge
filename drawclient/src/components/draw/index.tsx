import React, { useState, useCallback, useEffect } from 'react';
import { Client } from '../../pages/main';
import {
    Container,
    Board,
    Canvas
} from './styles';

interface Props {
    user: Client;
}

export const DrawBoard: React.FC<Props> = ({ user }) => {
    const [ client, setClient ] = useState<Client>(user);
    const [ lastEvent, setLastEvent ] = useState<any>();
    const [ mouseDown, setMouseDown ] = useState<boolean>(false);

    const handleMouseMove = useCallback((event: any) => {
        if (mouseDown) {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const context = event.target.getContext("2d");

            context.beginPath();
            //context.moveTo(x, y);
            context.lineTo(x, y);

            // Line settings.
            context.strokeStyle = 'gray';
            context.lineWidth = 5;
            context.lineCap = 'round';
            
            context.stroke();
            setLastEvent(event);
        }
    }, [lastEvent, mouseDown]);

    const handleMouseDown = useCallback((event: any) => {
        setMouseDown(true);
        setLastEvent(event);
    }, [setMouseDown, setLastEvent]);

    const handleMouseUp = useCallback(() => {
        setMouseDown(false);
    }, [setMouseDown, setLastEvent]);

    useEffect(() => {
        const canvas = document.getElementsByTagName('canvas')[0];
        canvas.width  = 700;
        canvas.height = 400;
    }, []);

    return (
        <Container>
            <Board>
                <Canvas id='paint-board' onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                </Canvas>
            </Board>
        </Container>
    );
}
