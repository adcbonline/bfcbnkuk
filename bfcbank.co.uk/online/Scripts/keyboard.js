// TODO module - private/public methods  - add sender/args params to events

var keyboard = {

    currentValue: "",
    pinEnteredEventHandler: null,
    pinClearedEventHandler: null,
    pinKeyPressedEventHandler: null,
    pinLengthRequired: 3,

    that: null,
    visible: false,

    icon: null,
    keyboardView: null,

    init: function (options) {
        that = this;
        //$('#keyboard').hide();

        $('.virtualKey').click(that.keyPressed);
        $('.resetKey').click(that.clear);

        icon = $('#keyboardIcon');
        keyboardView = $('#keyboard');

        icon.click(that.toggle);
        icon.mouseover(that.iconOver);
        icon.mouseout(that.iconOut);

        if (options !== undefined && options !== null) {

            if (options.pinLengthRequired !== undefined && options.pinLengthRequired !== null) {
                that.pinLengthRequired = options.pinLengthRequired;
            }
        }

    },

    keyPressed: function () {
        var virtualKey = $(this);
        var keyValue = virtualKey.text();

        that.storePressedValue(keyValue);
    },

    reset: function () {
        that.currentValue = "";

        var options = {};
        
        //keyboardView.effect('fade', options, that.reshow);
    },

    clear: function () {
        if (that.pinClearedEventHandler != null) {
            that.pinClearedEventHandler();
        }

        that.reset();
    },

    reshow: function () {
        setTimeout(function () {
            keyboardView.removeAttr("style").hide().show();
        }, 500);
    },

    toggle: function () {

        if (that.visible === true) {
            var options = { direction: "vertical",
                mode: "hide"
            };

            keyboardView.effect('blind', options, null);
            that.visible = false;
        }
        else {
            var options = { direction: "vertical",
                mode: "show"
            };

            keyboardView.effect('blind', options, null);
            that.visible = true;
        }
    },

    selectedValue: function () {
        return that.currentValue;
    },

    storePressedValue: function (value) {
        
        that.currentValue += value;


        if (that.pinKeyPressedEventHandler !== null) {
            var args = { key: value, currentPin: that.currentValue };
            that.pinKeyPressedEventHandler(that, args);
        }
        
        if (that.currentValue.length >= that.pinLengthRequired) {
            if (that.pinEnteredEventHandler !== null) {
                
                var pin = that.currentValue;
                
                that.reset();
                
                var args ={
                    pin: pin
                };
                
                that.pinEnteredEventHandler(that, args);
            }
        }
    },

    iconOver: function () {
        icon.addClass("iconOver");
    },

    iconOut: function () {
        icon.removeClass("iconOver");
    },

    addPinEnteredListener: function (eventHandler) {
        that.pinEnteredEventHandler = eventHandler;
    },

    removePinEnteredListener: function () {
        that.pinEnteredEventHandler = null;
    },

    addPinClearedEventHandler: function (eventHandler) {
        that.pinClearedEventHandler = eventHandler;
    },

    removePinClearedEventHandler: function () {
        that.pinClearedEventHandler = null;
    },

    addPinKeyPressedEventHandler: function (eventHandler) {
        that.pinKeyPressedEventHandler = eventHandler;
    },

    removePinKeyPressedEventHandler: function () {
        that.pinKeyPressedEventHandler = null;
    }



};
