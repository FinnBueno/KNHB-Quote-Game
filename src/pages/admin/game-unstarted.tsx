import firebase from "firebase";
import { FC } from "react";
import { Flex, Text } from "rebass";
import { MButton } from "src/atoms";

type UnstartedGameProps = {
  onSettings: () => void
  onStart: () => void
};

export const UnstartedGame: FC<UnstartedGameProps> = ({ onSettings, onStart }) => (
  <Flex m={2} alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
    <Flex maxWidth='300px' width='100%' flexDirection='column'>
      <Text variant='body' textAlign='center' mb={2}>There is no game active. Click here to start.</Text>
      <MButton variant='primaryLarge' onClick={onStart} width='100%'>
        Start
      </MButton>
      <Flex justifyContent='space-between' width='100%' pt={1}>
        <MButton variant='link' mt={2} onClick={() => firebase.auth().signOut()}>
          Log out
        </MButton>
        <MButton variant='link' mt={2} onClick={onSettings}>
          Settings
        </MButton>
      </Flex>
    </Flex>
  </Flex>
);