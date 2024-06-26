import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: [col-start] ${props => props.columns.join(' ')} [col-end];
  grid-template-rows: [row-start] ${props => props.rows.join(' ')} [row-end];
  grid-gap: 0.5rem;

  & + & {
    margin-top: 0.5rem;
  }
`;

function GridContainer({ columns = ['auto'], rows = ['auto'], children }) {
  return (
    <Container columns={columns} rows={rows}>
      {children}
    </Container>
  );
}

GridContainer.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default GridContainer;
