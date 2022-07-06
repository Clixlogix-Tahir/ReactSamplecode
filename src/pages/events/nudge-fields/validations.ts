import produce from "immer";
import { IEventNudgeForm } from "../../../types/eventTypes";

export const isNudgeFormValid = (
  form: IEventNudgeForm
): IEventNudgeForm => {
  let formCopy: IEventNudgeForm = {
    ...form,
    _validationErrors: [],
  };
  let _isFormValid = true;

  const { value } = form.additionalParams.bgGradient;
  const colorRegex = /#([A-F]|[0-9]){6}/;
  if (value.length !== 2) {
    _isFormValid = false;
    formCopy = produce(formCopy, draftForm => {
      // draftForm.additionalParams.bgGradient.error = '2 colors are needed';
      draftForm._validationErrors.push('2 background gradient colors are needed')
    });
  } else {
    // formCopy = produce(formCopy, draftForm => {
    //   draftForm.additionalParams.bgGradient.error = '';
    // });
    if (!colorRegex.test(value[0]) || !colorRegex.test(value[0])) {
      _isFormValid = false;
      formCopy = produce(formCopy, draftForm => {
        draftForm._validationErrors.push('There should be 2 valid hexadecimal color codes. e.g. "#AB123C, #DEF456"');
      });
    }
  }

  return {
    ...formCopy,
    _isFormValid
  };
};
