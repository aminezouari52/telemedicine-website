import { Button as ChakraButton } from '@chakra-ui/react';

export const Button = ({ children, square, ...props }) => {
  const buttonStyle = {
    borderRadius: '15px',
    minWidth: { base: '70px', sm: '100px' },
    minHeight: '35px',
    color: 'white',
    _disabled: {
      bg: 'gray',
      color: '#aaa',
      cursor: 'not-allowed',
      _hover: { bg: 'gray' },
    },
  };

  const squareButton = {
    p: '0',
    minWidth: '42px',
    minHeight: '42px',
    _before: {
      content: '""',
      w: '100%',
      h: '100%',
      position: 'absolute',
      filter: 'blur(5px)',
      background: 'white',
      opacity: 0.5,
    },
  };

  return (
    <ChakraButton
      colorScheme="primary"
      {...buttonStyle}
      {...(square && { ...squareButton })}
      fontSize="13px"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

Button.defaultProps = {
  colorScheme: 'primary',
  size: 'md',
};
