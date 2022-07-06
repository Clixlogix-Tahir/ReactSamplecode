import {
  Button
} from '@material-ui/core';
import React from 'react';
import {
  TValidationResonse
} from '../../common/common-types';
import {
  ROUTES,
  URL_PART_APP_ID,
  URL_PART_CHALLENGE_ID,
  XHR_STATE
} from '../../common/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useDefaultVCurrency,
  useValidVCurrencies
} from '../../common/hooks';
import HandyDialog from '../../components/HandyDialog';
import {
  ChallengesDispatchers, setMutateMode
} from './challenges-slice';
import {
  isChallengesFormValid,
  toChallengePayload
} from './converter';


type TChallengesFooterProps = {
}

function ChallengesFooter(props: TChallengesFooterProps) {
  const dispatch = useAppDispatch();
  const redirectTo = useAppRedirect();
  const {
    selectedApp
  } = useAppSelector(state => state.gameConfigForm);
  const {
    mutateMode,
    challenge,
    challenges,
    updatingChallenge,
    creatingChallenge,
  } = useAppSelector(state => state.challengesSlice);
  const [isFormInvalid, setIsFormInvalid] = React.useState<TValidationResonse>({ isValid: true, errors: [] });
  const allowedVirtualCurrencies = useValidVCurrencies(selectedApp);
  const defaultVCurrency = useDefaultVCurrency(selectedApp);

  return (
    <div>
      <Button
        onClick={e => redirectTo(ROUTES.CHALLENGES.replace(URL_PART_APP_ID, selectedApp))}
        disabled={challenges.loading === XHR_STATE.IN_PROGRESS}
      >
        Cancel
      </Button>
      {mutateMode === 'View' &&
        <Button variant="contained" color="primary"
          disabled={challenges.loading === XHR_STATE.IN_PROGRESS ||
            creatingChallenge.loading === XHR_STATE.IN_PROGRESS}
          onClick={() => {
            redirectTo(ROUTES.EDIT_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)
              .replace(URL_PART_CHALLENGE_ID, challenge.id.value + ''));
            dispatch(setMutateMode('Edit'));
          }}
        >
          Edit
        </Button>
      }
      {(mutateMode === 'Create' || mutateMode === 'Clone') &&
        <Button variant="contained" color="primary"
          disabled={challenges.loading === XHR_STATE.IN_PROGRESS ||
            creatingChallenge.loading === XHR_STATE.IN_PROGRESS}
          onClick={() => {
            const validity = isChallengesFormValid(challenge, allowedVirtualCurrencies);
            setIsFormInvalid(validity);
            if (validity.isValid) {
              dispatch(ChallengesDispatchers.createChallenge(
                toChallengePayload(challenge, mutateMode === 'Clone', defaultVCurrency),
                selectedApp,
                {
                  success: () => {
                    redirectTo(ROUTES.CHALLENGES.replace(URL_PART_APP_ID, selectedApp));
                  },
                  error: () => {},
                }
              ));
            }
          }}
        >
          Create Challenge
        </Button>
      }
      {mutateMode === 'Edit' &&
        <Button variant="contained" color="primary"
          disabled={challenges.loading === XHR_STATE.IN_PROGRESS ||
            updatingChallenge.loading === XHR_STATE.IN_PROGRESS}
          onClick={() => {
            const validity = isChallengesFormValid(challenge, allowedVirtualCurrencies, true);
            setIsFormInvalid(validity);
            if (validity.isValid) {
              dispatch(ChallengesDispatchers.updateChallenge(
                toChallengePayload(challenge, false, defaultVCurrency),
                selectedApp,
                {
                  success: () => {},
                  error: () => {},
                }
              ));
            }
          }}
        >
          Update Challenge
        </Button>
      }
      <HandyDialog
        open={!isFormInvalid.isValid}
        title="Invalid Inputs"
        content={
          <ul>
            {isFormInvalid.errors.map((err, errIndex) =>
              <li key={`err-${errIndex}`}>{err}</li>
            )}
          </ul>
        }
        onClose={() => setIsFormInvalid({ isValid: true, errors: []})}
        onOkClick={() => setIsFormInvalid({ isValid: true, errors: []})}
      />
    </div>
  );
}

export default ChallengesFooter;
