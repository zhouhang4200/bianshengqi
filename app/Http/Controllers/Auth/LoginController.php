<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Administrator;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/index';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * 设置以username登录
     * @return string
     */
    public function username()
    {
        return 'name';
    }

    public function login(Request $request)
    {
        $validator = \Validator::make($request->all(), [

        ]);

        if ($validator->fails()) {
            return response()->ajaxFail($validator->errors()->all()[0]);
        }

        // 对前端转输数据进行解密
        $request['password'] = $request->password;
        $administrator = Administrator::where('name', $request->name)->first();

//        if ($administrator && \Hash::check($request['password'], $administrator->password)) {
//            if ($administrator->status == 0) {
//                return response()->ajaxFail(0, '您的账号已被禁用!');
//            }
//        }

        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        if ($this->attemptLogin($request)) {
            if ($this->sendLoginResponse($request)) {
                return response()->json(['status' => 1, 'data' => $administrator->name, 'message' => '登录成功']);
            }
        }
        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        return response()->json(['status' => 0, 'data' => '', 'message' => '账号密码错误']);
    }

    public function logout(Request $request)
    {
        $this->guard()->logout();

        $request->session()->forget($this->guard()->getName());

        $request->session()->regenerate();

        return redirect('/login');
    }

    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        return $this->authenticated($request, $this->guard()->user()) ? : true;
    }
}
