<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});

Route::get('/{vue?}', 'Vue\VueController@index')->where('vue', '[\/\w\.-]*')->where('vue', '^(?!socket$).*$');

Route::namespace('Auth')->group(function () {
    Route::post('/login', 'LoginController@login')->name('login');
    Route::post('/logout', 'LoginController@logout')->name('logout');
});
//
//Route::namespace('Vue')->group(function () {
//    Route::middleware(['auth'])->group(function () {
//        // 图片上传
//        Route::post('/upload/image', 'ServiceController@uploadImage');
//        // 获取所有的分类
//        Route::post('/category', 'ServiceController@category');
//        // 后台菜品
//        Route::prefix('dish')->group(function () {
//            Route::post('list', 'DishController@list'); // 列表
//            Route::post('add', 'DishController@add'); // 添加
//            Route::post('update', 'DishController@update'); // 编辑
//            Route::post('delete', 'DishController@delete'); // 删除
//        });
//        // 客户已点菜品
//        Route::prefix('customer/dish/detail/')->group(function () {
//            Route::post('list', 'CustomerDishDetailController@list'); // 列表
//            Route::post('served', 'CustomerDishDetailController@served'); // 已上菜
//            Route::post('status', 'CustomerDishDetailController@status'); // 状态
//        });
//        // 财务模块
//        Route::prefix('finance')->group(function () {
//            Route::post('list', 'FinanceController@list'); // 列表
//            Route::post('sub/type', 'FinanceController@subType'); // 子类型
//        });
//        // 订单模块
//        Route::prefix('order')->group(function () {
//            Route::post('list', 'OrderController@list'); // 列表
//            Route::post('pay/status', 'OrderController@payStatus'); // 列表
//            Route::post('channel', 'OrderController@channel'); // 列表
//            Route::post('show', 'OrderController@show'); // 列表
//        });
//        // 数据统计
//        Route::prefix('static')->group(function () {
//            Route::post('dish/week/data', 'StaticController@dishWeekData');
//            Route::post('dish/month/data', 'StaticController@dishMonthData');
//            Route::post('dish/year/data', 'StaticController@dishYearData');
//            Route::post('order/week/data', 'StaticController@orderWeekData');
//            Route::post('order/month/data', 'StaticController@orderMonthData');
//            Route::post('order/year/data', 'StaticController@orderYearData');
//            Route::post('finance/week/data', 'StaticController@financeWeekData');
//            Route::post('finance/month/data', 'StaticController@financeMonthData');
//            Route::post('finance/year/data', 'StaticController@financeYearData');
//        });
//        // 门店
//        Route::prefix('store')->group(function () {
//            Route::post('list', 'StoreController@list'); // 列表
//            Route::post('add', 'StoreController@add');
//            Route::post('update', 'StoreController@update');
//        });
//    });
//});
