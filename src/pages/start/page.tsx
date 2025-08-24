import React, { useEffect } from 'react';
import { Flex, Heading, Text } from 'rebass';
import { useAuth } from 'src/service/auth';
import { Participant, useParticipants } from 'src/service/game/participants';
import { ParticipantBar } from 'src/molecules/participant-bar';
import { MButton } from 'src/atoms';
import { Redirect, useHistory } from 'react-router';
import { registerGameId } from 'src/hooks/use-game-id';
import { useGameId } from 'src/service/game/game-id-context';

export const StartPage: React.FC<{}> = () => {
  registerGameId();
  const { gameId } = useGameId();

  const participants = useParticipants();
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (auth?.user) {
      history.push(`/game/${gameId}`);
    }
  }, [auth?.user]);

  const goToAdmin = () => history.push('/admin');

  const onParticipantSelected = (participant: Participant) => {
    auth?.setParticipant(participant.id);
  }

  return (
    <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
      <Heading variant='heading1' mb={1}>Wie ben jij?</Heading>
      <Text variant='body' textAlign='center' mb={3}>Wel eerlijk zeggen anders word ik boos</Text>
      {participants?.map(participant => (
        <ParticipantBar key={participant.id} {...participant} onClick={() => onParticipantSelected(participant)} />
      ))}
      <MButton variant='link' p={2} onClick={goToAdmin}>Login als admin</MButton>
    </Flex>
  )
}