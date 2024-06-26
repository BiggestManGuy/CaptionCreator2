import styled from 'styled-components';

export const SELECTION_BOX_PORTAL_ID = '@SelectionBoxPortal';

export default styled.div.attrs({
  id: SELECTION_BOX_PORTAL_ID,
})`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
`;
