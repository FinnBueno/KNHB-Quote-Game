import { Input } from "@rebass/forms";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { trackPromise } from "react-promise-tracker";
import { Flex, Heading, Text } from "rebass";
import { MButton, ProgressButton } from "src/atoms";
import { Modal } from "src/atoms/modal";
import { signInAsGameMaster, signInWithGoogle } from "src/service/firebase";
import { useListOfAvailableGames } from "src/service/game/use-list-available-games";

type PasswordFormData = { password: string };

export const AvailableGamesOverview: React.FC<{}> = () => {
  const availableGames = useListOfAvailableGames();
  const [selectedGameId, setSelectedGameId] = useState<typeof availableGames[0]['identifier']>();

  const { register, handleSubmit, setError, formState } = useForm<PasswordFormData>();

  const onSubmit = (data: PasswordFormData) => {
    console.log(data);
    trackPromise(
      signInAsGameMaster(selectedGameId!, data.password)
        .catch(result => {
          if (result.code === 'auth/wrong-password') {
            setError('password', {
              message: 'Password is incorrect',
              shouldFocus: true
            });
          }
        }),
      // new Promise((resolve) => setTimeout(resolve, 2000)),
      'sign-in'
    );
  };

  return (
    <Flex variant='center' flexDirection='column'>
      <Modal isOpen={!!selectedGameId}>
        <Flex flexDirection='column' m={2}>
          <Heading variant='heading3' mb={1}>
            Game Password
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('password')} />
            {formState.errors.password?.message && <Text mt={1} variant='error'>{formState.errors.password?.message}</Text>}
            <Flex justifyContent='center' mt={2}>
              <Flex flex={1} justifyContent='center' mr={1}>
                <MButton width='100%' onClick={() => setSelectedGameId(undefined)} variant='hollow'>Cancel</MButton>
              </Flex>
              <Flex flex={1} justifyContent='center' ml={1}>
                <ProgressButton width='100%' type='submit' variant='primary' scope='sign-in'>Submit</ProgressButton>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </Modal>
      <Heading variant='h2'>Choose which game you want to play</Heading>
      <Flex flexDirection='column' mt={3}>
        {availableGames.map(game => (
          <MButton
            width='100%'
            key={game.identifier}
            mb={2}
            variant='primary'
            onClick={() => setSelectedGameId(game.identifier)}
          >
            Login for {game.name}
          </MButton>
        ))}
      </Flex>
    </Flex>
  );
};