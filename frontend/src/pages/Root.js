import { useEffect } from 'react';
import { Outlet, useSubmit } from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { getAuthToken, getTokenDuration } from '../util/auth';

function RootLayout() {
  // const navigation = useNavigation();
  const token=getAuthToken();
  const submit=useSubmit();
  useEffect(()=>{
    if(!token)
      return
    if(token==='EXPIRED')
      submit(null,{action:'/logout',method:'POST'})
    const tokenDuration=getTokenDuration();
    setTimeout(()=>{
      submit(null,{action:'/logout',method:'POST'})
    },tokenDuration)
  },[token,submit])
  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
