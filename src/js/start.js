/*eslint quotes: [0, "single"] */
/*
    START
    Load JS plugins and various functions
*/

// Initialize
bc = {};

// Starting functions
$(document).ready(function () {
	bc.scrollToAnchor('.js-backToTop');
	bc.scrollToAnchor('.nav-sub a', -100);
	bc.mobileMenu('.wrapper-nav-main');
	bc.map('#contact-map');
	bc.dispatchBlocks('.js-dispatch');
	bc.hoverCard('.idea');
	// On resize events
	$(window).bind("debouncedresize", function () {
		bc.dispatchBlocks('.js-dispatch');
	});
	bc.stickyNav('.js-sticky');
	bc.initContactForm('#contact');
});

// Scroll to top
bc.scrollToAnchor = function (selector, offset) {
	if (!$(selector).length) return;
	$(selector).smoothScroll({
		offset: offset || 0,
		speed: 1000
	});
}

// Mobile nav menu
bc.mobileMenu = function (selector) {
	if (!$(selector).length) return;

	$(selector).meanmenu({
		meanScreenWidth: '680',
		meanMenuContainer: '.banner',
		meanShowChildren: false
	});
}

// Sticky nav
bc.stickyNav = function (selector) {
	if (!$(selector).length) return;

	$(selector).sticky({
		offset: 0,
		onStart: function () {
			$('.jquery-sticky-placeholder').height(120);
		},
		onStick: function () {
			$('.jquery-sticky-placeholder').height(55);
		}
	});
}

// Dispatch services blocks on two columns
bc.dispatchBlocks = function (selector) {
	if (!$(selector).length) return;

	var container = $('.blocks');
	// On large screens, we dispatch blocks on two columns
	if (matchMedia('(min-width: 80em)').matches && container.not('.is-dispatched')) {
		$(".block-odd").each(function () {
			$(this).appendTo('.blocks-col-left');
		});
		$(".block-even").each(function () {
			$(this).appendTo('.blocks-col-right');
		});
		container.addClass('is-dispatched').hide();
	}
	// On smal screens, we reorder blocks and display them on one column
	if (matchMedia('(max-width: 80em)').matches && container.hasClass('is-dispatched')) {
		$('.block').sort(function (a, b) {
			return a.dataset.order > b.dataset.order
		}).appendTo(container);
		container.show();
	}
}

// Map on contact page
bc.map = function (selector) {
	if (!$(selector).length) return;

	var contact_details = $('#map-popup');
	contact_details.hide();
	var map = L.map(
		'contact-map',
		{
			scrollWheelZoom : false,
			closePopupOnClick: false,
			zoomControl: false
		})
		.setView([47.208784, -1.552565], 14);
	var token = 'pk.eyJ1IjoiYnl0ZWNsdWIiLCJhIjoiOTFkZjJkYWU4NzU0M2I4YjNhZmJjZDcwZTgzMDBiYjgifQ.h6glv1phjg-2865nomR9jQ';
	new L.Control.Zoom({ position: 'topright' }).addTo(map);
	L.tileLayer('http://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + token,
		{
			maxZoom: 18
		})
		.addTo(map);

	// Add the marker and its popup
	var popup = L.popup({
			closeButton: false
		})
		.setLatLng([47.220248, -1.545248])
		.setContent(contact_details.html())
		.openOn(map);
}

// Hover effect on philosophy cards
bc.hoverCard = function (selector) {
	if (!$(selector).length) return;

	$('.idea-card').append('<span class="idea-close">×</span>');
	$('.idea-front').append('<span class="idea-open">…</span>');
	$('.idea-open').click(function () {
		var parent = $(this).parent('.idea-front');
		parent.fadeTo('fast', 0, function () { parent.hide(); });
	});
	$('.idea-close').click(function () {
		$(this).prevAll('.idea-front').fadeTo('fast', 1);
	});
}

bc.initContactForm = function (selector) {
	if (!$(selector).length) return;

	$(selector).submit(function(e) {

		e.preventDefault();

		if ($(this).parsley('isValid')) {
			$('.form-notice-error').hide();

			var ref = new Firebase('https://byteclub.firebaseio.com/contacts');
			ref.push({
				'email': $('#email').val(),
				'lastname': $('#lastname').val(),
				'firstname': $('#firstname').val(),
				'company': $('#company').val(),
				'message': $('#message').val(),
				'date': (new Date).toString()
			}, function(err) {
				if (err) alert("Une erreur est survenue, nous sommes désolé, nous n'avons pas pu enregistrer votre message.");
				else {
					$('.form-notice-success').show();
					$('.field-submit button').prop('disabled', true);
				}
			});

		} else {
			$(this).find('.input.parsley-validated').each(function(i, input) {
				if (!$(input).parsley('validate')) {
					$(input).parent('.field').addClass('field-error');
				} else {
					$(input).parent('.field').removeClass('field-error');
				}
			});
			$('.form-notice-error').show();
		}

	});
}

