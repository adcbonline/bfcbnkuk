var ib2 = {};

ib2.home = {
    timerId: null,
    interval: null,
    loginButton: null,
    form: null,
    pinField: null,
    nextButton: null,

    init: function (options) {
        
        if (options !== undefined && options !== null) {
            if (options.interval !== undefined && options.interval !== null) {
                this.interval = options.interval;
            }

            if (options.formId !== undefined && options.formId !== null) {
                var formSelector = "#" + options.formId;
                this.form = $(formSelector);
            }

            if (options.pinFieldClientId !== undefined && options.pinFieldClientId !== null) {
                var pinFieldSelector = "#" + options.pinFieldClientId;
                this.pinField = $(pinFieldSelector);
            }

            if (options.nextButtonClientId !== undefined && options.nextButtonClientId !== null) {
                var nextButtonSelector = "#" + options.nextButtonClientId;
                this.nextButton = $(nextButtonSelector);
                this.nextButton.on("click", { that: this }, this.next);
            }
        }
        else {
            interval = 600000;
        }

        ib2.home.pinViewer.init();
    },

    start: function () {
        this.timerId = window.setTimeout(this.timeout, this.interval);
    },

    stop: function () {
        if (this.timeout !== null) {
            window.clearTimeout(this.timerId);
        }
    },

    timeout: function () {
        document.location = document.location;
    },

    isValid: function () {
        var isPageValid = true;
        var loginValidationSummary = $('#loginValidationSummary');

        var username = $('#Username');
        if (username !== undefined && username !== null) {
            if (username.val() == '') {
                isPageValid = false;
            }
        }

        var password = $('#Password');
        if (password !== undefined && password !== null) {
            if (password.val() == '') {
                isPageValid = false;
            }
        }

        if (isPageValid == false) {
            loginValidationSummary.html('<div class="validation-summary-errors"><ul><li>Some required information has not been completed.</li></ul></div>');
        }

        return isPageValid;
    },

    animateLogin: function () {
        $('#LoginDetails').fadeToggle("350", "linear", function () {
            $('#LoginLoadingPanel').removeClass('hidden').show();
        });
    },

    next: function (event) {
        var that = event.data.that;
        var isPageValid = that.isValid();

        if (isPageValid === true) {
            $('#userCredentialsPanel').fadeToggle("slow", "linear", that.nextComplete);
        }

        return false;
    },

    nextComplete: function () {
        $('#pinPanel').removeClass('hidden').show("fast", function () {
            $("html,body").animate({ scrollTop: $("#pinPanel").offset().top });
        });
        if ($('div.disclaimer').is(':visible')) {
            $('div.disclaimer').hide(800);
        }
    },

    pinEntered: function (sender, args) {
        //$.mobile.showPageLoadingMsg();

        var pin = args.pin;

        this.pinField.val(pin);
        this.animateLogin();
        this.form.submit();
    },

    pinCleared: function () {
        ib2.home.pinViewer.reset();
    },

    keyPressed: function (sender, args) {
        ib2.home.pinViewer.setValue(args.key);
    }

};

ib2.home.pinViewer = {
    pinViewerInput: null,

    init: function () {
        this.pinViewerInput = $('#pinViewer');
    },

    reset: function () {
        this.pinViewerInput.text("");
    },

    setValue: function (value) {
        var currentValue = this.pinViewerInput.text();
        var newValue = currentValue + value;

        this.pinViewerInput.text(newValue);
        window.setTimeout(this.maskValue, 1000);
    },

    maskValue: function () {
        var value = this.pinViewerInput.text();

        var maskedValue = value.replace(/./g, "*");

        this.pinViewerInput.text(maskedValue);
    }
};

ib2.marketcharts = {
    init: function (chartContainer) {
        this.chartContainer = chartContainer;
    },

    chartContainer: null,
    chartName: null,
    chartObject: null,

    refreshChartData: function (chartName, url) {
        this.chartName = chartName;

        $.mobile.showPageLoadingMsg();
        $.ajax({
            url: url,
            data: 'id=' + this.chartName,
            type: 'POST',
            success: ib2.marketcharts.refreshChartData_Completed
        });
    },
    refreshChartData_Completed: function (data) {

        if (data.ChartData != null &&
            data.ChartData.length > 0) {

            var dataItems = [];

            $.each(data.ChartData, function (key, val) {
                var dataItem = {};
                dataItem.x = new Date(val.Key);
                dataItem.y = val.Value;
                dataItems.push(dataItem);
            });

            Highcharts.setOptions({
                chart: {
                    style: {
                        fontFamily: 'Times New Roman',
                        fontSize: '1em'
                    }
                }
            });

            this.chartObject = new Highcharts.Chart({
                chart: {
                    renderTo: ib2.marketcharts.chartContainer
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    data: dataItems,
                    name: 'Data'
                }],
                title: {
                    text: null
                },
                tooltip: {
                    formatter: function () {
                        var xDate = this.x;
                        return xDate.toDateString() + ': <b>' + this.y.toFixed(2) + '</b>';
                    }
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%e %b'
                    },
                    labels: {
                        style: {
                            fontSize: '0.8em'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Price'
                    },
                    labels: {
                        style: {
                            fontSize: '0.8em'
                        }
                    }
                }
            });

        }

        $.mobile.hidePageLoadingMsg();
    }
};