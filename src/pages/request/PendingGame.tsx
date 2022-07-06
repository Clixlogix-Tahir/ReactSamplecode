import {
  Accordion,
  AccordionDetails, AccordionSummary, Box, Grid, makeStyles, Step,
  StepLabel, Stepper, Theme, Typography
} from "@material-ui/core";
import {
  Cancel, CheckCircle, NavigateNext as ExpandMoreIcon
} from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import React, { createRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import pendingStyles from "../../theme/pendingStyles";
import { requestAccessDispatchers } from "./requestControlSlice";
import { TReqList, TReqListResp } from "./requestsControlTypes";
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

const PendingGame = () => {
  const pendingClasses = pendingStyles();
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const statusRef: React.RefObject<HTMLInputElement> = createRef();
  const [requestList, setRequestList] = useState<TReqList[]>([]);
  const [totalCount, setTotalCount] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>(0);
  const [currentIdx, setCurrentIdx] = React.useState(-1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [status, setStatus] = useState("Completed");
  const [firstIndex, setFirstIndex] = useState<number>(0);
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [lastPageElement, setLastPageElement] = useState<number>(0);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { cmsRequestList } = useAppSelector(
    (state) => state.requestControlSlice
  );
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
    setTotalCount(cmsRequestList.response?.pagination.totalPages);
  }, [cmsRequestList]);

  useEffect(() => {
    let sts = status;
    if (requestList) {
      for (var i = 0; i < requestList.length; i++) {
        let element = document.getElementById("buttonRef" + i);
        if (element) {
          switch (element.innerHTML) {
            case "Submitted":
              element.style.backgroundColor = "#d5eeff";
              element.style.color = "#4890e8";
              break;
            case "In Evaluation":
              element.style.backgroundColor = "#d5eeff";
              element.style.color = "#4890e8";
              break;
            case "Approved":
              element.style.backgroundColor = "#d5eeff";
              element.style.color = "#4890e8";
              break;
            case "Platform Integration":
              element.style.backgroundColor = "#d5eeff";
              element.style.color = "#4890e8";
              break;
            case "Rejected":
              element.style.backgroundColor = "#f8dde2";
              element.style.color = "#c93a3a";
              break;
            case "Completed":
              element.style.backgroundColor = "#d9f3dc";
              element.style.color = "#46bf5a";
              break;
          }
        }
      }
    }
  }, [status, requestList]);
  useEffect(() => {
    if (pageNo === totalCount) {
      if (total) {
        setFirstIndex(8 * (pageNo - 1) + 1);/// ps* currentPage +1
        setLastIndex(total);
      }
    } else {
      setFirstIndex(8 * (pageNo - 1) + 1);
      setLastIndex(8 * pageNo);
    }
  }, [lastPageElement, pageNo, total, totalCount]);

  useEffect(() => {
    setCurrentIdx(-1);
    let cmsReqList = {
      pn: pageNo - 1,
      ps: limit,
      sortBy: "createdAt",
      sortOrder: "DESC",
    };
    dispatch(
      requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
        success: (response: TReqListResp) => {
        
          
          setRequestList(response.appRequests);
          setLastPageElement(response.appRequests.length);
          setTotal(response.pagination.totalResults);
        },
      })
    );
  }, [pageNo, limit]);
  const getLevel = (status: string) => {
    let level = 0;
    switch (status) {
      case "SUBMITTED":
        level = 1;
        break;
      case "IN_EVALUATION":
        level = 2;
        break;
      case "APPROVED":
        level = 3;
        break;
      case "REJECTED":
        level = 3;
        break;
      case "PLATFORM_INTEGRATION":
        level = 4;
        break;
      case "COMPLETED":
        level = 5;
        break;
    }
    return level;
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
  };
  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    let number = event.target.value as number;
    setLimit(number);
  };
  const steps = [
    "Submitted",
    "In evaluation",
    "Approved" || "Rejected",
    "Platform Integration",
    "Completed",
  ];

  const CompleteDiv = {
    backgroundColor: "#C3E5AE",
    height: "25px",
    width: "25px",
    borderRadius: "15px",
    marginTop: "3px",
  };
  const uncompleteDev = {
    backgroundColor: "#9ADCFF",
    height: "25px",
    width: "25px",
    borderRadius: "15px",
    marginTop: "3px",
  };
  const errorStyle = {
    color: "black",
  };
  const selectIcon = () => {
    return "";
  };
  const checkStages = (props: CustomIconPropType) => {
    if (props.completed) {
      return (
        <CheckCircle style={{ color: "cornflowerblue", fontSize: "30px" }} />
      );
    } else {
      return <div style={uncompleteDev}></div>;
    }
  };
  const checkFifthStage = (props: CustomIconPropType) => {
    if (props.completed) {
      return (
        <CheckCircle
          style={{
            color: "#91C483",
            fontSize: "30px",
          }}
        />
      );
    } else {
      return <div style={CompleteDiv}></div>;
    }
  };
  const checkApproval = (props: CustomIconPropType) => {
    if (props.completed) {
      if (props.error) {
        return <Cancel style={{ color: "red", fontSize: "30px" }} />;
      } else {
        return (
          <CheckCircle style={{ color: "cornflowerblue", fontSize: "30px" }} />
        );
      }
    } else {
      return <div style={uncompleteDev}></div>;
    }
  };
  const CustomStepIcon = (props: CustomIconPropType, status: string) => {
    //const classes = useStyles();
    const { active, completed } = props;
   
    const stepIcons: any = {
      1: checkStages(props),
      2: checkStages(props),
      3: checkApproval(props),
      4: checkStages(props),
      5: checkFifthStage(props),
    };

    return <div className={selectIcon()}>{stepIcons[String(props.icon)]}</div>;
  };
  const getInProgressStatus = (label: string, data: TReqList) => {
    const labelStatus = label.toLowerCase();
    const value = data.status.replace("_", " ").toLowerCase();

    if (labelStatus === value) {
    
      if (labelStatus !== "rejected" && labelStatus !== "completed") {
        return "In Progress";
      } else {
        if (labelStatus === "completed") {
          return getDate(data.completedAt);
        }
      }
    } else {
      if (labelStatus === "approved" && value === "rejected") {
        return getDate(data.updatedAt);
      } else {
        return null;
      }
    }
  };
  const getDate = (dateString: string) => {
    const local = new Date(dateString).toISOString();
    let date = new Date(local);
    let year = date.getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let month = moment(date.getMonth()).format("MMMM");
    let dt = String(date.getDate());

    if (Number(dt) < 10) {
      dt = "0" + dt;
    }

    let finalDate = dt + " " + month + " " + year;
    return finalDate;
  };
  const getString = (str: string) => {
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
  };

  const handleChangeExpanded =
    (idx: number) => {
      setCurrentIdx((currentValue) => (currentValue !== idx ? idx : -1));
    };
  return (
    <div className={pendingClasses.pendingRequest} ref={refParent}>
      <Grid container spacing={2}>
        <Accordion className={pendingClasses.accSetHeader} expanded={false}>
          <AccordionSummary
            expandIcon={null}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid className={pendingClasses.gameBox}>
              <span className={pendingClasses.headTitle}>Game name</span>
            </Grid>
            <Grid className={pendingClasses.reqBox}>
              <span className={pendingClasses.headTitle}>Requested On</span>
            </Grid>
            <Grid className={pendingClasses.reqStatusBox}>
              <span className={pendingClasses.headTitle}>Request Status</span>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </Grid>
      <div>
        {requestList && requestList.length !== 0 ? (
          requestList.map((data, index) => (
            <Grid container spacing={2}>
              <Accordion
                key={index}
                expanded={index === currentIdx} onClick={()=>handleChangeExpanded(index)}
                className={pendingClasses.accSet}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className={pendingClasses.accSummary}
                >
                  <Grid className={pendingClasses.gameBox}>
                    <div className={pendingClasses.spans}>
                      <b style={{ color: "black", fontSize: "16px" }}>
                        {data.name}
                      </b>
                    </div>
                  </Grid>
                  <Grid className={pendingClasses.reqBox}>
                    <div className={pendingClasses.date}>
                      {getDate(data.createdAt)}
                    </div>
                  </Grid>
                  <Grid className={pendingClasses.reqStatusBox}>
                    <div className={pendingClasses.spans}>
                      <div
                        className={pendingClasses.statusDiv}
                        id={"buttonRef" + index}
                      >
                        {getString(data.status.replace("_", " ").toLowerCase())}
                      </div>
                    </div>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Box style={{ width: "100%" }}>
                    <Stepper
                      activeStep={getLevel(data.status)}
                      alternativeLabel
                      className={pendingClasses.stepperClass}
                    >
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel
                            StepIconComponent={CustomStepIcon}
                            optional={
                              label === "Submitted"
                                ? getDate(data.createdAt)
                                : getInProgressStatus(label, data)
                            }
                            error={data.status === "REJECTED" ? true : false}
                          >
                            {data.status === "REJECTED" && label === "Approved"
                              ? "Rejected"
                              : label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <Grid container spacing={2}>
                          <Grid item xs className={pendingClasses.infoDiv}>
                            <div>
                              <b style={{ marginLeft: "15px" }}>Platform</b>{" "}
                              <br />
                              <Typography className={pendingClasses.chip}>
                                {data.platform
                                  .join("\n")
                                  .replaceAll("_", " ")
                                  .toLowerCase()}
                              </Typography>
                            </div>
                            <div>
                              <b style={{ marginLeft: "15px" }}>Format</b>{" "}
                              <br />
                              <Typography className={pendingClasses.chip}>
                                {data.format
                                  .join("\n")
                                  .replaceAll("_", " ")
                                  .toLowerCase()}
                              </Typography>
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs className={pendingClasses.infoDiv}>
                            {data.url ? (
                              <div>
                                <b style={{ marginLeft: "15px" }}>Website</b>{" "}
                                <br />
                                <Typography className={pendingClasses.chip}>
                                  {data.url}
                                </Typography>
                              </div>
                            ) : null}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs className={pendingClasses.otherInfo}>
                        <b>Other Information</b> <br />
                        {data.otherInformation ? (
                          <Typography>{data.otherInformation}</Typography>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))
        ) : (
          <Typography style={{ textAlign: "center" }}>
            No data to show
          </Typography>
        )}

        {requestList.length !== 0 ?  (
          <div className={pendingClasses.paginationDiv}>
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
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PendingGame;
