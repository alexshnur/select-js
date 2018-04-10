/*global $:false, jQuery:false*/
/*
Drag & Drop Table Columns v.0.0.1
by Oleksandr Nikitin (a.nikitin@i.ua)
https://github.com/alexshnur/select-js
*/
(function(){
	if ($.fn.selectJS) {
		return;
	}

	$.fn.selectJS = function(options){
		if (this.length === 0) {
			$.fn.selectJS.debug('No element found for "' + this.selector + '".');
			return this;
		}

		if (this.length > 1) {
			return this.each(function () {
				$(this).selectJS(options);
			});
		}

		let selectJS = this;
		let $selectJS = $(this).find('select');
		let $divSelect = $('<div/>', {'class': 'select-js-container'});
		let $selected = $('<span/>', {'class': 'select-js-select'});
		let $input = $('<input/>', {'type': 'hidden', name: $selectJS.attr('name') || ''});
		let $ul = $('<ul/>');

		$selectJS.find('option').each(function(){
			let $option = $(this);
			$ul.append(
				$('<li/>', {text: $option.text(), 'data-value': $option.attr('value')})
			);
			if ($option.is(':selected')) {
				$selected.text($option.text());
				$input.val($option.text());
			}
		});


		$divSelect
			.append($input)
			.append($selected)
			.append($ul);
		$divSelect.insertAfter($selectJS);
	};

	$.fn.selectJS.defaults = {};

	$.fn.selectJS.debug = function (msg) {
	};
})();