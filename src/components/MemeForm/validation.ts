import * as yup from "yup";

import { MemeFormType } from "./types";

export const memeFormSchema: yup.ObjectSchema<MemeFormType> = yup
  .object()
  .shape({
    picture: yup
      .object()
      .shape({
        url: yup.string(),
        file: yup.mixed<File>().required(),
      })
      .required(),
    description: yup.string().trim().required(),
    texts: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            content: yup.string().trim().required(),
            x: yup.number().required(),
            y: yup.number().required(),
          })
          .required()
      )
      .required(),
  });
