import React, { useEffect, createRef, useState } from "react";
import {
  AccordionSummary,
  Typography,
  Box,
  FormControl,
  InputAdornment,
  TextField,
  OutlinedInput,
  Grid,
  Accordion,
  AccordionDetails,
  MenuItem,
  Snackbar,
  Button,
} from "@material-ui/core";
import { XHR_STATE } from "../../common/constants";
import { NavigateNext as ExpandMoreIcon, Search } from "@material-ui/icons";
import { Pagination, Alert, Value } from "@material-ui/lab";
import { makeStyles, Theme } from "@material-ui/core";
import { requestAccessDispatchers } from "./requestControlSlice";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { TReqListResp, TReqListBasic, TReqList } from "./requestsControlTypes";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import pendingStyles from "../../theme/pendingStyles";
import manageStyles from "../../theme/manageStyles";
import produce from "immer";

const useStyles = makeStyles((theme: Theme) => ({
  completeDiv: {
    backgroundColor: `#C3E5AE`,
    height: "10px",
    width: "10px",
  },
  error: {
    color: "black",
  },
  "&.MuiStepLabel-label.Mui-error ": {
    color: "black",
  },
}));

type CustomIconPropType = {
  completed: boolean;
  active: boolean;
  error: boolean;
  icon: number;
};

const ManageRequest = () => {
  const pendingClasses = manageStyles();
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const statusRef: React.RefObject<HTMLInputElement> = createRef();
  // const [requestList, setRequestList] = useState<TReqList[]>([]);
  const [showDate, setShowDate] = useState<string>("");
  const [currentIdx, setCurrentIdx] = React.useState(-1);
  const [requestedDateStart, setRequestedDateStart] = useState<string>("");
  const [requestedDateEnd, setRequestedDateEnd] = useState<string>("");
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>("");
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>(0);
  const [search, setSearch] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [firstIndex, setFirstIndex] = useState<number>(0);
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [lastPageElement, setLastPageElement] = useState<number>(0)
  const [status, setStatus] = useState("Completed");
  const [clear, setClear] = useState<string>('');
  const [statusChange, setStatusChange] = useState<string>('');
  const [statusSearch, setStatusSearch] = useState<string>(
    "SUBMITTED,IN_EVALUATION,APPROVED,PLATFORM_INTEGRATION,COMPLETED,REJECTED"
  );
  const inputRef: React.RefObject<HTMLInputElement> = createRef();
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [state, setState] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);

  const { cmsRequestList, cmsReqChange } = useAppSelector(
    (state) => state.requestControlSlice
  );
  const requestList: TReqList[] = cmsRequestList.response?.appRequests || [];
  const userProfile: any = JSON.parse(
    localStorage.getItem("userGoogleProfile") || "{}"
  );
  let companyId = userProfile.companyId;
  useEffect(() => {
    const element = refParent.current?.parentElement;
   
    if (element) {
      element.style.padding = "5px";
      element.style.background = "white";
    }
  }, []);
  useEffect(() => { 
    if (pageNo === totalCount) {
      if (total) {
        setFirstIndex((8 * (pageNo - 1)) + 1);
      setLastIndex(total);
      }
      
    } else {
      setFirstIndex((8 * (pageNo-1))+1);
    setLastIndex(8 * pageNo );
   }
    
  
},[lastPageElement, pageNo, total, totalCount])
  
  useEffect(() => {
    if (
      cmsReqChange.response !== null &&
      cmsReqChange.error === "" &&
      cmsReqChange.loading === XHR_STATE.COMPLETE
    ) {
      setSnackBarSuccessText(
        `Request Status Changed - Requset Status "${cmsReqChange.response.staus}`
      );
      //setShowSnackBar(true);
    } else if (
      cmsReqChange.error !== "" &&
      cmsReqChange.loading === XHR_STATE.ASLEEP
    ) {
      setSnackBarErrorText("Could not change request - " + cmsReqChange.error);
    }
  }, [cmsReqChange]);
  useEffect(() => {
    setCurrentIdx(-1);
    if (requestedDateStart && requestedDateEnd) {
   
      let cmsReqList: TReqListBasic = {
        requestedDateStart,
        requestedDateEnd,
        pn: pageNo-1,
        ps: limit,
        sortBy: 'createdAt',
        sortOrder:'DESC'
      };
      if (search) {
        cmsReqList.query = search;
      }
      if (statusSearch) {
        cmsReqList.status = statusSearch;
      }
      dispatch(
        requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
          success: (response: TReqListResp) => {
          
           
           
            setTotalCount(response?.pagination.totalPages);
            setLastPageElement(response.appRequests.length)
          setTotal(response.pagination.totalResults)
          },
        })
      );
     
    } else {
      let cmsReqList: TReqListBasic = {
        pn: pageNo-1,
        ps: limit,
        sortBy: 'createdAt',
        sortOrder:'DESC'
      };
      if (search) {
        cmsReqList.query = search;
      }
      if (statusSearch) {
        cmsReqList.status = statusSearch;
      }
      dispatch(
        requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
          success: (response: TReqListResp) => {
           
            // setRequestList(response.appRequests);
            
            setTotalCount(response?.pagination.totalPages);
            setLastPageElement(response.appRequests.length)
          setTotal(response.pagination.totalResults)
          },
        })
      );
    }
    
  }, [
    pageNo,
    limit,
    showDate,
    requestedDateStart,
    requestedDateEnd,
    search,
    statusSearch,
  ]);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
  };
  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    let value = event.target.value as string;
    setStatusSearch(value);
    setPageNo(1);
  };
  const handleSelect = (ranges: any) => {
   
    const { selection } = ranges;
  
    setState([selection]);
    let startDate = convert(selection.startDate);
      let endDate = convert(selection.endDate);
      let reqDateStart = startDate + "T00:00:00Z";
      let reqDateEnd = endDate + "T24:00:00Z";
    
      setRequestedDateStart(reqDateStart);
    setRequestedDateEnd(reqDateEnd);
    setPageNo(1);
  };
  const steps = [
    "SUBMITTED",
    "IN_EVALUATION",
    "APPROVED",
    "PLATFORM_INTEGRATION",
    "COMPLETED",
    "REJECTED",
  ];

  useEffect(() => {
    let sts = status;
    for (var i = 0; i < requestList.length; i++) {
      let element = document.getElementById("buttonRef" + i);
      if (element) {
        switch (element.innerHTML) {
          case "Submitted" || "In Evaluation" || "Approved" || " Integration":
            //element?.style.backgroundColor
            element.style.backgroundColor = "#d5eeff";
            element.style.color = "#358bc5";
            break;
          case "Rejected":
            element.style.backgroundColor = "#f8dde2";
            element.style.color = "#c93a3a";
            break;
          case "Completed":
            element.style.backgroundColor = "#d9f3dc";
            element.style.color = "#097718";
            break;
        }
      }
    }
  }, [status]);
  function convert(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  useEffect(() => {
    if (requestedDateStart && requestedDateEnd) {
    
      let startDate = convert(state[0]?.startDate);
      let endDate = convert(state[0]?.endDate);
      let str = `${moment(startDate).format("MMM DD YYYY")} - ${moment(
        endDate
      ).format("MMM DD YYYY")}`;
      setShowDate(str);
    } else {
      setShowDate('');
    }
  }, [requestedDateStart, requestedDateEnd]);
  const getDate = (dateString: string) => {
    const local = new Date(dateString).toISOString();
    let date = new Date(local);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1);
    let dt = String(date.getDate());

    if (Number(dt) < 10) {
      dt = "0" + dt;
    }
    if (Number(month) < 10) {
      month = "0" + month;
    }
    let finalDate = dt + "-" + month + "-" + year;
    return finalDate;
  };

  const handleChangeStatus = (
    e: React.ChangeEvent<{ value: unknown }>,
    index: number,
    companyId: number,
    id: number
  ) => {
    let changeValue = e.target.value as string;
    setStatusChange(changeValue);
    const element = document.getElementsByName(`select${index}`);
    if (element) {
   
    }
    let appRequestId = id;
   
    let cmsChangeRequest = {
      status: changeValue,
    };
    dispatch(requestAccessDispatchers.setReqList(produce(requestList, draft => {
      draft[index].status = changeValue;
    })));
    dispatch(
      requestAccessDispatchers.cmsChangeReqStatus(
        cmsChangeRequest,
        companyId,
        appRequestId,
        {
          success: (response: any) => {
          
          },
        }
      )
    );
  };
  const handleSearch = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSearch(value);
    setPageNo(1);
  }
  const handleClear = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setClear(value);
    switch (value) {
      case 'Clear Search':
        setSearch('');
        setPageNo(1);
        break;
      case 'Clear Date':
        setRequestedDateEnd('');
        setRequestedDateStart('');
        setShowDate('');
        setPageNo(1);
        break;
      case 'Clear Both':
        setSearch('');
        setRequestedDateEnd('');
        setRequestedDateStart('');
        setShowDate('');
        setPageNo(1);
          break;
    }
  }

  const handleChangeExpanded =
  (idx: number) => {
   
    setCurrentIdx((currentValue) => (currentValue !== idx ? idx : -1));
  };
  return (
    <div className={pendingClasses.pendingRequest} ref={refParent}>
      <div className={pendingClasses.header}>
        <Grid container spacing={2}>
          <Grid
            item
            xs
            className={pendingClasses.spansRequset}
            style={{ display: "flex", alignItems: "center" }}
          >
            <label style={{whiteSpace: 'nowrap'}}>Request date</label>

            <FormControl variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onMouseEnter={() => setShowDateRange(true)}
                style={{ width: "400px", marginLeft: "10px" }}
                value={showDate}
              />
            </FormControl>
            {showDateRange ? (
              <div
                className={pendingClasses.datePicker}
                style={{zIndex:2000}}
                onMouseLeave={() => setShowDateRange(false)}
              >
                <DateRangePicker
                  showSelectionPreview={true}
                  ranges={state}
                  moveRangeOnFirstSelection={false}
                  onChange={handleSelect}
                />
              </div>
            ) : null}
          </Grid>
          <Grid item xs={2} className={pendingClasses.spans}>
            <TextField
              id="outlined-select-currency"
              select
              label="Status"
              style={{ width: "150px" }}
              value={statusSearch}
              onChange={handleChangeSelect}
            >
              <MenuItem
                value={
                  "SUBMITTED,IN_EVALUATION,APPROVED,PLATFORM_INTEGRATION,COMPLETED,REJECTED"
                }
              >
                All
              </MenuItem>
              {steps.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs className={pendingClasses.searchSpans}>
            <FormControl variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <Search style={{ color: "cornflowerblue" }} />
                  </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={search}
                onChange={handleSearch}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2} className={pendingClasses.spans}>
            <TextField
              id="outlined-select-currency"
              select
              label="Clear"
              style={{ width: "150px" }}
              value={clear}
              onChange={handleClear}
            >
                <MenuItem key='Clear Search' value={'Clear Search'}>
                Clear Search
              </MenuItem>
              <MenuItem key='Clear Date' value={'Clear Date'}>
                Clear Date
              </MenuItem>
              <MenuItem key='Clear Both' value={'Clear Both'}>
                Clear Both
                </MenuItem>
            
            </TextField>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid container spacing={2}>
          <Accordion expanded={false} className={pendingClasses.accSetHeader}>
            <AccordionSummary
              expandIcon={null}
              aria-controls="panel1a-content"
              aria-expanded={false}
              id="panel1a-header"
            >
              <Grid xs className={pendingClasses.spans}>
                Game Name
              </Grid>
              <Grid xs className={pendingClasses.spans}>
                Org Name
              </Grid>
              <Grid xs className={pendingClasses.spans}>
                Status
              </Grid>
              <Grid xs className={pendingClasses.spans} style={{whiteSpace: 'nowrap'}}>
                Requested On
              </Grid>
              <Grid xs className={pendingClasses.spans}>
                Completed
              </Grid>
              <Grid xs className={pendingClasses.spans}>
                Requestor
              </Grid>
              <Grid xs className={pendingClasses.spans}>
                Email
              </Grid>
            </AccordionSummary>
          </Accordion>
        </Grid>
      </div>
      <div>
        {requestList && requestList.length !== 0 ? requestList.map((data, index) => (
          <Grid
            container
            spacing={2}
            style={{ display: "flex", alignItems: "center" }}
            key={data.id}
          >
            <Accordion
              expanded={index === currentIdx} onClick={() => handleChangeExpanded(index)}
              className={pendingClasses.accSet}>
              <AccordionSummary
                style={{display: 'flex',alignItems: 'center'}}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid xs className={pendingClasses.spans}>
                  {data.name}
                </Grid>
                <Grid xs className={pendingClasses.spans}>
                  {data.companyName? data.companyName: '-----'}
                </Grid>
                <Grid xs className={pendingClasses.spans}>
                 
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Status"
                    style={{ width: "150px" }}
                    name={`select${index}`}
                    placeholder={data.status}
                    defaultValue={data.status}
                    disabled={data.status === "COMPLETED" ? true : false}
                    onChange={(e) => {
                      handleChangeStatus(e, index, data.companyId, data.id)
                    }
                    }
                    className={pendingClasses.formControl}
                  >
                    {steps.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid xs className={pendingClasses.spans} style={{whiteSpace: 'nowrap'}}>
                  {data.createdAt ? getDate(data.createdAt) : "-----"}
                </Grid>
                <Grid xs className={pendingClasses.spans}>
                  {data.completedAt ? getDate(data.completedAt) : "-----"}
                </Grid>
                <Grid xs className={pendingClasses.spans}>
                  {data.requesterName}
                </Grid>
                <Grid xs className={pendingClasses.spans}>
                  {data.requesterEmail}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box style={{ width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs>
                      <Grid container spacing={2}>
                        <Grid item xs className={pendingClasses.infoDiv}>
                          <div >
                          <b style={{marginLeft: '15px'}}>Platform</b> <br />
                          <Typography className={pendingClasses.chip}>
                            {data.platform.join('\n')}
                           
                          </Typography>
                          </div>
                          <div >
                          <b style={{marginLeft: '15px'}}>Format</b> <br />
                          <Typography className={pendingClasses.chip}>
                            {data.format.join('\n')}
                           
                          </Typography>
                          </div>
                         
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs className={pendingClasses.infoDiv}>
                          { data.url? <div >
                          <b style={{marginLeft: '15px'}}>Website</b> <br />
                          <Typography className={pendingClasses.chip}>
                            {data.url}
                           
                          </Typography>
                          </div>:null}
                        </Grid>
                        
                      </Grid>
                    </Grid>
                    <Grid item xs>
                     
                    <b>Other Information</b> <br />
                    { data.otherInformation?  <Typography>{data.otherInformation}</Typography>:null}
                   </Grid>
                    
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        )): <Typography style={{textAlign : 'center'}}>No data to show of this date/status/field (Please change date/status/field to see result)</Typography>}
        {requestList.length !==0 ? (<div className={pendingClasses.paginationDiv}>
          <Pagination
            
            color="primary"
            count={totalCount}
            page={pageNo}
            onChange={handleChange}
          />
          {requestList.length === 1 ? (<Typography>1 of 1</Typography>) : <div className={pendingClasses.limitDiv}>
            <label className={pendingClasses.limitLabel}>
              {firstIndex}-{lastIndex} of {total}
            </label>
            
          </div>}
          <Snackbar
            open={Boolean(snackBarErrorText)}
            autoHideDuration={3000}
            onClose={() => setSnackBarErrorText("")}
          >
            <Alert severity="error">{snackBarErrorText}</Alert>
          </Snackbar>

          <Snackbar
            open={Boolean(snackBarSuccessText)}
            autoHideDuration={3000}
            onClose={() => setSnackBarSuccessText("")}
          >
            <Alert severity="success">{snackBarSuccessText}</Alert>
          </Snackbar>
        </div>): null}
      </div>
    </div>
  );
};

export default ManageRequest;
