// 下拉框，需要拆分为普通（单选多选）和自定义
define([ "widget/factory", "jquery","template","rt/util" ], function(widget, $, tmpl,util) { 
	
	// 模版配置
	// TODO:数据是否分页
	var _config = {
		// 数据源
		dataset:[{"text":"选项 A","value":"a"},{"text":"选项 B","value":"b"}],
		// 模型,   single: 单选（默认） ,multi: 多选  ,custom
		type:"single",
		// 是否允许过滤
		allowFilter:true,
		//后台过滤接口，默认根据dataset自动过滤（srcUrl+?fitler=abc）
		textField:"text",
		valueField:"value",
		selectionTemplate:"<ul class='list-unstyled'><% ;var tf=$widget.textField || 'text',vf=$widget.valueField || 'value' ;for(var i=0;i<data.length;i++) { %> <li class='ui-select-data-item' data-index='<%=i%>'><%= data[i][tf] %></li>  <%}%> </ul>"
	};

	widget.define("form.combo", {
		templateUri : "js/widget/form/combo.html",
		init : function() {
			 this.op = $.extend({},_config,this.op);
			 tmpl('combo-selection',this.op.selectionTemplate);
		},
		loadData : function() {

		},
		beforeRender : function(html) {
			return html;
		},
		afterRender : function() { 
			var self = this;
			var $btn = self.$dom.find(".ui-select-arrow"); 
			$btn.find("i").css({"line-height":$btn.outerHeight()})
			$btn.click(function(){
				self._toggle();
				return false;
			});


			var $comboBody = this.$dom.find(".ui-select-content-body");
			$comboBody.click(function(e){
				var $trigger = $(e.target);
				if($trigger.is(".ui-select-data-item")){
					var dataIndex = $trigger.data("index");
					self.setValue(self.op._data[+dataIndex]);
				} 
				self._collapse();
				return false;
			});

		},
		ready : function() {

		},
		destory : function() {

		},
		_toggle:function(){
			this.$dom.is(".expanded") ? this._collapse() : this._expand();
		},
		_expand:function(){
			var _ = this , _op = _.op;

			this.$dom.removeClass("collapsed").addClass("expanded");
			this.$dom.find(".ui-select-icon").removeClass("fa-angle-down").addClass("fa-angle-up");
			
			// 显示隐藏域,显示前确认隐藏域的内容是组件还是页面还是其他(html)
			this.$dom.find(".ui-select-content").show();
			var $comboBody = this.$dom.find(".ui-select-content-body");
		
			if(!$comboBody.data("inited")){
				$comboBody.html("loading...");
				// 初始化选项
				// TODO 这里需要添加缓存，在 Service Url 未改变的情况下应该走缓存
				util.getDataset(_op.dataset).done(function(data){ 
					_op._data = data;
					var renderHtml = tmpl('combo-selection',{ $win:window,$widget:_op,data:data});
					$comboBody.html(renderHtml);  
				}).fail(function(data){
					$comboBody.html("<span class='text-danger'>load data fail</span>");
				});
				
				$comboBody.data("inited",true);
			}

			// 绑定文档文档一次性点击事件，隐藏弹出选项
			// 这里设置delay 是因为当前函数通常在点击下拉图标中触发，而点击图标中属于事件未完成的状态，
			$(document).delayOne("click",function(){
				_._collapse();
			});
		},
		_collapse:function(){
			var _ = this,_d = _.$dom;
			if(_d.is(".collapsed")){
				return;
			}

			_d.removeClass("expanded").addClass("collapsed");
			_d.find(".ui-select-icon").removeClass("fa-angle-up").addClass("fa-angle-down");
			
			// 隐藏显示域
			_d.find(".ui-select-content").hide();
			
		},
		setValue:function(val){
			if($.isPlainObject(val)){
				var oldValue = this.op._selectedValue;
				this.op._selectedValue = (oldValue ? "" : oldValue + "," )+ val;
				this.$dom.find("input").val(val[this.op.textField]);
			} else{
				this.$dom.find("input").val(val);
			} 
		}
	});

});