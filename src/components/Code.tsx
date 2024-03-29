import * as React from "react";
import styled from "styled-components";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Base = styled(SyntaxHighlighter)`
  border-radius: 3px;
  padding: ${props => props.theme.spacing(3)}px !important;
  background-color: #1B2430 !important;
`;

const Code: React.FC = ({children}) => {
  return (
    <Base language="javascript" style={vs2015}>
      {children}
    </Base>
  )
}

export default Code;
