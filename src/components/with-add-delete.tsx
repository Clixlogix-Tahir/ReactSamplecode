import {
  IconButton, Tooltip
} from '@material-ui/core';
import React from 'react';
import { Plus } from 'react-feather';

type TWithAddDeleteProps = {
  // index: number;
  addFn: (event: React.MouseEvent) => void;
  // deleteFn: (event: React.MouseEvent, index: number) => void;
  deleteFn: (event: React.MouseEvent) => void;
  addDisabled?: boolean;
  deleteDisabled?: boolean;
  nameOfResource?: string;
};

const WithAddDelete: React.FC<TWithAddDeleteProps> = ({
  children,
  addFn,
  deleteFn,
  addDisabled,
  deleteDisabled,
  nameOfResource
  // index
}) => {
  return (
    <div>
      {children}
      {/* <IconButton
        aria-label="delete"
        disabled={deleteDisabled}
        onClick={deleteFn}
        // onClick={e => deleteFn(e, index)}
        // onMouseDown={handleMouseDownPassword}
      >
        <Trash />
      </IconButton> */}
      {!addDisabled &&
        <Tooltip title={`add ${nameOfResource ? nameOfResource : ''}`} arrow>
          <IconButton
            aria-label="add"
            onClick={addFn}
            // onMouseDown={handleMouseDownPassword}
          >
            <Plus />
          </IconButton>
        </Tooltip>
      }
    </div>
  );
};

export default WithAddDelete;
