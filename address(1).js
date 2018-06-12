;(function($){
	/**
	 * @wm 160729
	 * html5端省市级联
	 */
	$.fn.fnAddress = function(options){
        return new fnAddress(this, options);
    };
    var fnAddress = function (ele , opt){
    	var me = this;
    	me.$el = ele;
    	me.init(opt);
    }
    fnAddress.prototype.init = function(opt){
    	var me = this, province = '',city = '',area ='',_export =[],proviceObj={},cityObj={},areaObj={};
    	me.opts = $.extend(true,{},{
    		container : me.$el,
    		url : location.pathname.split('module/')[0]+"assets/lib/region/region.json?ts="+new Date().getTime(),
    		callback:function(){}
    	},opt);
    	$.ajax({
    	     type: 'GET',
    	     url: me.opts.url ,
    	     async : true,
    	     dataType: "json",
             cache: false,
    	     success: function(obj){
    	    	 if(obj && obj != "null"){
    	    		 for(var k in obj){
//    	    			("<div class='addProviceRow' data-id='"+k+"' data-key='"+JSON.stringify(obj[k])+"'>"+k+"</div>");
    	    			 province += ( "<li class='line-item addProviceRow' data-id='"+obj[k].val+"' data-key='"+JSON.stringify(obj[k])+"'>"+
    	    			 '<a class="line-navigate-right line-list-flex" href="javascript:">'+
    	                    '<i class="iconfont icon-position"></i>'+
    	                    '<p class="item-tt">'+obj[k].txt+'</p>'+
    	                '</a></li>')
    	    		 }
    	    	 }
    	    	var $wrap = me.opts.container.html(province);
    	    	$wrap.on('tap','.addProviceRow',function(){
    	    		//省级
    	    	    proviceObj = $(this).data('key');
    	    	   var _provice = $(this).data('id');
                    $.ajax({
                         type: 'POST',
                         url: location.pathname.split('module/')[0]+"assets/lib/region/"+_provice+".json" ,
                         data: "" ,
                         async : true,
                         dataType: "json",
                         success: function(n){
                            for(var _key in n){
                             //city += ("<div class='addCityRow' data-id='"+_key+"' data-key='"+JSON.stringify(_data[_key])+"'>"+_key+"</div>");
                             city += ( "<li class='line-item addCityRow' data-id='"+n[_key].val+"' data-key='"+JSON.stringify(n[_key])+"'>"+
                                      '<a class="line-navigate-right line-list-flex" href="javascript:">'+
                                            '<i class="iconfont icon-position"></i>'+
                                            '<p class="item-tt">'+n[_key].txt+'</p>'+
                                        '</a></li>');
                            }
                            
                           var _$wrap = me.opts.container.html(city);
                           _$wrap.on('tap','.addCityRow',function(){
//                          //市级
                                 cityObj = $(this).data('key');
                                 var _data = cityObj.list;
                                 for(var _key in _data){
        //                               area += ("<div class='addAreaRow' data-id='"+_data[_key]+"'>"+_data[_key]+"</div>");
                                     area += ( "<li class='line-item addAreaRow' data-key='"+JSON.stringify(_data[_key])+"'>"+
                                          '<a class="line-navigate-right line-list-flex" href="javascript:">'+
                                             '<i class="iconfont icon-position"></i>'+
                                             '<p class="item-tt">'+_data[_key].txt+'</p>'+
                                         '</a></li>');
                                 }
                                  var areaWrap = me.opts.container.html(area);
                                  areaWrap.on('tap','.addAreaRow',function(){
                                      //区级
                                      areaObj = $(this).data('key');
                                    var roginArr = {
                                            "provice":{
                                                "region":proviceObj.txt,
                                                "id" : proviceObj.val
                                                },
                                            "city" :{
                                                "region":cityObj.txt,
                                                "id" : cityObj.val
                                              },
                                            "area" :{
                                                "region":areaObj.txt,
                                                "id" : areaObj.val
                                             }
                                        }
                                      me.opts.callback(roginArr);
                                      me.opts.container.remove();
                                  });
                             });
                         }
                     });
    	    	});
    	     }
            /*,error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("出现了异常:" + XMLHttpRequest,textStatus,errorThrown);
                alert("XMLHttpRequest.status:" + XMLHttpRequest.status);
                alert("XMLHttpRequest.status:" + XMLHttpRequest.readyState);
            }*/

    	});
    }
    
})(window.Zepto || window.jQuery)