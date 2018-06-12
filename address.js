;
(function () {
    /**
     * @author kidd zevil
     * @name region choose 0.0.1
     */
    //main fuction
    /**
     * options detail
     * con,
     */
    var Zregion = window.Zregion = function (options) {
        console.log(this);
        this.options = options;
        this.init();
    };
    Zregion.prototype.init = function () {
        this.el = $(this.options.con)
        var that = this;
        $("head").append("<link>");
        var css = $("head").children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: that.options.url + '/css/Zregion.css'
        });
        var thisId = _loadLabel(that.el);
        _bind(that)
    };
    _bind = function (that) {
        that.el.on('click', '.z-region-input', function () {
            that.el.find('.z-region-box').show();
            that.el.find('.select-places').html('');
            _renderPlaces(that);
        });
        that.el.on('click', '.li-places', function () {
            var $this = $(this);
            var dataVal = $this.data('id');
            var dataTxt = $this.html();
            var $input = that.el.find('.z-region-input')
            if ($this.closest('.ul-porvince').length > 0) {
                $($input.find('span')).remove();
            }
            if ($this.closest('.ul-city').length > 0) {
                $($input.find('span')[1]).remove();
                $($input.find('span')[2]).remove();
            }
            if ($this.closest('.ul-area').length > 0) {
                $($input.find('span')[2]).remove();
                _visibility(that);
            }
            _loadLabel($input, 'span', {
                val: dataVal,
                txt: dataTxt
            });
            _renderPlaces(that);
        });
        that.el.on('click', '.places-tab', function () {
            var thisPlace = $(this).data('place');
            if ($('.ul-' + thisPlace).html() == '') return;
            _visibility(that, thisPlace);
        });

    };
    _visibility = function (that, option) {
        switch (option) {
            case 'porvince':
                that.el.find('.places-tab').removeClass('on');
                that.el.find('.z-porvince').addClass('on');
                that.el.find('.select-places').hide();
                that.el.find('.ul-porvince').show();
                break;
            case 'city':
                that.el.find('.places-tab').removeClass('on');
                that.el.find('.z-city').addClass('on');
                that.el.find('.select-places').hide();
                that.el.find('.ul-city').show();
                break;
            case 'area':
                that.el.find('.places-tab').removeClass('on');
                that.el.find('.z-area').addClass('on');
                that.el.find('.select-places').hide();
                that.el.find('.ul-area').show();
                break;

            default:
                that.el.find('.z-region-box').hide();
                break;
        }
    };
    _renderPlaces = function (that) {
        that.el.find('.ul-porvince').html('');
        that.el.find('.ul-city').html('');
        that.el.find('.ul-area').html('');

        //get all porvinces
        var spans = that.el.find('.z-region-input').find('span');
        var levels = [];
        for (var i = 0; i < spans.length; i++) {
            levels.push($(spans[i]).data('id'));
        }
        var porvinces = _ajax('porvince');
        for (x in porvinces) {
            _loadLabel(that.el.find('.ul-porvince'), 'porvinces', porvinces[x]);
        }
        if (levels.length == 0) {
            //change tab to porvinces
            _visibility(that, 'porvince');
        } else if (levels.length > 0) {
            //change tab to citys
            _visibility(that, 'city');

            var thisporvince = that.el.find('.ul-porvince');
            thisporvince.find('.val-' + levels[0]).addClass('on');
            //get all citys
            var citys = _ajax('city');
            for (y in citys) {
                _loadLabel(that.el.find('.ul-city'), 'citys', citys[y]);
            }

            if (levels.length > 1) {

                //change tab to areas
                _visibility(that, 'area');

                var thiscity = that.el.find('.ul-city');
                thiscity.find('.val-' + levels[1]).addClass('on');

                //get all areas
                debugger
                var areas = JSON.parse(decodeURIComponent(thiscity.find('.val-' + levels[1]).data('areas')));
                for (z in areas) {
                    _loadLabel(that.el.find('.ul-area'), 'areas', areas[z]);
                }

                if (levels.length > 2) {
                    var thisarea = that.el.find('.ul-area');
                    thisarea.find('.val-' + levels[2]).addClass('on');
                }

            }
        }
    };
    // data:{dataid,value}
    // get labels
    var _loadLabel = function (parent, el, params) {
        var labels = null;
        switch (el) {
            case 'input':
                labels = '<input type="hidden" name="' + params.name + '" value="' + params.val + '"/>';
            case 'span':
                labels = '<span data-id="' + params.val + '" class="z-region-place">' + params.txt + '</span>';
                break;
            case 'porvinces':
                labels = '<li class="li-places val-' + params.val + '" data-id="' + params.val + '">' + params.txt + '</li>';
                break;
            case 'citys':
                labels = '<li class="li-places val-' + params.val + '" data-areas="' + encodeURIComponent(JSON.stringify(params.list)) + '" data-id="' + params.val + '">' + params.txt + '</li>';
                break;
            case 'areas':
                labels = '<li class="li-places val-' + params.val + '" data-id="' + params.val + '">' + params.txt + '</li>';
                break;
            default:
                labels = '<div class="z-region"><div class="z-region-input"><i class="z-region-triangle triangle-down"></i></div><div class="z-region-box"><div class="select-tab"><div class="places-tab z-porvince" data-place="porvince">省份</div><div class="places-tab z-city" data-place="city">城市</div><div class="places-tab z-area" data-place="area">县区</div></div><div class="z-all-places"><ul class="select-places ul-porvince"></ul><ul class="select-places ul-city"></ul><ul class="select-places ul-area"></ul></div></div></div>';
                break;
        };
        parent.append(labels);

    };
    //get json data for module
    var _ajax = function (url, callback) {
        if (url == 'porvince') {
            return regionJson;
        }
        if (url == 'city') {
            return cityJson;
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: {},
            success: callback,
            dataType: 'json',
            error:function(){
                console.log('加载地区信息失败！')
            }
        });
        // var _url = url;
        // //"data/region.json"
        // var xmlhttp = new XMLHttpRequest();
        // xmlhttp.open("POST", _url, true);
        // xmlhttp.setRequestHeader("Content-type", "application/json");
        // xmlhttp.send("ts=" + new Date().getTime());
        // xmlhttp.onreadystatechange = function () {
        //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //         callback();
        //         console.log(xmlhttp.responseText);
        //     } else {
        //         console.log('对应地点加载失败');
        //     }
        // }
    };
})(window.Zepto || window.jQuery);