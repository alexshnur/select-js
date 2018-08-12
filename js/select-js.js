/*global $:false, jQuery:false, window:false, document:false*/
/*
Select JS v.0.0.1
by Oleksandr Nikitin (a.nikitin@i.ua)
https://github.com/alexshnur/select-js
*/
(function () {
	window.sjs = {};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	sjs.buildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	var classNames = {
		selectJsContainer: 'select-js-container',
		selectJsSelect: 'select-js-select',
		selectJsList: 'select-js-list',
		selectJsListItem: 'select-js-list-item',

		selectContainer: 'select-container',

		selectJs: 'select-js',

		formControl: 'form-control',
		open: 'open'
	};

	var ids = {};

	var selectors = sjs.buildSelectors(classNames, ids);

	var opts = {};

	var closeListSelect = function ($_this) {
		var $selectJsSelect = $(selectors.selectJsSelect);
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

	$.fn.selectJS = function (options) {
		if (this.length === 0) {
			$.fn.selectJS.debug('No element found for "' + this.selector + '".');
			return this;
		}

		if (this.length > 1) {
			return this.each(function () {
				$(this).selectJS(options);
			});
		}

		if (options === 'destroy') {
			$.fn.selectJS.destroy(this);
			return;
		}

		opts = {};

		var selectJS = this;
		var $selectJS = $(this);
		var $select= $selectJS.find('select');
		var $divSelect = $('<div/>', {'class': classNames.selectJsContainer});
		var $selected = $('<span/>', {'class': [classNames.selectJsSelect, classNames.formControl].join(' ')});
		var $ul = $('<ul/>', {'class': [classNames.selectJsList].join(' ')});

		var selectJsText = [];

		opts = $.extend(true, {}, $.fn.selectJS.defaults, options);

		opts.chooseText = $selectJS.attr('data-choose-text') || $.fn.selectJS.defaults.chooseText;
		$selectJS.addClass([classNames.selectJs,classNames.selectContainer].join(' '));

		$ul.attr('multiple', $select[0].getAttribute('multiple'));

		$select.find('option').each(function () {
			var $option = $(this);
			var isSelected = this.getAttribute('selected') || $option.is(':selected') || false;
			var $li = $('<li/>', {
				'data-value': $option.attr('value'),
				'class': classNames.selectJsListItem,
				'selected': isSelected,
				'disabled': $option.is(':disabled'),
				'title': $option.text()
			});
			$li.append(
				$('<span/>', {text: $option.text()})
			);
			if ($select.is('[multiple]')) {
				$li.append(
					$('<i/>', {'class': ($option.is(':selected') ? opts.checkedIcons.on : opts.checkedIcons.off)})
				);
			}
			$ul.append($li);
			if (isSelected) {
				$option.closest('select').val($option.attr('value'));
				selectJsText.push($option.text());
			}
		});

		if (selectJsText.length === 0) {
			selectJsText.push(opts.chooseText);
		}

		$selected.text(selectJsText.join(', '));


		$divSelect
			.append($selected)
			.append($ul);
		$divSelect.insertAfter($select);

		$ul.css({'transform': 'translate3d(0, ' + $selected.outerHeight(true) + 'px, 0)'});
	};

	$.fn.selectJS.defaults = {
		chooseText: '-- choose --',
		checkedIcons: {
			on: 'fa fa-check-square',
			off: 'fa fa-square'
		}
	};

	$.fn.selectJS.debug = function (msg) {
		console.error(msg);
	};

	$.fn.selectJS.destroy = function (_this) {
		var $this = $(_this);

		$this.find(selectors.selectJsContainer).remove();
		$this.removeClass([classNames.selectJs, classNames.selectContainer].join(' '));
	};

	$(document).on('click touchstart', function () {
		closeListSelect();
	});

	$(document).on('click touchstart', selectors.selectJsSelect, function (e) {
		var $this = $(this);

		closeListSelect($this);

		if ($this.hasClass(classNames.open)) {
			return;
		}

		$this.toggleClass(classNames.open);

		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	$(document).on('click touchend', selectors.selectJsListItem, function () {
		if (this.getAttribute('disabled')) {
			return;
		}

		var $this = $(this);
		var $selectJs = $this.closest(selectors.selectJs);
		var $selectJsSelect = $selectJs.find(selectors.selectJsSelect);
		var $selectJsList = $selectJs.find(selectors.selectJsList);
		var $select = $selectJs.find('select');

		var selectText = [];
		var selectValues = [];

		var $lis = $selectJsList.find('li');

		if (!$selectJsList.is('[multiple]')) {
			$lis.removeAttr('selected');
			$this.attr('selected', true);
		} else {
			$this.attr('selected', !$this[0].getAttribute('selected'));
			$this.find('i').toggleClass([opts.checkedIcons.on, opts.checkedIcons.off].join(' '));
		}


		$lis.each(function () {
			var $li = $(this);
			if ($li[0].getAttribute('selected')) {
				selectText.push($li.text());
				selectValues.push($li.attr('data-value'));
			}
		});

		$select.val(selectValues);

		if (selectText.length === 0) {
			var chooseText = $this.closest(selectors.selectJs).attr('data-choose-text') || $.fn.selectJS.defaults.chooseText;
			selectText.push(chooseText);
		}

		$selectJsSelect.text(selectText.join(', '));
	});
})();