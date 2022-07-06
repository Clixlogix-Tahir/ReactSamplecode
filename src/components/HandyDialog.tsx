import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import React from 'react';

interface IHandyDialog {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onCancelClick?: () => void;
  onOkClick: () => void;
  cancelText?: string;
  okText?: string;
  cancelDisabled?: boolean;
  okDisabled?: boolean;
  scroll?: 'body' | 'paper';
  dividers?: boolean;
  disableBackdropClick?: boolean;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

function HandyDialog({
  open,
  title,
  content,
  cancelText = 'Cancel',
  okText = 'Ok',
  onClose,
  onOkClick,
  onCancelClick = undefined,
  cancelDisabled = false,
  okDisabled = false,
  scroll = 'paper',
  dividers = true,
  disableBackdropClick = true,
  maxWidth = 'xl'
}: IHandyDialog) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      disableBackdropClick={disableBackdropClick}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
    >
      <DialogTitle id="scroll-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent dividers={dividers}>
        {content}
      </DialogContent>
      <DialogActions>
        {onCancelClick && <Button
          color="primary"
          variant="outlined"
          onClick={onCancelClick}
          disabled={cancelDisabled}
        >
          {cancelText}
        </Button>}
        <Button
          color="primary"
          variant="contained"
          onClick={onOkClick}
          disabled={okDisabled}
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HandyDialog;
