/*
 * jQuery yEditable Plugin 0.0.1
 * https://github.com/yanni4night/yy.editable
 *
 * Copyright 2013-2014,yinyong
 * Email:yanni4night@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function($) {
	"strict";
	$.fn.yeditable = function(config) {

		var _config = {
			inputAutoSize: true,
			inputAutoClass: false,
			styleClass: '',
			inputType: 'input', //input or textarea
			validate: function(oldValue, newValue) {
				return true;
			},
			onEditSucceed: function(oldValue, newValue) {},
			onEditFailed: function(oldValue, newValue) {},
			onBeforeEdit: function(oldValue) {
				return true;
			},
			onAfterEdit: function(oldValue, newValue) {}
		}, defaultConfig = _config,
			e, all = $(this),
			edit, editDone, editBegin;

		config = config || {};
		for (e in defaultConfig) {
			_config[e] = config[e] || defaultConfig[e];
		}
		//Default input
		_config.inputType = /^(input|textarea)$/i.test(_config.inputType) ? _config.inputType : 'input';
		/**
		 * Complete the editting,reshow the editable element and
		 * call the onAfterEdit function.
		 * @param  {jQuery object} editable    The editable element
		 * @param  {jQuery object} hiddenInput The hidden input element
		 * @param  {String} oldValue    Old string value
		 * @param  {String} newValue    New string value
		 * @return {undefined}
		 */
		editDone = function(editable, hiddenInput, oldValue, newValue) {
			editable.show();
			hiddenInput.hide();
			//Invoke onAfterEdit
			_config.onAfterEdit.call(editable, oldValue, newValue);
		};

		edit = function(editable, hiddenInput) {
			var newValue = hiddenInput.val(),
				oldValue = editable.text();
			if (_config.validate.call(editable, oldValue, newValue)) {
				editable.text(newValue);
				_config.onEditSucceed.call(editable, oldValue, newValue);
			} else {
				_config.onEditFailed.call(editable, oldValue, newValue);
			}

			editDone(editable, hiddenInput, oldValue, newValue);
		};

		editBegin = function(editable, hiddenInput) {
			hiddenInput.val(editable.hide().text()).addClass(_config.inputAutoClass ? editable.attr('class') : _config.styleClass).show().focus();
			if (_config.inputAutoSize) {
				hiddenInput.css({
					width: editable.width() + "px",
					height: editable.height() + "px"
				});
			}

		};

		$.each(all, function(i, v) {

			var hiddenInput = $('<' + _config.inputType + '/>').attr({
				type: 'text'
			}).css({
				display: 'none'
			}),
				editable = $(v);


			hiddenInput.insertBefore(editable);
			hiddenInput.on('blur', function() {
				edit(editable, hiddenInput);
			});
			if (_config.inputType === 'input') {
				hiddenInput.on('keypress', function(e) {
					if (e.keyCode === 13) {
						edit(editable, hiddenInput);
					}
				});
			}

			editable.on('dblclick', function() {
				if (_config.onBeforeEdit.call(editable, editable.text(), hiddenInput.val())) {
					editBegin(editable, hiddenInput);
				}
			});

		}); //$.each

		return this;

	};

})(jQuery);