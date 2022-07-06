import styled from 'styled-components';

export const ShadowedHeading = styled.h1`
  margin-top: 0;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  font-size: 18px;
  line-height: 20px;
  font-weight: normal;
  display: flex;
  height: 53px;
  align-items: center;
  padding-left: 30px;
  svg {
    margin-right: 10px;
  }
`;

export const UnpaddedContainer = styled.div`
  width: calc(100% + 80px);
  position: relative;
  top: -40px;
  left: -40px;
  font-size: 16px;
  .main {
    padding: 30px;
    min-height: calc(100vh - 65px - 53px - 62px);
  }
  h2 {
    font-size: 16px;
    padding-top: 1em;
  }
  p {
    max-width: 500px;
  }
`;
