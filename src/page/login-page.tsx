import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import LoginForm from '../components/form/login-form';

const Login = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#070f26]">
      <Card className="z-1 w-full max-w-sm border-none shadow-md mx-4">
        <CardHeader className="gap-6">
          <img
            src="https://www.nttdata.com/global/en/-/media/assets/images/header_logo.svg?iar=0&rev=010dc1bd851f4d2aaaaf407cf338776b"
            alt="logo ntt"
            className="mx-auto w-32 invert"
          />
          <CardTitle className="text-center">NTT Data FE Test</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;