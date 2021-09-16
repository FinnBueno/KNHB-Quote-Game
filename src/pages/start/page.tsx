import React from 'react';
import { Flex, Heading, Text } from 'rebass';
import { useAuth } from 'src/service/auth';
import { useParticipants } from 'src/service/game/participants';
import { ParticipantBar } from 'src/molecules/participant-bar';
import { MButton } from 'src/atoms';
import { useHistory } from 'react-router';

export const StartPage: React.FC<{}> = () => {
    const participants = useParticipants();
    const auth = useAuth();
    const history = useHistory();
    const goToAdmin = () => history.push('/admin');
    return (
        <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            <Heading variant='heading1' mb={1}>Wie ben jij?</Heading>
            <Text variant='body' textAlign='center' mb={3}>Wel eerlijk zeggen anders word ik boos</Text>
            {participants?.map(participant => (
                <ParticipantBar key={participant.id} {...participant} onClick={auth?.setParticipant} />
            ))}
            <MButton variant='link' p={2} onClick={goToAdmin}>Login als admin</MButton>
        </Flex>
    )
}