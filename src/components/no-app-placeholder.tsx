import {
  Button,
  Card,
  CardContent as MuiCardContent,
  Typography
} from '@material-ui/core';
import React from 'react';
import { Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '../common/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useIsAdmin,
  useUrlQuery
} from "../common/hooks";
import { requestAccessDispatchers } from '../pages/request/requestControlSlice';
import { TReqListResp } from '../pages/request/requestsControlTypes';

type TNoApPlaceholderProps = {
  imageUrl: string;
  text: string;
};

const CardContent = styled(MuiCardContent)`
  min-height: calc(100vh - 64px - 62px - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function NoAppPlaceholder({
  imageUrl,
  text
}: TNoApPlaceholderProps) {
  const dispatch = useAppDispatch();
  const redirectTo = useAppRedirect();
  const { cmsRequestList } = useAppSelector((state) => state.requestControlSlice);
  const list = cmsRequestList.response?.appRequests;
  const userProfile: any = JSON.parse(
    localStorage.getItem("userGoogleProfile") || "{}"
  );
  let companyId = userProfile.companyId;
  React.useEffect(() => {
    let cmsReqList = {
      pn: 0,
      ps: 10,
    };
    dispatch(
      requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
        success: (response: TReqListResp) => {
    
          
        },
      })
    );
  }, [])
  
  const renderButton = () => {
    let isValid = false;
    if (list?.length !== 0) {
    
      if (list?.filter(a=> a.status !== "COMPLETED").length !== 0) {
        isValid = false 
       } else {
         isValid = true;
       }
    } else {
      isValid = true;
    }
    
    
    if (isValid) {
      return (<Link
        style={{ color: '#fff', background: 'rgb(72, 144, 232)' }}
        component={Button}
        to={ROUTES.REQUEST_ADD_GAME_REQUEST}
      >
        <Plus style={{ marginRight: 8 }} />
        Add New Game
      </Link>)
    } else {
      return (
    <Link
      style={{ color: '#fff', background: 'rgb(72, 144, 232)' }}
      component={Button}
      to={ROUTES.REQUEST_PENDING_REQUEST}
    >
      Game Requests
    </Link>)}
  }

  
  return (
    <Card>
      <CardContent>
        <img
          src={imageUrl}
          alt="illustration add app"
        />
        <Typography style={{ margin: '2rem 0' }}>{text}</Typography>
        {list?.length === 0 || list?.filter(a=> a.status !== "COMPLETED").length === 0 ? (<Link
        style={{ color: '#fff', background: 'rgb(72, 144, 232)' }}
        component={Button}
        to={ROUTES.REQUEST_ADD_GAME_REQUEST}
      >
        <Plus style={{ marginRight: 8 }} />
        Add New Game
      </Link>):
    (
    <Link
      style={{ color: '#fff', background: 'rgb(72, 144, 232)' }}
      component={Button}
      to={ROUTES.REQUEST_PENDING_REQUEST}
    >
      Game Requests
    </Link>)}
      </CardContent>
    </Card>
  );
}

export default NoAppPlaceholder;