"use strict";
layui.use(["okUtils", "okCountUp"], function () {
    var countUp = layui.okCountUp;
    var okUtils = layui.okUtils;
    var $ = layui.jquery;
    okLoading.close();

    function init() {
        var username = coreUtil.getLocalData("token");
        alert(JSON.stringify(username.data))
        $("#username").html(JSON.stringify(username.data))
    }
    /**
     * 收入、商品、博客、用户
     */
    function initMediaCont() {
        coreUtil.sendAjax(getCountUrl,undefined,function (res) {
            $("#amount").html(res.data.data.amount)
            $("#orderCount").html(res.data.data.orderCount)
            $("#userCount").html(res.data.data.userCount)
            $("#parkCount").html(res.data.data.parkCount)
        },"POST",false);
    }

    function dataTrendOption(color) {
        color = color || "#00c292";
        return {
            color: color, toolbox: {show: false, feature: {saveAsImage: {}}},
            grid: {left: '-1%', right: '0', bottom: '0', top: '5px', containLabel: false},
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                splitLine: {show: false},
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }],
            yAxis: [{type: 'value', splitLine: {show: false}}],
            series: [{
                name: '用户', type: 'line', stack: '总量', smooth: true, symbol: "none", clickable: false, areaStyle: {},
                data: [randomData(), randomData(), randomData(), randomData(), randomData(), randomData(), randomData()]
            }]
        }
    }

    function randomData() {
        return Math.round(Math.random() * 500);
    }

    /**
     * 近一周数量涨幅图表
     */
    function initDataTrendChart() {
        // 收入
        var echIncome = echarts.init($("#echIncome")[0]);
        // 商品
        var echGoods = echarts.init($('#echGoods')[0]);
        // 博客
        var echBlogs = echarts.init($("#echBlogs")[0]);
        // 用户
        var echUser = echarts.init($('#echUser')[0]);
        echIncome.setOption(dataTrendOption("#00c292"));
        echGoods.setOption(dataTrendOption("#ab8ce4"));
        echBlogs.setOption(dataTrendOption("#03a9f3"));
        echUser.setOption(dataTrendOption("#fb9678"));
        okUtils.echartsResize([echIncome, echGoods, echBlogs, echUser]);
    }



    var userActiveTodayChartOption = {
        color: "#03a9f3",
        xAxis: {type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']},
        yAxis: {type: 'value'},
        series: [{data: [120, 200, 150, 80, 70, 110, 130], type: 'bar'}]
    };

    /**
     * 今日用户活跃量图表
     */
    function initUserActiveTodayChart() {
        var userActiveTodayChart = echarts.init($("#userActiveTodayChart")[0], "themez");

        coreUtil.sendAjax(getOrderDataUrl,undefined,function (res) {
            console.info("getOrderDataUrl", res.data)
            var userActiveTodayChartOption = {
                color: "#03a9f3",
                xAxis: {type: 'category', data:  res.data.data.name },
                yAxis: {type: 'value'},
                series: [{data: res.data.data.value, type: 'bar'}]
            };
            userActiveTodayChart.setOption(userActiveTodayChartOption);
            okUtils.echartsResize([userActiveTodayChart]);
        },"POST",true)
    }


    /**
     * 今日用户访问来源图表
     */
    function initUserSourceTodayChart() {
        var userSourceTodayChart = echarts.init($("#userSourceTodayChart")[0], "themez");
        coreUtil.sendAjax(getParkDataUrl,undefined,function (res) {
            var userSourceTodayChartOption = {
                title: {show: false, text: '停车场订单占比', subtext: '', x: 'center'},
                tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"},

                legend: {orient: 'vertical', left: 'left', data:  res.data.nameList },

                series: [
                    {
                        name: '停车场订单占比', type: 'pie', radius: '55%', center: ['50%', '60%'],
                        data: res.data.data,
                        itemStyle: {emphasis: {shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'}}
                    }
                ]
            };
            userSourceTodayChart.setOption(userSourceTodayChartOption);
            okUtils.echartsResize([userSourceTodayChart]);
        },"POST",true)
    }

    /**
     * 本周用户访问来源图表
     */
    function initUserSourceWeekChart() {
        var userSourceWeekChart = echarts.init($("#userSourceWeekChart")[0], "themez");
        coreUtil.sendAjax(getAmountDataUrl,undefined,function (res) {
            console.info( "getAmountDataUrl", res.data)

            var userSourceWeekChartOption = {
                title: {show: true, text: ''},
                tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}}},

                legend: {data: res.data.data.legend },

                toolbox: {show: false, feature: {saveAsImage: {}}},
                grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},

                xAxis: [{type: 'category', boundaryGap: false, data: res.data.data.xaxis    }],

                yAxis: [{type: 'value', splitLine: {show: false},}],
                 series: res.data.data.lineVo
                     //[
                //     {
                //         name: '邮件营销',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         areaStyle: {},
                //         data: [120, 132, 101, 134, 90, 230, 210]
                //     },
                //     {
                //         name: '联盟广告',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         areaStyle: {},
                //         data: [220, 182, 191, 234, 290, 330, 310]
                //     },
                //     {
                //         name: '视频广告',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         areaStyle: {},
                //         data: [150, 232, 201, 154, 190, 330, 410]
                //     },
                //     {
                //         name: '直接访问',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         areaStyle: {normal: {}},
                //         data: [320, 332, 301, 334, 390, 330, 320]
                //     },
                //     {
                //         name: '搜索引擎',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         label: {normal: {show: true, position: 'top'}},
                //         areaStyle: {normal: {}},
                //         data: [370, 932, 901, 934, 1290, 1330, 1320]
                //     }
                // ]
            };
            userSourceWeekChart.setOption(userSourceWeekChartOption);
            okUtils.echartsResize([userSourceWeekChart]);
        },"POST",true)
    }

    initMediaCont();
    initDataTrendChart();
    initUserActiveTodayChart();
    initUserSourceTodayChart();
    initUserSourceWeekChart();
});


