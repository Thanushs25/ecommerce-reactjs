import React from 'react';
import styled from 'styled-components';

const Button = ({ children, onClick }) => { // Accept children and onClick props
  return (
    <StyledWrapper>
      <button onClick={onClick}> {/* Pass onClick to the native button */}
        <span>{children}</span> {/* Render children here */}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    display: inline-block;
    border-radius: 4px;
    background-color: #657868;
    border: none;
    color: #FFFFFF;
    text-align: center;
    font-size: 17px;
    padding: 10px;
    width: 130px; /* You might want to adjust this width or make it dynamic */
    transition: all 0.5s;
    cursor: pointer;
    margin: 5px;
  }

  button span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }

  button span:after {
    content: '»';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -15px;
    transition: 0.5s;
  }

  button:hover span {
    padding-right: 15px;
  }

  button:hover span:after {
    opacity: 1;
    right: 0;
  }
`;

export default Button;