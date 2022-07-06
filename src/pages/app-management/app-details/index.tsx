/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  TableContainer,
  TableFooter,
  TableHead
} from '@material-ui/core';
import React, { useEffect } from 'react';
import {
  useAppDispatch, useAppRedirect, useAppSelector
} from '../../../common/hooks';
import { TFormFieldString } from "../../../types/formFields";
import { appManagementDispatchers, defaultAppForm } from '../appManagementSlice';
import { toAppDetailsRequest, toAppManagementForm } from '../appManagementConverter';
import { TAppDetails, TAppForm } from '../appManagementTypes';
import { appManagementApi } from '../appManagementApi';
import LoaderPaper from '../../../components/LoaderPaper';
import { CONSTANTS, XHR_STATE } from '../../../common/constants';
import { Alert } from '@material-ui/lab';
import HandyDialog from '../../../components/HandyDialog';
import { makeStyles } from '@material-ui/styles';
import { AppDetailFormColumnNames, acceptedTypes, imageUrlFields } from '../constants';
import globalStyles from '../../../theme/globalStyles';
import AppManagement from '..';
import { ROUTES, URL_PART_APP_ID } from '../../../common/constants';
import { CircularProgress } from '@material-ui/core';
import './fileUpload.css';
import styled from 'styled-components';

const useRowStyles = makeStyles({
  root: {
    position: 'relative',
    marginTop: '3rem',
    '& .MuiBox-root': {
      position: 'relative',
    },
    '& th': {
      fontWeight: 'bold',
    },
    '& .MuiFilledInput-inputMarginDense': {
      paddingTop: 6,
    },
  },
  controls: {
    position: 'absolute',
    top: '-3rem',
    right: 0,
    '& button + button': {
      marginLeft: '1rem',
    }
  },
  customLoader: {
    '& > div': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgb(255 255 255 / 72%)',
    zIndex: 1,
    backdropFilter: 'blur(1px)',
    height: '100%',
      '& .MuiPaper-root': {
        minHeight: 40,
        top: 'calc(50vh - 3rem - 64px - 62px)',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      },
    },
  },
});

const AppDetails: React.FC<any> = () => {
  const { apps, selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const [isEditing, setIsEditing] = React.useState(false);
  const globalStylesClasses = globalStyles();
  const classes = useRowStyles();
  const dispatch = useAppDispatch();
  const changeRoute = useAppRedirect();
  const { updateAppDetails } = useAppSelector(state => state.appManagementSlice);
  const [loading, setLoading] = React.useState(false);
  const [showSavedSuccess, setShowSavedSuccess] = React.useState(false);
  const [showSavedError, setShowSavedError] = React.useState(false);
  const [showDiffDialog, setShowDiffDialog] = React.useState(false);
  const [isFormEdited, setFormEdited] = React.useState<boolean>(false);
  const [app, setApp] = React.useState<TAppDetails | null>(null);
  const [form, setForm] = React.useState<TAppForm>({ ...defaultAppForm });

  //image upload related fields
  const [realCurrencyImage, setRealCurrencyImage] = React.useState<File | null>();
  const [virtualCurrencyImage, setVirtualCurrencyImage] = React.useState<File | null>();
  const [ticketImage, setTicketImage] = React.useState<File | null>();
  const [virtualCurrencyMultiplierIconImage, setVirtualCurrencyMultiplierIconImage] = React.useState<File | null>();
  const [xpIconImage, setXpIconImage] = React.useState<File | null>();
  const [xpMultiplierIconImage, setXpMultiplierIconImage] = React.useState<File | null>();
  const [showUploadFileTypeError, setShowUploadFileTypeError] = React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] = React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] = React.useState<boolean>(false);
  const [imageUploadingFieldName, setImageUploadingFieldName] = React.useState<string>('');


  useEffect(() => {
    loadUpdatedAppDetailsAndForm();
    if (selectedApp && selectedApp !== CONSTANTS.MISC.SAMPLE_APP) {
      let url = ROUTES.APP_DETAILS.replace(URL_PART_APP_ID, selectedApp) + window.location.search;
      changeRoute(url);
    }
  }, [selectedApp]);

  const loadUpdatedAppDetailsAndForm = async () => {
    if (selectedApp) {
      // todo getting CORS error
      setLoading(true);
      const response = await appManagementApi.getAppDetails( selectedApp );
      setLoading(false);
      setApp(response);
      setForm(toAppManagementForm(response));
    }
  };

  const setFieldValue = (e: React.ChangeEvent<{ value: unknown }>, fieldName: string) => {
    let givenValue = e.target.value as string;
    setFormData(fieldName, givenValue);
  };

  useEffect(() => {
    setFormEdited(checkIfFormIsEdited());
  }, [form]);

  const saveData = (formCopy?:TAppForm) => {
    setFormEdited(false);
    setShowDiffDialog(false);
    dispatch(appManagementDispatchers.updateAppDetails(toAppDetailsRequest(formCopy?formCopy:form), {
      success: (app: TAppDetails) => {
        setIsEditing(false);
        setShowSavedSuccess(true);
        setApp(app);
      },
      error: () => setShowSavedError(true),
    })).then( () => loadUpdatedAppDetailsAndForm());
  };

  const showDiffAndConfirmSaveDialog = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDiffDialog(true);
  };

  const checkIfFormIsEdited = (): boolean => {
    if (form && app && AppDetailFormColumnNames) {
      for (let column of AppDetailFormColumnNames) {
        if (column[0] !== 'urls') {
          let formField = form[column[0]] as TFormFieldString;
          if (formField.value !== app[column[0]]) {
            console.log('Field ' + column[0] + ' changed.');
            return true;
          }
        }
      }
    }
    return false;
  }

  const handleImageUpload = async (selectedFile: File, fieldName: string) => {
    if (!selectedFile) {
      setShowFileNotSelectedError(true);
      return;
    }

    if ((selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
      console.log('Image of type ' + selectedFile.type + ' selected.');
      const formData = new FormData();
      formData.append('file', selectedFile);

      setImageUploadingFieldName(fieldName);
      const response = await appManagementApi.uploadFile(formData);
      setImageUploadingFieldName('');


      if (response.message === "success") {
        console.log('Selected image uploaded successfully.');
        setShowFileUploadSuccess(true);
        saveData({
          ...form, [fieldName]: {
            ...form[fieldName],
            value: response.url
          }
        });
        nullifyImageField(fieldName);
      }
      else {
        console.log('file upload failed');
        setShowFileUploadError(true);
      }
    } else {
      setShowUploadFileTypeError(true);
    }
  };

  const setFormData = (fieldName: string, givenValue: string) => {
    setForm({
      ...form,
      [fieldName]: {
        ...form[fieldName],
        value: givenValue.substring(0, 155)
      }
    });
  };

  const nullifyImageField = (fieldName: string) => {
    switch (fieldName) {
      case imageUrlFields.REAL_CURRENCY_IMAGE: {
        setRealCurrencyImage(null);
        break;
      }
      case imageUrlFields.VIRTUAL_CURRENCY_IMAGE: {
        setVirtualCurrencyImage(null);
        break;
      }
      case imageUrlFields.TICKET_IMAGE: {
        setTicketImage(null);
        break;
      }
      case imageUrlFields.VIRTUAL_CURRENCY_MULTIPLIER_ICON_IMAGE: {
        setVirtualCurrencyMultiplierIconImage(null);
        break;
      }
      case imageUrlFields.XP_ICON_IMAGE: {
        setXpIconImage(null);
        break;
      }
      case imageUrlFields.XP_MULTIPLIER_ICON_IMAGE: {
        setXpMultiplierIconImage(null);
        break;
      }
      default: {
        return;
      }
    }
  }

  return (
    <AppManagement>
    {apps.list.length > 0 &&
    <form onSubmit={showDiffAndConfirmSaveDialog} noValidate className={classes.root}>
      <div className={classes.controls}>
        {!isEditing && !imageUploadingFieldName &&
          <Button variant="contained" color="primary"
            onClick={e => setIsEditing(isEditing => !isEditing)}
          >
            Edit
          </Button>
        }
        {isEditing &&
          <React.Fragment>
            <Button variant="contained" color="default"
              onClick={e => setIsEditing(isEditing => !isEditing)}
              disabled={updateAppDetails.loading === XHR_STATE.IN_PROGRESS}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary"
              type="submit"
              disabled={updateAppDetails.loading === XHR_STATE.IN_PROGRESS || !isFormEdited}
            >
              Save
            </Button>
          </React.Fragment>
        }
      </div>

      <Box margin={5}>
        {loading && <div className={classes.customLoader}><LoaderPaper /></div>}
        <div>
          <Table size="small" aria-label="purchases">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">App ID</TableCell>
                <TableCell>{app?.appId}</TableCell>
                <TableCell></TableCell>
              </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Currency</TableCell>
                  {
                    app?.currencies && <TableCell>{app?.currencies.join(', ')}</TableCell>
                  }
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Currency Display Name</TableCell>
                  {
                    app?.currencyDisplayNames && <TableCell>{app?.currencyDisplayNames.join()}</TableCell>
                  }
                  <TableCell></TableCell>
                </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Firebase Project ID</TableCell>
                <TableCell>{app?.firebaseProjectId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.firebaseProjectId.value}
                        onChange={e => setFieldValue(e, 'firebaseProjectId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">BI Test App ID</TableCell>
                <TableCell>{app?.biTestAppId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.biTestAppId.value}
                        onChange={e => setFieldValue(e, 'biTestAppId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">BI Test App Token</TableCell>
                <TableCell>{app?.biTestAppToken}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.biTestAppToken.value}
                        onChange={e => setFieldValue(e, 'biTestAppToken')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">BI App ID</TableCell>
                <TableCell>{app?.biAppId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.biAppId.value}
                        onChange={e => setFieldValue(e, 'biAppId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">BI App Token</TableCell>
                <TableCell>{app?.biAppToken}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.biAppToken.value}
                        onChange={e => setFieldValue(e, 'biAppToken')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">App Param URL</TableCell>
                <TableCell>
                  <a href={app?.appParamUrl} target="_blank" rel="noopener noreferrer">
                    {app?.appParamUrl}
                  </a>
                </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id="App-Param-URL"
                        size="small"
                        variant="filled"
                        value={form.appParamUrl.value}
                        onChange={e => setFieldValue(e, 'appParamUrl')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">App Display Name</TableCell>
                <TableCell>{app?.appDisplayName}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id={`${selectedApp}-App-Display-Name`}
                        size="small"
                        variant="filled"
                        value={form.appDisplayName.value}
                        onChange={e => setFieldValue(e, 'appDisplayName')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Company ID</TableCell>
                <TableCell>{app?.companyId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id={`${selectedApp}-Company-ID`}
                        size="small"
                        variant="filled"
                        value={form.companyId.value}
                        onChange={e => setFieldValue(e, 'companyId')}
                        type="number"
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Released As</TableCell>
                <TableCell>{app?.releasedAs}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id={`${selectedApp}-Released-As`}
                        size="small"
                        variant="filled"
                        value={form.releasedAs.value}
                        onChange={e => setFieldValue(e, 'releasedAs')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Tapjoy Android App ID</TableCell>
                <TableCell>{app?.tapjoyAndroidAppId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id={`${selectedApp}-Tapjoy-Android-App-ID`}
                        size="small"
                        variant="filled"
                        value={form.tapjoyAndroidAppId.value}
                        onChange={e => setFieldValue(e, 'tapjoyAndroidAppId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Tapjoy iOS App ID</TableCell>
                <TableCell>{app?.tapjoyIOSAppId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        id={`${selectedApp}-Tapjoy-iOS-App-ID`}
                        size="small"
                        variant="filled"
                        value={form.tapjoyIOSAppId.value}
                        onChange={e => setFieldValue(e, 'tapjoyIOSAppId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Tapjoy Secret Android</TableCell>
                <TableCell>{app?.tapjoySecretAndroid}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.tapjoySecretAndroid.value}
                        onChange={e => setFieldValue(e, 'tapjoySecretAndroid')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Tapjoy Secret iOS</TableCell>
                <TableCell>{app?.tapjoySecretIOS}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.tapjoySecretIOS.value}
                        onChange={e => setFieldValue(e, 'tapjoySecretIOS')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Screen Orientation</TableCell>
                <TableCell>{app?.screenOrientation}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.screenOrientation.value}
                        onChange={e => setFieldValue(e, 'screenOrientation')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Game URL</TableCell>
                <TableCell>
                  <a href={app?.gameURL} target="_blank" rel="noopener noreferrer">
                    {app?.gameURL}
                  </a>
                </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.gameURL.value}
                        onChange={e => setFieldValue(e, 'gameURL')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Domain Address</TableCell>
                <TableCell>{app?.domainAddress}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.domainAddress.value}
                        onChange={e => setFieldValue(e, 'domainAddress')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Apple Store Name</TableCell>
                <TableCell>{app?.appleStoreName}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.appleStoreName.value}
                        onChange={e => setFieldValue(e, 'appleStoreName')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Apple ID</TableCell>
                <TableCell>{app?.appleId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.appleId.value}
                        onChange={e => setFieldValue(e, 'appleId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Moengage API ID</TableCell>
                <TableCell>{app?.moengageAppIdDataApiId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.moengageAppIdDataApiId.value}
                        onChange={e => setFieldValue(e, 'moengageAppIdDataApiId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Moengage API Secret</TableCell>
                <TableCell>{app?.moengageApiSecret}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.moengageApiSecret.value}
                        onChange={e => setFieldValue(e, 'moengageApiSecret')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">API Key</TableCell>
                <TableCell>{app?.dataApiKey}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.dataApiKey.value}
                        onChange={e => setFieldValue(e, 'dataApiKey')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Adjust App Token</TableCell>
                <TableCell>{app?.adjustAppToken}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.adjustAppToken.value}
                        onChange={e => setFieldValue(e, 'adjustAppToken')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Branch App ID</TableCell>
                <TableCell>{app?.branchAppId}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.branchAppId.value}
                        onChange={e => setFieldValue(e, 'branchAppId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Branch Key</TableCell>
                <TableCell>{app?.branchKey}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.branchKey.value}
                        onChange={e => setFieldValue(e, 'branchKey')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Branch Secret</TableCell>
                <TableCell>{app?.branchSecret}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.branchSecret.value}
                        onChange={e => setFieldValue(e, 'branchSecret')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">BI Management</TableCell>
                  <TableCell>
                    {app?.biManagementURL}
                  </TableCell>
                  <TableCell>
                    {isEditing &&
                      <FormControl>
                        <TextField
                          size="small"
                          variant="filled"
                          value={form.biManagementURL.value}
                          onChange={e => setFieldValue(e, 'biManagementURL')}
                        />
                      </FormControl>
                    }
                  </TableCell>
                </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Zeplin URL</TableCell>
                <TableCell>
                  <a href={app?.zeplinURL} target="_blank" rel="noopener noreferrer">
                    {app?.zeplinURL}
                  </a>
                </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.zeplinURL.value}
                        onChange={e => setFieldValue(e, 'zeplinURL')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Basic Auth Header Generator</TableCell>
                <TableCell>{app?.basicAuthenticationHeaderGenerator}</TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.basicAuthenticationHeaderGenerator.value}
                        onChange={e => setFieldValue(e, 'basicAuthenticationHeaderGenerator')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Android APK Link</TableCell>
                <TableCell>
                  <a href={app?.androidApkLink} target="_blank" rel="noopener noreferrer">
                    {app?.androidApkLink}
                  </a>
                </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.androidApkLink.value}
                        onChange={e => setFieldValue(e, 'androidApkLink')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Facebook Pixel ID</TableCell>
                  <TableCell>
                    {app?.facebookPixelId}
                  </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.facebookPixelId.value}
                        onChange={e => setFieldValue(e, 'facebookPixelId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Snapchat Pixel ID</TableCell>
                <TableCell>
                    {app?.snapchatPixelId}
                </TableCell>
                <TableCell>
                  {isEditing &&
                    <FormControl>
                      <TextField
                        size="small"
                        variant="filled"
                        value={form.snapchatPixelId.value}
                        onChange={e => setFieldValue(e, 'snapchatPixelId')}
                      />
                    </FormControl>
                  }
                </TableCell>
              </TableRow>
              {/*} <TableRow>
                  <TableCell component="th" scope="row"> 
                    {isSelectedAppCrypto ? 'JRX Image URL' : 'Real Currency Image URL'}
                  </TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.realCurrencyImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.realCurrencyImage} alt="Real Currency" width="50" height="50"></img>
                        <a href={app?.urls.realCurrencyImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.realCurrencyImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.REAL_CURRENCY_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.REAL_CURRENCY_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setRealCurrencyImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(realCurrencyImage as File, imageUrlFields.REAL_CURRENCY_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }
                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">Virtual Currency(Coin) Image URL</TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.virtualCurrencyImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.virtualCurrencyImage} alt="Virtual Currency(Coin)" width="50" height="50"></img>
                        <a href={app?.urls.virtualCurrencyImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.virtualCurrencyImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.VIRTUAL_CURRENCY_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.VIRTUAL_CURRENCY_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setVirtualCurrencyImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(virtualCurrencyImage as File, imageUrlFields.VIRTUAL_CURRENCY_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }

                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">Virtual Currency(Ticket) Image URL</TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.ticketImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.ticketImage} alt="Virtual Currency(Ticket)" width="50" height="50"></img>
                        <a href={app?.urls.ticketImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.ticketImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.TICKET_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.TICKET_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setTicketImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(ticketImage as File, imageUrlFields.TICKET_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }

                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">Virtual Currency Multiplier Icon Image URL</TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.virtualCurrencyMultiplierIconImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.virtualCurrencyMultiplierIconImage} alt="Virtual Currency Multiplier Icon" width="50" height="50"></img>
                        <a href={app?.urls.virtualCurrencyMultiplierIconImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.virtualCurrencyMultiplierIconImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.VIRTUAL_CURRENCY_MULTIPLIER_ICON_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.VIRTUAL_CURRENCY_MULTIPLIER_ICON_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setVirtualCurrencyMultiplierIconImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(virtualCurrencyMultiplierIconImage as File, imageUrlFields.VIRTUAL_CURRENCY_MULTIPLIER_ICON_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }

                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }

                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">Xp Icon Image URL</TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.xpIconImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.xpIconImage} alt="Xp Icon" width="50" height="50"></img>
                        <a href={app?.urls.xpIconImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.xpIconImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.XP_ICON_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.XP_ICON_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setXpIconImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(xpIconImage as File, imageUrlFields.XP_ICON_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }

                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }

                </TableRow>

                <TableRow>
                 <TableCell component="th" scope="row">Xp Multiplier Icon Image URL</TableCell>
                  <TableCell>
                    {
                      app?.urls && app?.urls.xpMultiplierIconImage &&
                      <div className='image-and-url-div'>
                        <img src={app?.urls.xpMultiplierIconImage} alt="Xp Multiplier Icon" width="50" height="50"></img>
                        <a href={app?.urls.xpMultiplierIconImage} target="_blank" rel="noopener noreferrer">
                          {app?.urls.xpMultiplierIconImage}
                        </a>
                      </div>
                    }
                  </TableCell>

                  {!isEditing && imageUploadingFieldName === imageUrlFields.XP_MULTIPLIER_ICON_IMAGE &&
                    <TableCell>
                      <div className="uploadProgressDiv"><CircularProgress /></div>
                      <div className="uploadProgressDiv">File Upload in progress</div>
                    </TableCell>
                  }

                  {!isEditing && imageUploadingFieldName !== imageUrlFields.XP_MULTIPLIER_ICON_IMAGE &&
                    <TableCell>
                      <input type="file"
                        onChange={e => e.target.files && setXpMultiplierIconImage(e.target.files[0])}
                        accept={acceptedTypes.toString()}
                      />
                      <button className="upload-button" type="button" onClick={() => handleImageUpload(xpMultiplierIconImage as File, imageUrlFields.XP_MULTIPLIER_ICON_IMAGE)}>
                        Upload
                      </button>
                    </TableCell>
                  }

                  {isEditing &&
                    <TableCell>
                    </TableCell>
                  }

                </TableRow>*/}
            </TableBody>
          </Table>
        </div>
      </Box>
      
      <Snackbar
        open={showSavedSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSavedSuccess(false)}
      >
        <Alert onClose={() => setShowSavedSuccess(false)} severity="success">
          App details saved successfully!
        </Alert>
      </Snackbar>

        <Snackbar
          open={showUploadFileTypeError}
          autoHideDuration={3000}
          onClose={() => setShowUploadFileTypeError(false)}
        >
          <Alert onClose={() => setShowUploadFileTypeError(false)} severity="error">
            Sorry, only .jpeg and .png files can be uploaded!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showFileNotSelectedError}
          autoHideDuration={3000}
          onClose={() => setShowFileNotSelectedError(false)}
        >
          <Alert onClose={() => setShowFileNotSelectedError(false)} severity="error">
            Please select a file to upload!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showFileUploadError}
          autoHideDuration={3000}
          onClose={() => setShowFileUploadError(false)}
        >
          <Alert onClose={() => setShowFileUploadError(false)} severity="error">
            Could not upload the image. Please try again!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showFileUploadSuccess}
          autoHideDuration={3000}
          onClose={() => setShowFileUploadSuccess(false)}
        >
          <Alert onClose={() => setShowFileUploadSuccess(false)} severity="success">
            Image uploaded successfully!
          </Alert>
        </Snackbar>
      
      <HandyDialog
        open={showSavedError}
        title="Failed to save app details"
        content={
          <Typography>{updateAppDetails.error}</Typography>
        }
        onClose={() => setShowSavedError(false)}
        onOkClick={() => setShowSavedError(false)}
      />

      <HandyDialog
        open={showDiffDialog}
        title="Confirmation for field(s) updation"
        content={
          <TableContainer className={globalStylesClasses.columnHeaders}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                    <TableCell key='columnName'>Column</TableCell>
                    <TableCell key='currentValue'>Current Value</TableCell>
                    <TableCell key='editedValue'>New Value</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                { app && form &&
                  AppDetailFormColumnNames.map((column,index) => 
                  column[0] !== 'urls' && app[column[0]] !== form[column[0]].value ? (
                    <TableRow key={index}>
                    <TableCell key={column[1]}>{column[1]}</TableCell>
                    <TableCell key={app[column[0]] as string}>{app[column[0]]}</TableCell>
                    <TableCell key={form[column[0]].value}>{form[column[0]].value}</TableCell>
                    </TableRow>
                   ) : null
                  )
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Alert severity="info" style={{ marginTop: 24 }}>
                      Above displayed field(s) will be overridden with the new value(s). Do you want to proceed?
                    </Alert>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          
        }
        onClose={() => setShowDiffDialog(false)}
        onOkClick={() => saveData()}
        onCancelClick={() => setShowDiffDialog(false)}//hideMarkPendingConfirm}
        okText="Proceed"
        cancelText="Cancel"
      />
    </form>}
    </AppManagement>
  );
}

export default AppDetails;

