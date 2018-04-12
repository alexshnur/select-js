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

		selectJs: 'select-js',

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

		$(this).addClass(classNames.selectJs);

		let selectJS = this;
		let $selectJS = $(this).find('select');
		let $divSelect = $('<div/>', {'class': classNames.selectJsContainer});
		let $selected = $('<span/>', {'class': [classNames.selectJsSelect, classNames.formControl].join(' ')});
		let $ul = $('<ul/>', {'class': [classNames.selectJsList, selectors.dropdownMenu].join(' ')});

		let selectJsText = [];
		let selectJsValues = [];

		$ul.attr('multiple', $selectJS[0].getAttribute('multiple'));

		$selectJS.find('option').each(function(){
			let $option = $(this);
			if (!$option.is(':disabled')) {
				$ul.append(
					$('<li/>', {text: $option.text(), 'data-value': $option.attr('value'), 'class': classNames.selectJsListItem, 'selected': $option.is(':selected')})
				);
			}
			if ($option.is(':selected') || $option.is(':disabled')) {
				selectJsText.push($option.text());
			}
		});

		$selected.text(selectJsText.join(', '));


		$divSelect
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
		let $selectJs = $this.closest(selectors.selectJs);
		let $selectJsSelect = $selectJs.find(selectors.selectJsSelect);
		let $selectJsList = $selectJs.find(selectors.selectJsList);
		let $select = $selectJs.find('select');

		let selectText = [];
		let selectValues = [];

		let $lis = $selectJsList.find('li');

		if (!$selectJsList.is('[multiple]')) {
			$lis.removeAttr('selected');
			$this.attr('selected', true);
		} else {
			$this.attr('selected', !$this[0].getAttribute('selected'));
		}


		$lis.each(function(){
			let $li = $(this);
			if ($li[0].getAttribute('selected')) {
				selectText.push($li.text());
				selectValues.push($li.attr('data-value'));
			}
		});

		$select.val(selectValues);

		$selectJsSelect.text(selectText.join(', '));
	});
})();