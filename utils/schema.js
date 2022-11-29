import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().email('請輸入有效的email格式').required('此選項必填'),
  password: yup.string().min(5, '至少要5個字元').required('此選項必填'),
});
