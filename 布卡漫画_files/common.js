/**
 * 公用文件
 */
//请求地址
var GLOBAL = 
{
	imgHeight:1350,
	view:'/view',
	detail:'/detail',
	search:'/search',
	imgLoading:'/static/img/img-loading.gif',
	getnews:'/news/getnews',
	getrankings:'/ranking/getranking',
	getcategorys:'/category',
	getrecom:'/recom',
	login:'/user/login',
	getsource:'/detailv/getsource',
	loginout:'/user/loginout',
	pay:'/pay/subpay',
	register:'/user/register',
	setnickname:'/user/setnickname'
}

/**
 * ajax请求
 */
var ajax =(function(){
	
	var faild = function()
	{
		alert('请求失败，请稍后再试...');
	}
	
	var get = function(url,data,success,beforeSend)
	{
		_send('get',url,data,success,beforeSend);
	}
	
	var _send = function(type,url,data,success,beforeSend)
	{
		$.ajax({
			type:type,
			url:url,
			data:data,
			dataType:'json',
			async:true,
			cache:false,
			beforeSend:beforeSend,
			success:success,
			error:faild
		});
	}
	
	var post = function(url,data,success,beforeSend)
	{
		_send('post',url,data,success,beforeSend);
	}
	
	return {
		post:post,
		get:get
	}
})();


/**
 * 搜索功能
 */
var search = (function(){
	
	var search_input = $('#search');
	var search_btn   = $('#search_btn');
	
	
	/**
	 * 输入框和搜索按钮事件 
	 */
	var regEvent = function()
	{
		//回车搜索功能
		search_btn.on('enterSearch',function(e,data){
			var tmpdata = encodeURIComponent(data);
			location.assign(GLOBAL.search+'?word='+tmpdata);
			return ;
		})
		//当点击搜索按钮 
		search_btn.click(function(){
			var data = encodeURIComponent(search_input.val());
			if(data)
			{
				location.assign(GLOBAL.search+'?word='+data);
			}
			return ;
			
		})
		//回车搜索
		search_input.focusin(function(e){
			$(this).keyup(function(e){
				if(e.which == 13)
				{
					if($(this).val().length==0)
					{
						return ;
					}
					else
					{
						search_btn.trigger('enterSearch',$(this).val())
						return ;
					}
				}
			})
		})
	}
	
	
	/**
	 * 初始化
	 */
	var init = function()
	{
		regEvent();
	}
	
	return {
		init:init
	}
	
})();
search.init();

/**
 * 判断上次阅读的话数
 */
var keepRead = (function(){
	//返回上次观看的话数
	var getKeepNum = function()
	{
		//判断当前的漫画是否被看过，如果看过点击显示继续看
		var continueLook = $.cookie('buka'+mid);
		if(continueLook)
		{
			return continueLook;
		}
		return '';
	}
	
	var gotoManga = function()
	{
		var num = $(this).data('num');
		location.href=GLOBAL.view+'/'+mid+'/'+num;
	}
	
	var init = function()
	{
		var num = getKeepNum();
		if(num)
		{
			$('#startRead').addClass('hide');
			$('#keepingRead').removeClass('hide').data('num',num);
			$('#keepingRead').click(gotoManga);
		}
	}
	return {
		init:init
	}
})();

//排序
//!(function($, window, document, chapters, undefined){

	


//}(jQuery, window, document, chapters));


/**
 * 轮播图
 */
!(function($,window,document,undefined){

         //构造函数
         var imgs = function(opt){
             this.imgId = $(opt.imgArea);
             this.btns = $(opt.listBtn);
             this.time = opt.time;  //每多少秒走一次
             this.btnLis = this.btns.find('li');
             this.imgLis = this.imgId.find('li');
             this.cindex = 0;
             this.maxIndex = this.imgLis.length-1;
             this.flag; //计时器
         }

         //给按钮绑定事件
         imgs.prototype.bindEvent = function(){

             this.eventHandle(this.btnLis);
             this.eventHandle(this.imgLis);
         }

         //事件
         imgs.prototype.eventHandle = function(ele)
         {
             var that = this;
             var timeId = 0;
             ele.mouseenter(function() {
                 var isThat = $(this);
                 //判断是否存在自动播放标记
                 clearTimeout(timeId);
                 timeId = null;
                 timeId = setTimeout(function(){
                     clearInterval(that.flag);
                     var index = isThat.index();
                     that.switchImg(index)
                 },200)
             }).mouseout(function(){
                 clearTimeout(timeId);
                 var index = $(this).index();
                 that.autoRun();
             });
         }

         //切换图片
         imgs.prototype.switchImg =  function(menuIndex)
         {
             //当前走到第几张图片
             this.cindex = menuIndex;
             var cImg  = this.imgLis.eq(menuIndex);
             var cMenu = this.btnLis.eq(menuIndex);
             cMenu.addClass('select').siblings().removeClass('select');
             cImg.stop().fadeIn('fast').siblings().fadeOut();
//           console.log(this.cindex);
         }

         //自动播放
         imgs.prototype.autoRun = function(){
             var that = this;
             clearInterval(this.flag);
             this.flag = setInterval(function(){
                 that.cindex++;
                 if(that.cindex>that.maxIndex)
                 {
                     that.cindex = 0;
                 }
                 that.switchImg(that.cindex);

             },that.time);
         }

         //初始化方法
         imgs.prototype.run = function(){
             this.bindEvent();
             this.autoRun();
         }

         $.fn.imgRuning = function(opt){
             var dopt = {
                 'imgArea':opt.imgArea,
                 'time':opt.time,
                 'listBtn':$(this)
             }
             var igs = new imgs(dopt);
             igs.run();
             return this;
         }

     })(jQuery,window,document);
        $('.img-trun-icon').imgRuning({
            'imgArea':'.img-trun-lists',
            'time':7000
        });

//判断是否存在 Logodir如果存在就并一个图片 连接
//function smallJpg(data)
//{
//	if(data['logodir'])
//	{
//		return data['logodir'].'/43m.jpg';
//	}
//	return data['logos'];
//}

//切换动态漫画
function switchManga(mid)
{	
	var parent = $('#episodes');
	parent.find('.switchmanga').click(function(){
		var cid = $(this).data('cid');
		$(this).addClass('active').siblings().removeClass('active');
		var player = document.getElementById('palyer1');
		//获得动态漫画资料
		ajax.post(GLOBAL.getsource,{mid:mid,cid:cid},function(phpData){
	//		console.log(phpData.url);
			if(phpData.ret==0)
			{
				var player = new MediaElementPlayer('#palyer1');
				player.pause();
				player.setSrc(phpData.url);
				player.play();
				
			}
		},function(){
			//加载动画。。。
		})
	})
	
	
	
	
	
	//总时长
//	$(player).one('loadedmetadata',function(){
//		var countTime = player.duration; //总时长
//		//当前播放时间
//		$(player).off('timeupdate');
//		$(player).on('timeupdate',function(){
////			if(player.currentTime == countTime)
////			{
////				
////			}
//			
//		})
//	})
}

//编辑昵称
var editNickname = (function(){
	var data = {};
	var oldUserTitle = '完善个人信息';
	//配置视图
	var setView = function(data){
		var html = template('editNicknameTmp',data);
		$('body').append(html);
		var e1 = document.getElementById('modal-overlay');
		e1.style.height = $('html').height() + 'px';
   		e1.style.visibility = (e1.style.visibility == "visible")? "hidden" : "visible";
   		$('#nickname').focus();
   		addEvent();
	}
	//初始化
	var init = function(nickname){
		data = {nickname:nickname};
		setView(data);
	}
	
	var addEvent = function(){
		//注册关闭事件
		$('#closeBoxShadow').one('click',closeView);
		$('#editnicknamebtn').click(function(){
			if(_checkFied())
			{
				//发送请求修改用户名
				sendNickname();
			}
		})
	}
	
	var sendNickname = function(){
		//ajax验证
			var newNickname = $('#nickname').val();
			ajax.post(GLOBAL.setnickname,{nickname:newNickname},function(phpData){
				hideError();
				//修改成功
				if(phpData.ret==0)
				{	
					$('#regtitle').html('<span style="color:#009900" class="animated fadeIn" >保存成功~！</span>');
					setTimeout(function(){
						closeView();
						//显示面板
						$('#editnickname').html(newNickname);	
					},1000);
				}
				else
				{
					//显示错误
					showError(phpData.msg);
				}
			},function(){
				//检测通过
				$('#regtitle').html('<span style="color:#009900" class="animated fadeIn" >提交中...</span>');
			});
	}
	
	//隐藏错误
	var hideError = function()
	{
		var userTitle = $('#regtitle');
		userTitle.html(oldUserTitle);
	}
	
	/**
	 * 显示错误
	 */
	var showError = function(error)
	{	
		var userTitle = $('#regtitle');
		var errorFont = '<span style="color:#CC0000" class="animated flash" >'+error+'</span>';
		userTitle.html(errorFont);
		if(errTimeoutFlag)
		{
			clearTimeout(errTimeoutFlag);
		}
		//如果上一个还没有执行完那么立刻清除执行下一个
		errTimeoutFlag = setTimeout(hideError,5000);
	}
	
	//检测表单
	var _checkFied = function()
	{
		//当前输入的昵称
		var nicknameval = $.trim($('#nickname').val());
		if(nicknameval.length<2)
		{
			showError('昵称长度不够');
			return false;
		}
		if(nicknameval.length>16)
		{
			showError('昵称最大长度为16位!');
			return false;
		}
		//输入内容是否正确
		if(!/^[\u4e00-\u9fa5\w]{2,16}$/.test(nicknameval))
		{
			showError('只能使用字母、汉字、数字或下划线哦');
			return false;
		}
		if(nicknameval == data.nickname)
		{
			showError('没有做任何修改~!');
			return false;
		}
		
		return true;
	}
	
	//关闭注册模态
	var closeView = function(){
		$('#regsiterwrap').remove();
	}
	
	return {
		init:init
	}
	
})();

//显示收费章节价格模态框
var showPriceTagBox = (function()
{
	
	var setView = function(title,price)
	{
		var data = {name:title,price:price};
		var html = template('price_modal_box',data);
		$('body').append(html);
		var e1 = document.getElementById('modal-overlay');
		e1.style.height = $('html').height() + 'px';
   		e1.style.visibility = (e1.style.visibility == "visible")? "hidden" : "visible";
	}
	
	
	var handles = function(url){
		$('#closeBtn').click(function(){
			$('#price_box').remove();
		})
		$('#nowpay').click(function(e){
			gotoUrl(url);
		})
	}
	
	var gotoUrl = function(url)
	{
		window.location = url;
	}
	//
	var loginPayHandle = function()
	{
		$('#nowpay').click(function(){
			$('#price_box').remove();
			isLoginGoto.isGoto = true;
			isLoginGoto.gotourl = '/pay/index';
			$('#showlogin_1').trigger('click');
		});
		$('#closeBtn').click(function(){
			$('#price_box').remove();
		})
	}
	
	var payChapter = function(url,title,price){
		setView(title,price);
		$('#nowpay').click(function(){
			$('#price_box').remove();
			location.href = '/pay/index';
			
		});
		$('#closeBtn').click(function(){
			$('#price_box').remove();
		})
	}
	
	//登录操作跳转到相应充值页面
	var loginPayChapter = function(url,title,price)
	{
		setView(title,price);
		loginPayHandle();
		return;
	}
	
	var init = function(url,title,price)
	{
		if(price)
		{
			setView(title,price);
			handles(url);
		}else{
			gotoUrl(url);	
		}
	}
	
	return {
		init:init,
		loginPayChapter:loginPayChapter,
		payChapter:payChapter
	}

})();

var ewm_show = (function(){
	
	var ewmarea = $('#ewmarea'),
		lists = ewmarea.find('.down_list'),
		ewmparent = ewmarea.find('.ewm_show'),
		flag = false, //是否在同一个平台
		pIndex,cIndex;
		
		
	var init = function(){
		lists.find('li').hover(function(){
			pIndex = $(this).parent().index('.down_list');
			cIndex = $(this).index();
//			isFlag.init(pIndex,cIndex);
//			isFlag.setVar(pIndex,cIndex);
			show(pIndex,cIndex);
		},function(){
			hide();
		})
	}
	
	//判断是否为同一个同台
//	var isFlag = (function()
//	{
//		var tp,tc,flag;
//		var init = function(p,c)
//		{
//			if(tp == p)
//			{
//				flag=true;
//			}
//		}
//		var getFlag = function(){
//			return flag;
//		}
//		var setVar = function(p,c)
//		{
//			tp = p;
//			tc = c;
//		}
//		return {
//			init:init,
//			setVar:setVar,
//			getFlag:getFlag
//		}
//		
//	})();
	
	var show = function(pIndex,cIndex){
		ewmparent.eq(pIndex).show()
		ewmparent.eq(pIndex).find('.ewm_area').eq(cIndex).show();
	}
	var hide = function(pIndex,cIndex){
		ewmparent.hide()	
		ewmparent.find('.ewm_area').hide();
	}
	
	
	return {
		init:init
	}
	
})();
var hideLoginRegBtn = function(){
	$('#actionbtns').hide();
}
ewm_show.init();



var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lienHeight:h, paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
//执行
jQuery(function(){
    JPlaceHolder.init();    
});