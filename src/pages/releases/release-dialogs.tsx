import {
  Typography
} from '@material-ui/core';
import React, {
  Fragment
} from 'react';
import HandyDialog from '../../components/HandyDialog';

function ReleaseDialogs(props: any) {
  return (
    <Fragment>
      <HandyDialog
        open={false}
        title="Delete confirmation"
        content={
          <Typography>Are you sure you want to delete this release?</Typography>
        }
        onClose={() => {}}
        onOkClick={() => {}}
        okText="Delete"
      />

      <HandyDialog
        open={false}
        title="Soft update confirmation"
        content={
          <Typography>Are you sure you want to change soft update status of this release?</Typography>
        }
        onClose={() => {}}
        onOkClick={() => {}}
        okText="Proceed"
        cancelText="Go Back"
      />
    </Fragment>
  );
}

export default ReleaseDialogs;