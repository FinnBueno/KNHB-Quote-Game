import { FC } from "react";
import { Flex, Text } from "rebass";
import { MButton } from "src/atoms";

type FinishedGameProps = {
  stop: () => void
};

export const FinishedGame: FC<FinishedGameProps> = (props) => (
  <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
    <Text variant='body' textAlign='center' mb={2}>The game has finished. Click here to start over.</Text>
    <MButton variant='primaryLarge' onClick={props.stop}>
      Stop
    </MButton>
  </Flex>
);