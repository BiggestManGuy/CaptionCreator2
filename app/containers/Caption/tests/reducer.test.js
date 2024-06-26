import { fromJS } from 'immutable';
import captionReducer from '../reducer';

describe('captionReducer', () => {
  it('returns the initial state', () => {
    expect(captionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
