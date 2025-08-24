import { FC } from "react";
import { Flex, Heading, Text } from "rebass";

export const ExplanationPage: FC<{}> = () => (
  <Flex p={2} width='100%' textAlign='center' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
    <Heading variant='heading1' textAlign='center'>
      Huh?!
    </Heading>
    <Text variant='body'>
      De game werkt iets anders dan vorige keer. Scan de QR code op het scherm om te joinen.
    </Text>
    <Text variant='body'>{'<3'}</Text>
  </Flex>
)