# Login React-Redux

## Frontend Developer Login page 

1. User needs to add Phone number on the field.
2. For validation user then need to submit OTP.
3. Entered OTP with token is sent to backend
4. User have only 3 attempts for OTP.
5. If user loses all the attempts then it force back user to enter Phone number again.
6. If OTP is successfully verified Signup screen appears if isLogin is false else user data and id is stored in local storage and user is promted with the profile page (token is also changed with the new one)
   Please Note: Home page is public na dProfile is private, authentication is in place for both in route management