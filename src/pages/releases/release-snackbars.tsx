import {
  Snackbar
} from '@material-ui/core';
import {
  Alert
} from '@material-ui/lab';
import React, {
  Fragment
} from 'react';

function ReleaseSnackbars(props: any) {
  return (
    <Fragment>
      <Snackbar
        // open={showCreateEventError}
        autoHideDuration={3000}
        // onClose={() => setShowCreateEventError(false)}
      >
        <Alert
          severity="success"
          // onClose={() => setShowCreateEventError(false)}
        >
          Created release successfully. <span role="img" aria-label="ok">✅</span>
        </Alert>
      </Snackbar>

      <Snackbar
        // open={showCreateEventError}
        autoHideDuration={3000}
        // onClose={() => setShowCreateEventError(false)}
      >
        <Alert
          severity="error"
          // onClose={() => setShowCreateEventError(false)}
        >
          Creation of release failed. <span role="img" aria-label="ok">🚫</span>
        </Alert>
      </Snackbar>

      <Snackbar
        // open={showCreateEventError}
        autoHideDuration={3000}
        // onClose={() => setShowCreateEventError(false)}
      >
        <Alert
          severity="success"
          // onClose={() => setShowCreateEventError(false)}
        >
          Deleted release successfully. <span role="img" aria-label="ok">✅</span>
        </Alert>
      </Snackbar>

      <Snackbar
        // open={showCreateEventError}
        autoHideDuration={3000}
        // onClose={() => setShowCreateEventError(false)}
      >
        <Alert
          severity="error"
          // onClose={() => setShowCreateEventError(false)}
        >
          Deletion of release failed. <span role="img" aria-label="ok">🚫</span>
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default ReleaseSnackbars;