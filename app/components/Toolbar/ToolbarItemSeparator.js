import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.div`
  display: ${({ showOnlyWhen = true }) => (showOnlyWhen ? 'block' : 'none')};
  margin: ${props => {
    if (props.horizontal) return '0.25rem 1rem';
    if (props.vertical) return '0.25rem';
    return 0;
  }};
  padding: 1px 0 0 1px;
  background: ${colors.onPrimaryDark};
`;
