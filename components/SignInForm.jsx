import { useFormik } from 'formik';
import { signIn as spotifySignIn } from 'next-auth/react';
import { toast } from 'react-toastify';

import { auth, signInWithEmailAndPassword } from '../utils/firebase';
import { schema } from '../utils/schema';
import images from '../assets/index.js';

const SignInForm = ({ type, inLoginForm, setInLoginForm, providers }) => {
  const onSubmit = async (values, actions) => {
    try {
      const currentUser = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      if (!currentUser) return;

      await fetch('/api/firebase_auth/firebaseSignIn', {
        method: 'POST',
        body: JSON.stringify({
          uid: currentUser.user.uid,
          displayName: currentUser.user.displayName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      actions.resetForm();

      const spotifyUser = await spotifySignIn(providers.spotify.id, {
        callbackUrl: 'http://localhost:3000/browse',
      });

      if (!spotifyUser) return;
    } catch (err) {
      toast('操作失敗，請重新操作', { type: 'error' });
      console.log(err);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
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
          className={`flex flex-col gap-[5rem] w-full px-[9.6rem] py-[6rem] transition-all duration-500 ease-in-out ${
            inLoginForm
              ? 'opacity-100'
              : 'opacity-0 translate-x-[100%] pointer-events-none'
          }`}
          noValidate
          onSubmit={handleSubmit}
        >
          <img className='w-[13.2rem]' src={images.hi_music_logo} alt='logo' />

          <div className='text-white'>
            <p className='text-[3.5rem] font-bold mb-[1.5rem]'>歡迎回來！</p>
            <p>
              <span className='opacity-50'>還沒註冊嗎？ </span>
              <span
                className='cursor-pointer'
                onClick={() => setInLoginForm(false)}
              >
                註冊
              </span>
            </p>
          </div>

          <div className='flex flex-col gap-[3rem]'>
            <div>
              <input
                className='appearance-none bg-transparent  w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
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
                className='appearance-none bg-transparent  w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
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
              className='bg-blue-gradient w-full rounded-[1rem] py-[1.5rem] hover:scale-105 transition-all duration-500 ease-in-out'
              type='submit'
            >
              登入
            </button>

            <p className='text-white'>
              <span className='opacity-50'>忘記你的帳號密碼嗎？ </span>
              <span className='cursor-pointer'>取得協助</span>
            </p>
          </div>
        </form>
      )}

      {type === 'mobile' && (
        <form
          className={`flex flex-col gap-[5rem] w-full px-[9.6rem] py-[6rem] transition-all duration-500 ease-in-out ${
            inLoginForm
              ? 'translate-x-0'
              : 'translate-x-[100%] pointer-events-none'
          }`}
          noValidate
          onSubmit={handleSubmit}
        >
          <img className='w-[13.2rem]' src={images.hi_music_logo} alt='logo' />

          <div className='text-white'>
            <p className='text-[3.5rem] font-bold mb-[1.5rem]'>歡迎回來！</p>
            <p>
              <span className='opacity-50'>還沒註冊嗎？ </span>
              <span
                className='cursor-pointer'
                onClick={() => setInLoginForm(false)}
              >
                註冊
              </span>
            </p>
          </div>

          <div className='flex flex-col gap-[3rem]'>
            <div>
              <input
                className='appearance-none bg-transparent  w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
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
                className='appearance-none bg-transparent  w-full py-[1rem] px-[1rem] leading-tight focus:outline-none border-b-[0.5px] border-white text-white placeholder:text-white mb-[1rem]'
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
              className='bg-blue-gradient w-full rounded-[1rem] py-[1.5rem] hover:scale-105 transition-all duration-500 ease-in-out'
              type='submit'
            >
              登入
            </button>

            <p className='text-white'>
              <span className='opacity-50'>忘記你的帳號密碼嗎？ </span>
              <span className='cursor-pointer'>取得協助</span>
            </p>
          </div>
        </form>
      )}
    </>
  );
};

export default SignInForm;
