import { FC } from "react";
import { useHistory } from "react-router-dom";
import { Flex, Text } from "rebass";
import { useFirebaseData } from "src/hooks/use-firebase-data";
import { LoadingBar } from "src/molecules";
import { theme } from "src/service/theme/configuration";
import { PresentationTemplate } from "src/templates/PresentationTemplate";
import styled from "styled-components";

type AvailableGame = {
  name: string;
  thumbnail: string;
  uuid: string;
};

type AvailableGames = {
  [key: number]: AvailableGame
}

export const GameSelectionPage: FC<{}> = () => {
  const { data, isLoading, error } = useFirebaseData<AvailableGames>('availableGames');
  const games = Object.values(data ?? {});

  const history = useHistory();

  const showPasswordDialog = (uuid: string) => {
    // todo: password dialog
    // or maybe not? Since it's just the visual, you can't control anything
    // probably still should, since it'll show a QR code to join
    history.push(`/quotes/${uuid}`);
  }

  return (
    <PresentationTemplate>
      {isLoading && (
        <LoadingBar />
      )}
      {error && (
        <Text variant="heading3" color="background" textAlign="center">
          Het is stukkie wukkie, ff Finn bellen
        </Text>
      )}
      {data && games.map(game => (
        <GameOptionBlock {...game} onClick={() => showPasswordDialog(game.uuid)} />
      ))}
    </PresentationTemplate>
  );
};

const GameOptionContainer = styled(Flex)`
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Thumbnail = styled.img`
  height: 100px;
  width: 100px;
  margin-right: 12px;
  border-radius: 8px 0 0 8px;
`

const GameOptionBlock: FC<AvailableGame & { onClick: () => void }> = ({ name, uuid, thumbnail, onClick }) => (
  <GameOptionContainer
    backgroundColor={theme.colors.backgroundLight}
    onClick={onClick}
  >
    <Thumbnail src={thumbnail} />
    <div>
      <Text paddingRight='24px' variant='heading3'>{name}</Text>
      <Text>Press to start</Text>
    </div>
  </GameOptionContainer>
);
