var Controller = {};
var errTimeoutFlag;

var isLoginGoto = (function(){
	
	var isGoto =false;
	var gotourl = '';
	var loginflag = 0;
	return {
		isGoto:isGoto,
		gotourl:gotourl,
		loginflag:loginflag
	}
	
})();


Controller.login = (function($){
	
	var showRegView = function(){
		var html = template('loginBox');
		$('body').append(html);
		var e1 = document.getElementById('modal-overlay');
		e1.style.height = document.documentElement.clientHeight + 'px';
   		e1.style.visibility = (e1.style.visibility == "visible")? "hidden" : "visible";
   		$('#reguname').focus();
   		addEvent();
	}
	var oldUserTitle = '登录';
	/**
	 * 显示错误
	 */
	var showError = function(type,error)
	{	
		type.html(error);
	}
	//隐藏错误
	var hideError = function(type)
	{
		type.html('');
	}
	//检测用户名
	var _checkuser = function(val)
	{
		if(!val)
		{
			showError($('#reguname_error'),'用户名不能为空');
			return false;
		}
		else
		{
			var email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
			var phone = /^1[358740][0-9]{9}$/;
			if(!phone.test(val) && !email.test(val))
			{
				showError($('#reguname_error'),'用户名为邮箱或手机号');
				return false;
			}
		}
		hideError($('#reguname_error'),'');
		return true;
	}
	//检测密码
	var _checkpwd = function(val)
	{
		if(!val)
		{
			showError($('#regpassword_error'),'密码不能为空');
			return false;
		}
		else
		{
			if(val.length<6)
			{
				showError($('#regpassword_error'),'密码长度不够');
				return false;	
			}
		}
		hideError($('#regpassword_error'),'');
		return true;
	}
	
	//检测验证码
	var _checkvcode = function(val)
	{
		if(!val)
		{
			showError($('#regvcode_error'),'请输入验证码!');
			return false;
		}
		hideError($('#regvcode_error'),'');
		return true;
	}
	
	
	//编辑用户昵称
	var setNickname = function(nickname){
		$('#editnickname').click(function(){
			editNickname.init(nickname);
		})
	}
	
	//验证字段
	var checkField = function()
	{
		var username   = $('#reguname');
		var password   = $('#regpassword');
		var vcode      = $('#regvcode');
		var userval 	= username.val();
		var pwdval  	= password.val();
		var vcodeval   	= vcode.val();
		var flag_1 = _checkuser(userval);
		var flag_2 =_checkpwd(pwdval);
		var flag_3 =_checkvcode(vcodeval);
		
		if(flag_1 && flag_2 && flag_3)
		{
			//ajax验证
			ajax.post(GLOBAL.login,{
				'username':userval,
				'password':$.md5(pwdval),
				'vcode'	  :vcodeval
			},function(phpData){
				regBtnLoading(0)
				//登陆成功
				if(phpData.ret==0)
				{	
					hideLoginRegBtn();
					closeRegView();
						//显示面板
					if(phpData.rename)
					{
						editNickname.init(phpData.info.nickname);
					}
//					
					if(isLoginGoto.isGoto)
					{
						location.href = isLoginGoto.gotourl;	
					}else{
						location.reload();
					}
//					
				}
				else if(phpData.ret==1)
				{
					showError($('#reguname_error'),phpData.msg);
					return;
				}
				else if(phpData.ret==2)
				{
					showError($('#regpassword_error'),phpData.msg);
					return;
				}
				else if(phpData.ret==4)
				{
					showError($('#regvcode_error'),phpData.msg);
					return;
				}else{
					alert(phpData.msg);
					return;
				}
			},function(){
				regBtnLoading(1);
			});
		}
	}
	
	var regBtnLoading = function(type)
	{
		if(type==1)
		{
			$('#regbtn').hide();
			$('#regbtn_2').show();
		}else{
			$('#regbtn').show();
			$('#regbtn_2').hide();	
		}
	}
	
	//设置用户面板
	var setUserInfo = function(userinfo)
	{	
		var userpancel = template('userpancel',userinfo['info']);
		$('.right').prepend(userpancel);
	}
	
	var addEvent = function(){
		//注册关闭事件
		$('#closeBoxShadow').one('click',closeRegView);
		$('#regbtn').click(function(){
			checkField();
		})
	}
	
	//关闭注册模态
	var closeRegView = function(){
		$('#regsiterwrap').remove();
	}
	
	
	
	$(function(){
		if(isLoginGoto.loginflag == 1)
		{
			isLoginGoto.isGoto = true;
			isLoginGoto.gotourl = '/';
			addEvent();	
		}
		$('#showlogin_1').click(showRegView)
	})
	
})(jQuery)



var loginout = function()
	{
		ajax.post(GLOBAL.loginout,{},function(phpData){
			if(phpData.ret==0)
			{
				alert('拜拜啦~!(^_^)∠※');
				location.href = '/';
//				var userpancel = template('loginbox',{});
//				$('#userinfopancel').html(userpancel);
//				userLogin.init();
			}
		},function(){
			
		})
				
	}