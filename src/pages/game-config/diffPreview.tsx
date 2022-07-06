import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery,
  useTheme
} from '@material-ui/core';
import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

interface IDiffPreview {
  open: boolean;
  oldValue: string;
  newValue: string;
  splitView: boolean;
  handleClose: () => void;
  handlePrimaryClick: () => void;
  handleSecondaryClick: () => void;
  disableButtons: boolean;
  title?: string;
  primaryButtonText?: string;
  leftTitle?: string;
  rightTitle?: string;
}

function DiffPreview(props: IDiffPreview) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableBackdropClick={true}
        fullScreen={fullScreen}
        maxWidth="xl"
      >
        <DialogTitle id="scroll-dialog-title">
          {props.title || 'Diff Preview'}
        </DialogTitle>
        <DialogContent dividers={true} style={{ wordBreak: 'break-word' }}>
          <ReactDiffViewer
            oldValue={props.oldValue}
            newValue={props.newValue}
            splitView={props.splitView}
            rightTitle={props.rightTitle || 'New Value'}
            leftTitle={props.leftTitle || 'Old Value'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleSecondaryClick} color="primary"
            disabled={props.disableButtons}>
            Cancel
          </Button>
          <Button onClick={props.handlePrimaryClick} color="primary"
            disabled={props.disableButtons}>
            {props.primaryButtonText || 'Rollback'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DiffPreview;
