import { React } from 'react';
import { SimpleButton } from './SimpleButton';


export type SelectionButtonProps = {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};
export const SelectionButton: React.FunctionComponent<SelectionButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <SimpleButton 
      style={{
        margin: '5px',
        width: '10rem',
      }}
      onClick={onClick}
      className={`button is-primary is-fullwidth ${className}`}
    >
      {children}
    </SimpleButton>
  );
};