define(["widget/factory", "jquery", "rt/pageContext"], function (widget, $, pageContext) {

    var tab = widget.define("tab", {
        template: "<h1>Hello this navbar Widget</h1>",
        templateUri: "js/widget/tab.html",
        helpers: {
            /*	"page":function(data){
                    var headHtml = [];
                    headHtml.push("<li class='nav-item'>");
                    headHtml.push("  <a class='nav-link' data-toggle='{0}' data-url='{1}'>".format(pageOp.id,pageOp.url));
                    headHtml.push(pageOp.title);
                    headHtml.push(pageOp.allowClose ? " <i class='iconfont icon-close'></i>" : '');
                    headHtml.push("  </a>")
                    headHtml.push("</ul>")

                    var $pageEl = $(headHtml);
                    return $pageEl.html();
                }*/
        },
        init: function () {

        },
        loadData: function () {

        },
        beforeRender: function (html) {
            return html;
        },
        afterRender: function () {
            // 加载完成后如果没有选中的项，则默认选中第一项
            var $tabHeader = this.$dom.find(".tab-header:eq(0)");
            var $tabBody = this.$dom.find(".tab-body:eq(0)");
            var self = this;
            $tabHeader.on("click", function (e) {
                var $trigger = $(e.target);
                // 只处理导航点击事件
                if ($trigger.is(".nav-link")) {
                    $tabHeader.find(".active").removeClass("active");
                    $trigger.addClass("active");
                    var pageOp = $trigger.data("pageOp") || {};
                    var pageId = $trigger.data("toggle");
                    var pageUrl = $trigger.data("url");
                    $tabBody.children().hide();

                    var $curPage = $tabBody.children("[data-tab-id={0}]".format(pageId));
                    if ($curPage.length == 0) {
                        var $tempPage = $("<div data-tab-id='" + pageId + "'></div> ");
                        $tabBody.append($tempPage);
                        $curPage = $tempPage;
                    }

                    $curPage.show();

                    // 未初始化过才需要初始化
                    if (!$curPage.data("init")) {
                        if (pageUrl) {
                            pageContext.loadPage($curPage, pageUrl,pageUrl.replace(".html",".js"), function () {
                                self.trigger("afterLoad", $curPage);
                                pageOp.afterLoad && pageOp.afterLoad($curPage.data("controller"),$tabBody);
                                $curPage.data("init", true);
                            });
                        } else {
                            var id = $curPage.attr("data-tab-id");
                            var pageOptions = self.op.pages.filter(function (item) {
                                return item.id === id;
                            });
                            if(pageOptions.length <1) throw 'not found page id '+id;
                            if(pageOptions.length > 1)throw 'multi page id '+id+' be found ';
                            pageContext.renderWidgetText(pageOptions[0].content).done(function ($content) {
                                console.log("tab "+id + " render to value",$content);
                                $curPage.empty().append($content);
                                self.trigger("afterLoad", $curPage);
                                pageOp.afterLoad && pageOp.afterLoad($curPage.data("controller"),$tabBody);
                                $curPage.data("init", true);
                            });
                            $curPage.data("init", "loading");
                        }
                    }
                    return false;
                }

                // 如果是关闭按钮
                if ($trigger.is(".icon-close")) {
                    self.closeTab($trigger.parent().data("toggle"));
                    return false;
                }
            });


            var selLength = $tabHeader.find("a.active").length;
            // 初始化选中项
            if (selLength > 1) {
                console.log("WARN:tabs has multi actived page, but reserve first active tab");
                $tabHeader.find("a.active").not(":eq(1)").removeClass("active");
            } else if (!selLength) {
                $tabHeader.find("a:eq(0)").addClass("active");
            }

            // 加载选中项的内容
            $tabHeader.find("a:eq(0)").trigger("click");
        },
        ready: function () {

        },
        destroy: function () {

        },
        addPage: function (op) {
            var pageDefaultOption = {
                title: '',
                allowClose: true,
                active: true,
                id: "tabItem"
            };

            var pageOp = $.extend(true, pageDefaultOption, op);

            var $tabHeader = this.$dom.find(".tab-header:eq(0)");

            if ($tabHeader.find("[data-toggle={0}]".format(pageOp.id)).length) {
                this.selectTab(pageOp.id);
                return this;
            }

            // TODO:这个要做成工具供模版调用
            var headHtml = [];
            headHtml.push("<li class='nav-item'>");
            headHtml.push("  <a class='nav-link' data-toggle='{0}' data-url='{1}'>".format(pageOp.id, pageOp.url,pageOp.controller || pageOp.url.replace(".html",".js")));
            headHtml.push(pageOp.title);
            headHtml.push(pageOp.allowClose ? " <i class='iconfont icon-close'></i>" : '');
            headHtml.push("  </a>");
            headHtml.push("</ul>");

            var $headerEl = $(headHtml.join(''));
            $headerEl.children("a").data("pageOp",pageOp);
            $tabHeader.append($headerEl)
            var $tabBody = this.$dom.find(".tab-body:eq(0)");

            var $bodyEl = $("<div data-tab-id='{0}'></div>".format(pageOp.id));
            $tabBody.append($bodyEl);
            $headerEl.find(".nav-link").trigger("click");
            return this;
        }
        , selectTab: function (tabId) {
            if (tabId) {
                var $tabHeader = this.$dom.find(".tab-header:eq(0)");
                if ($.isNumeric(tabId)) {
                    $tabHeader.find(".nav-link:eq({0})".format(tabId)).trigger("click");
                } else {
                    $tabHeader.find("[data-toggle={0}]".format(tabId)).trigger("click");
                }
            } else {
                throw 'no tabId';
            }
        }
        , closeTab: function (tabId) {
            // 如果当前未指定tabId 则关闭当前激活的页签
            if (!tabId) {
                var $tabHeader = this.$dom.find(".tab-header:eq(0)");
                tabId = $tabHeader.find(".nav-link.active").data("toggle");
            }



            var $tabHeader = this.$dom.find(".tab-header:eq(0)");

            if($tabHeader.find("a").length === 1){
                console.log("only one tab page cannot be close");
                return ;
            }

            var $tabBody = this.$dom.find(".tab-body:eq(0)");
            var $trigger = $tabHeader.find("[data-toggle={0}]".format(tabId));
            var $headerEl = $trigger.closest("li");
            var pageId = $trigger.parent().data("toggle");
            //$headerEl.fadeOut(100,function(){
            var $pageEl = $tabBody.children("[data-tab-id={0}]".format(tabId));
            pageContext.shutPage($pageEl);
            $pageEl.remove();
            $headerEl.remove();

            // TODO:选中最后选中的页签
            $tabHeader.find("a:eq(0)").trigger("click");
            //});
            return false;
        }

    });

    return tab;
});