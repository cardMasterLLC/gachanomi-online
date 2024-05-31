import React from 'react';
import dynamic from 'next/dynamic';

const PasswordForm = dynamic(() => import('../../components/PasswordForm'), {
  ssr: false
});

const SignUpPage = () => {
  return (
    <div>
      <h1>サインアップ</h1>
      <PasswordForm />
    </div>
  );
};

export default SignUpPage;
