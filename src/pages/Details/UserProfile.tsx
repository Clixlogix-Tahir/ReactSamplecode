import { Divider, Typography } from '@material-ui/core';
import React, { createRef, useEffect } from 'react';
import {
  useAppSelector
} from "../../common/hooks";
import detailsStyles from '../../theme/detailsStyles';
const UserProfile = () => {
  const detailClasses = detailsStyles();
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const { userGoogleProfile } = useAppSelector((state) => state.globalSlice);
  useEffect(() => {
    const element = refParent.current?.parentElement;
  
    if (element) {
      element.style.padding = "0px";
      element.style.background = "white";
    }
  }, []);
  return (
    <div ref={refParent} className={detailClasses.detail}>
      <Typography className={detailClasses.header}>My Information</Typography>
      <Divider />
      <Typography className={detailClasses.headControl}>Name</Typography>
      <Typography className={detailClasses.labelControl}>{userGoogleProfile?.name}</Typography>
      <Typography className={detailClasses.headControl}>My Email</Typography>
      <Typography className={detailClasses.labelControl}>{ userGoogleProfile?.email}</Typography>
    </div>
  )
}

export default UserProfile