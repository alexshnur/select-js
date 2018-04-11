/*global $:false, jQuery:false*/
/*
Drag & Drop Table Columns v.0.0.1
by Oleksandr Nikitin (a.nikitin@i.ua)
https://github.com/alexshnur/select-js
*/
(function(){
	window.sjs = {};

	let buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	sjs.buildSelectors = function (classNames, ids) {
		let selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	let classNames = {
		selectJsContainer: 'select-js-container',
		selectJsSelect: 'select-js-select',
		selectJsList: 'select-js-list',
		selectJsListItem: 'select-js-list-item',

		formControl: 'form-control',
		open: 'open'
	};

	let ids = {};

	let selectors = sjs.buildSelectors(classNames, ids);

	let closeListSelect = function($_this) {
		let $selectJsSelect = $(selectors.selectJsSelect);
		if ($selectJsSelect.hasClass(classNames.open)) {
			if ($_this) {
				$selectJsSelect.not($_this).removeClass(classNames.open);
			} else {
				$selectJsSelect.removeClass(classNames.open);
			}
		}
	};

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
		let $divSelect = $('<div/>', {'class': classNames.selectJsContainer});
		let $selected = $('<span/>', {'class': [classNames.selectJsSelect, classNames.formControl].join(' ')});
		let $input = $('<input/>', {'type': 'hidden', name: $selectJS.attr('name') || ''});
		let $ul = $('<ul/>', {'class': [classNames.selectJsList, selectors.dropdownMenu].join(' ')});

		$ul.attr('multiple', $selectJS[0].getAttribute('multiple'));

		$selectJS.find('option').each(function(){
			let $option = $(this);
			if (!$option.is(':disabled')) {
				$ul.append(
					$('<li/>', {text: $option.text(), 'data-value': $option.attr('value'), 'class': classNames.selectJsListItem})
				);
			}
			if ($option.is(':selected') || $option.is(':disabled')) {
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

	$(document).on('click', function(){
		closeListSelect();
	});

	$(document).on('click', selectors.selectJsSelect, function(e){
		let $this = $(this);

		closeListSelect($this);

		if ($this.hasClass(classNames.open)) {
			return;
		}

		$this.toggleClass(classNames.open);

		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click', selectors.selectJsListItem, function(){
		let $this = $(this);
		let $selectJsContainer = $this.closest(selectors.selectJsContainer);
		let $selectJsSelect = $selectJsContainer.find(selectors.selectJsSelect);
		let $selectJsList = $selectJsContainer.find(selectors.selectJsList);

		let selectText = [];

		let $lis = $selectJsList.find('li');

		if (!$selectJsList.is('[multiple]')) {
			$lis.prop('selected', false);
		}
		$this.prop('selected', true);

		$lis.each(function(){
			let $li = $(this);
			if ($li.is(':selected')) {
				selectText.push($li.text());
			}
		});

		$selectJsSelect.text(selectText.join(', '));
	});
})();