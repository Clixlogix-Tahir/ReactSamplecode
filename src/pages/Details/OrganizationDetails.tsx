import { Divider, Typography } from '@material-ui/core';
import React, { createRef, useEffect, useState } from 'react';
import {
  useAppDispatch, useAppSelector
} from "../../common/hooks";
import detailsStyles from '../../theme/detailsStyles';
import { requestAccessDispatchers } from '../request/requestControlSlice';
import { TAddOrgResp, TReqList, TReqListResp } from '../request/requestsControlTypes';

const OrganizationDetails = () => {
  const dispatch = useAppDispatch();
  const detailsClasses = detailsStyles();
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const [orgDetail, setOrgDetail] = useState<TAddOrgResp>()
  const [reqList, setReqList] = useState<TReqList[]>([]);
  const { userGoogleProfile } = useAppSelector((state) => state.globalSlice);
  const userProfile: any = JSON.parse(localStorage.getItem('userGoogleProfile') || '{}');
  let companyId = userProfile.companyId;
  useEffect(() => {
    const element = refParent.current?.parentElement;
  
    if (element) {
      element.style.padding = "0px";
      element.style.background = "white";
    }
  }, []);
  useEffect(() => {
    dispatch(requestAccessDispatchers.cmsGetOrg(
      companyId,
      {
        success: (response: TAddOrgResp) => {
      
          setOrgDetail(response);

        },
      },
    ));
    let cmsReqList = {
      pn: 0,
      ps: 100,
      status:'COMPLETED', 
    }
    dispatch(requestAccessDispatchers.cmsGetReqList(
      cmsReqList,
      companyId,
      {
        success: (response: TReqListResp) => {
       
          if (response.appRequests.length !== 0) {
            setReqList(response.appRequests);
          }
        },
      },
    ));
  },[])
  return (
    <div ref={refParent} className={detailsClasses.detail}>
      <Typography className={detailsClasses.header}>Organization Details</Typography>
      <Divider />
      <Typography className={detailsClasses.headControl}>Organization Name</Typography>
      <Typography className={detailsClasses.labelControl}>{ orgDetail?.name}</Typography>
      <Typography className={detailsClasses.headControl}>Organization Website</Typography>
      <Typography className={detailsClasses.labelControl}>{ orgDetail?.website ? orgDetail.website : "No website provided"}</Typography>
      <Typography className={detailsClasses.headControl}>Game</Typography>
      <div>
        {reqList ? reqList.map((data) =>  (
              <div className={detailsClasses.gameDiv}>
                <div className={detailsClasses.contrl}>
                  <img src="/static/img/icons/check.png" className={detailsClasses.pics} alt="game_pic" />
                </div>
                <div className={detailsClasses.contrl}>{data.name}</div>
                <div className={detailsClasses.statusControl}>{data.status}</div>
              </div>)): null}
      </div>
    </div>
  )
}

export default OrganizationDetails