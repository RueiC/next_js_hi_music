import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '../utils/firebase';
import { schema } from '../utils/schema';
import images from '../assets/index.js';

const SignUpForm = ({ type, inLoginForm, setInLoginForm }) => {
  const onSubmit = async (values, actions) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      ).then(async (userCredential) => {
        if (userCredential) {
          await updateProfile(userCredential.user, {
            displayName: values.name,
          });
        }
      });

      actions.resetForm();
      toast('註冊成功', { type: 'success' });
      setInLoginForm(true);
    } catch (err) {
      toast('操作失敗，請重新操作', { type: 'error' });
      console.log(err);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
      },
      validationSchema: schema,
      onSubmit,
    });

  return (
    <>
      {type === 'desktop' && (
        <form
          className={`flex flex-col gap-[5rem] w-full px-[9.6rem] py-[6rem] transition-all duration-300 ease-in-out opacity-100 ${
            inLoginForm && '-translate-x-[100%] opacity-0 pointer-events-none'
          }`}
          noValidate
          onSubmit={handleSubmit}
        >
          <img className='w-[13.2rem]' src={images.hi_music_logo} alt='logo' />

          <div className='text-white'>
            <p className='text-[3.5rem] font-bold mb-[1.5rem]'>註冊</p>
            <p>
              <span className='opacity-50'>已經註冊了嗎？ </span>
              <span
                className='cursor-pointer'
                onClick={() => setInLoginForm(true)}
              >
                登入
              </span>
            </p>
          </div>

          <div className='flex flex-col gap-[3rem]'>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
                id='name'
                type='text'
                placeholder='暱稱'
                autocomplete='off'
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.name && touched?.name ? errors.name : ''}
              </p>
            </div>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
                id='email'
                type='email'
                placeholder='帳號'
                autocomplete='off'
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.email && touched?.email ? errors.email : ''}
              </p>
            </div>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white'
                id='password'
                type='password'
                placeholder='密碼'
                autocomplete='off'
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.password && touched?.password ? errors.password : ''}
              </p>
            </div>
            <button
              className='bg-blue-gradient w-full rounded-[1rem] py-[1.5rem] hover:scale-105 transition-all duration-300 ease-in-out'
              type='submit'
            >
              註冊
            </button>

            <p className='text-white'>
              <span className='opacity-50'>
                如果你註冊帳號，表示你同意我們的{' '}
              </span>
              <span className='cursor-pointer'>服務條款</span>
              <span className='opacity-50'> 及 </span>
              <span className='cursor-pointer'>隱私政策</span>
            </p>
          </div>
        </form>
      )}

      {type === 'mobile' && (
        <form
          className={`flex flex-col gap-[5rem] w-full px-[9.6rem] py-[6rem] transition-all duration-300 ease-in-out -translate-x-[100%] ${
            inLoginForm && 'translate-x-[200%] pointer-events-none'
          }`}
          noValidate
          onSubmit={handleSubmit}
        >
          <img className='w-[13.2rem]' src={images.hi_music_logo} alt='logo' />

          <div className='text-white'>
            <p className='text-[3.5rem] font-bold mb-[1.5rem]'>註冊</p>
            <p>
              <span className='opacity-50'>已經註冊了嗎？ </span>
              <span
                className='cursor-pointer'
                onClick={() => setInLoginForm(true)}
              >
                登入
              </span>
            </p>
          </div>

          <div className='flex flex-col gap-[3rem]'>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
                id='name'
                type='text'
                placeholder='暱稱'
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.name && touched?.name ? errors.name : ''}
              </p>
            </div>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
                id='email'
                type='email'
                placeholder='帳號'
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.email && touched?.email ? errors.email : ''}
              </p>
            </div>
            <div>
              <input
                className='appearance-none bg-transparent w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
                id='password'
                type='password'
                placeholder='密碼'
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400'>
                {errors.password && touched?.password ? errors.password : ''}
              </p>
            </div>
            <button
              className='bg-blue-gradient w-full rounded-[1rem] py-[1.5rem] hover:scale-105 transition-all duration-300 ease-in-out'
              type='submit'
            >
              註冊
            </button>

            <p className='text-white'>
              <span className='opacity-50'>
                如果你註冊帳號，表示你同意我們的{' '}
              </span>
              <span className='cursor-pointer'>服務條款</span>
              <span className='opacity-50'> 及 </span>
              <span className='cursor-pointer'>隱私政策</span>
            </p>
          </div>
        </form>
      )}
    </>
  );
};

export default SignUpForm;
