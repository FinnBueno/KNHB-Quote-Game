import React from "react";
import { LoadingIndicator } from "./loading";
import { MButton, MobileButtonProps } from "./mbutton";

type ProgressButtonProps = MobileButtonProps & { scope: string };

export const ProgressButton: React.FC<ProgressButtonProps> = ({ children, scope, ...rest }) => {
  return (
    <MButton {...rest}>
      <LoadingIndicator scope={scope}>
        {children}
      </LoadingIndicator>
    </MButton>
  );
};