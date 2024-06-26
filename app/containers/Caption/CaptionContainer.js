import styled from 'styled-components';
import filterStyledProps from 'utils/filterStyledProps';
import FormattableArea from 'containers/CaptionFormats';
import { toBackground } from 'components/BackgroundInput';

export default styled(FormattableArea)
  .withConfig(filterStyledProps(['width', 'height'], true))
  .attrs(props => ({
    style: {
      background: toBackground(props.background),
      width: props.width,
      height: props.height,
    },
  }))`
  position: relative;
  overflow: hidden;
`;
