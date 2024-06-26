import styled from 'styled-components';
import Input from '../Input';

export default styled(Input).attrs({
  readOnly: true,
  placeholder: 'Choose file...',
})`
  flex: 1;
`;
