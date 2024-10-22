import * as yup from "yup";

export const loginFormSchema = yup.object().shape({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
});
