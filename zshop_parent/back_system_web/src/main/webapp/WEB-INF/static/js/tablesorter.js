(function($) {

    $.extend({
        tablesorter: new function() {
            this.defaults = {
                cssHeader: "fa fa-sort",
                cssAsc: "fa-sort-up",
                cssDesc: "fa-sort-down",
                sortInitialOrder: "asc",
                selectorHeaders: 'thead th',
                sortList: []
            };

            function checkHeaderOptions(table, i) { //是否支持排序
                if ((table.config.headers[i]) && (table.config.headers[i].sorter === false)) {
                    return true;
                };
                return false;
            };

            function buildHeaders(table) { //初始化表头属性|样式

                $tableHeaders = $(table.config.selectorHeaders, table).each(function(index) {
                    this.column = index;
                    this.count = 0;
                    this.order = 0;

                    if (checkHeaderOptions(table, index)) this.sortDisabled = true;

                    if (!this.sortDisabled) {
                        $(this.children[0]).addClass(table.config.cssHeader);
                    }

                });

                return $tableHeaders;
            };

            //重置表头样式
            function setHeadersCss(table, $headers, list, css) {
                var h = [];
                $headers.each(function() {
                    var $i = $(this.children[0]);
                    $i.removeClass(css[0]).removeClass(css[1]);

                    if (!this.sortDisabled) {
                        h[this.column] = $i;
                    }
                });

                var l = list.length;
                for (var i = 0; i < l; i++) {
                    h[list[i][0]].addClass(css[list[i][1]]);
                }
            }

            //扩展表头点击排序事件
            this.construct = function(settings) {
                return this.each(function() {
                    if (!this.tHead || !this.tBodies) return;

                    var $this, $headers, config;

                    this.config = {};

                    config = $.extend(this.config, $.tablesorter.defaults, settings);

                    $this = $(this);

                    $.data(this, "tablesorter", config);

                    $headers = buildHeaders(this);

                    var sortCSS = [config.cssDesc, config.cssAsc];

                    $headers.click(
                        function() {
                            var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[0].rows.length) || 0;
                            if (!this.sortDisabled && totalRows > 1) {
                                config.sortList = [];
                                var i = this.column;
                                this.count += 1;
                                this.order = this.count % 2;
                                config.sortList.push([i, this.order]);
                                setHeadersCss($this[0], $headers, config.sortList, sortCSS);

                                pager.pageOrderFields = this.abbr;
                                pager.pageSortType = this.order;
                                pager.bindData(pager.pageIndexCurrent, pager.pageOrderFields, pager.pageSortType);
                            }
                        });

                });
            };


        }
    });

    $.fn.extend({
        tablesorter: $.tablesorter.construct
    });

})(jQuery)