import { FC, ReactNode } from "react";
import { Flex } from "rebass";
import { theme } from "src/service/theme/configuration";
import styled from "styled-components";

const DecoratedFlex = styled(Flex)`
  z-index: 1;
  &:after {
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 1100px 400px 0;
    border-color: transparent ${theme.colors.primaryLighter} transparent
      transparent;
    right: 0;
    top: 0;
    z-index: -1;
    position: absolute;
  }
  &:before {
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 600px 1600px;
    border-color: transparent transparent ${theme.colors.primaryLightest}
      transparent;
    right: 0;
    bottom: 0;
    z-index: -2;
    position: absolute;
  }
  & span {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 1200px 700px 0 0;
    border-color: ${theme.colors.primaryBrighter} transparent transparent
      transparent;
    top: 0;
    left: 0;
    z-index: -3;
    position: absolute;
  }
  overflow: hidden;
`;

export const PresentationTemplate: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <DecoratedFlex
    variant="center"
    bg="primary"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100%"
    minHeight="auto"
  >
    <span></span>
    <Flex
      variant="container"
      flexDirection="column"
      justifyContent="center"
      height="auto"
      minHeight="100%"
    >
      {children}
    </Flex>
  </DecoratedFlex>
);
