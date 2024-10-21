import * as yup from "yup";

import { AddCommentFormType } from "./types";

export const addCommentFormSchema: yup.ObjectSchema<AddCommentFormType> = yup
  .object()
  .shape({
    content: yup.string().trim(),
  });
