$(function() {

	hints = true;
	selectedCell = null;
	message = "";

	// game state
	solved = null;
	prepared = null;

	// initializing settings toggles
	$('#hint-switcher').bootstrapToggle();
	$('#timer-switcher').bootstrapToggle();

	// initializing timer
	clock = new FlipClock($('#timer'), {
		countdown: false
	});

	// starting to play new game in easy mode on load
	playGame("moderate");



	// EVENT HANDLERS
	// main click on cell - opening dial panel for entering values
	$( ".inner-cell").on('click', function(e) {

		if(e.target != this || $(this).hasClass("inserted")) {
			return
		}

		selectedCell = $(this);
		$(".dial")
    	.css({
    		position:"absolute",
    		top: e.pageY - 31,
    		left: e.pageX - 35 
    	})
    	.toggle();


	}).on('click', '.eraser', function(e) { // handling erasing values here

		$(this).parent().find('span').text(" ");
		$(this).parent().css({backgroundColor:"transparent"});
		$(this).hide('slow', function() { $(this).remove()});
		
		e.stopPropagation();

	}).on('click', '.inserted', function(e) {
		e.stopPropagation();
	});

	// choosing the value from the dial and putting it inside the inner cell
	$(document).on('click', '.dial td', function(e) {

		var pickedvalue = $(this).text();
		$(".dial").hide();
   		
		selectedCell.prepend('<img class="eraser" src="images/eraser.png"/>');
		var thisEraser = selectedCell.find(".eraser");
		selectedCell.find("span").html(pickedvalue).trigger('guessAtemmpt');


		// check if full
		if(checkIfFull()) {

			//check if won
			if(checkIfCorrect()) {
				$('.eraser').remove();
				$('span:not(.label)').parent().css({backgroundColor:"transparent"});
				message = "You completed the puzzle !"
				if($('#timer-switcher').prop('checked')) {
					var time = clock.getTime().time;
					message += "\n Your time : " + time + " seconds";
				}
				clock.stop();
				clock.reset();
				swal("Good job!", message, "success");

				playGame("moderate");
				clock.start();
			}
		}

		//show  /  hide eraser
	}).on('mouseenter', '.inner-cell', function(e) {

		if($(this).find('.eraser')) {
			$(this).find('.eraser').show();
		}

	}).on('mouseleave', '.inner-cell', function(e) {

		if($(this).find('.eraser')) {
			$(this).find('.eraser').hide();
		}

	});

	// hint mode coloring
	$('span:not(.label)').on('guessAtemmpt', function(el) {
		
		if(hints) {
			var td = $(this).parent();
			var guessedVal = +($(this).text());
			var cellIndex = +(td.attr('class').split(' ').pop());
			var correctVal = solved[cellIndex-1]
		
			if(guessedVal == correctVal) {
				td.css("background-color", "#C1FFC1")
	    		.animate({ backgroundColor: "#90EE90"}, 1500);
			} else {
				td.css("background-color", "#FA8072")
	    		.animate({ backgroundColor: "#FF6A6A"}, 1500);
			}
		}
		
	})
	

	// we can close the popup dial panel if we click anywhere else around the board
	$(document).mouseup(function (e) {

		var container = $(".dial");

		if (!container.is(e.target) 
		    && container.has(e.target).length === 0) {
			container.hide();
		}
	});

	// start a new game clicking label switcher
	$(document).on('click', '.label', function(e) {
		$('span:not(.label)').parent().css({backgroundColor:"transparent"});
		$('.inner-cell').each(function(cell) {
			$(this).removeClass("inserted")
		});
		$('#pause-timer').text("Pause");
		clock.stop();
		clock.reset();

		$('.eraser').remove();

		playGame($(this).text().toLowerCase());
		clock.start();
	})

	// pause / start timer
	$(document).on('click', '#pause-timer', function(e) {
		console.log("clicked")
		if(clock.running) {
			clock.stop();
			$(this).text('Start');
		} else {
			clock.start();
			$(this).text('Stop');	
		}
		
	})

	// #toggle for removing timer and hints 
	$(document).on('change', '#timer-switcher', function() {
	
		if($(this).prop('checked')) {
			$('#timer-wrapper').show();
		} else {
			$('#timer-wrapper').hide();
		}
	}).on('change', '#hint-switcher', function() {

		if($(this).prop('checked')) {
			hints = true;

			$('.inner-cell:not(.inserted):has(span)').each(function(el) {
				var guessedVal = +($(this).find('span').text());
				var cellIndex = +($(this).attr('class').split(' ').pop());
				var correctVal = solved[cellIndex-1]

				if(guessedVal == correctVal) {
					$(this).stop().css("background-color", "#C1FFC1").animate({ backgroundColor: "#90EE90"}, 1500);
				} else if(guessedVal == " "){
					return;
				} else {
					$(this).stop().css("background-color", "#FA8072").animate({ backgroundColor: "#FF6A6A"}, 1500);
				}

			})
		} else {
			hints = false;
			$('span:not(.label)').parent().css({backgroundColor:"transparent"});
		}
	});

	checkIfFull = function() {

		return _.every($('.inner-cell:not(.inserted)'), function(el) {
				return $(el).find('span').text().length > 0; 
		})
	}

	checkIfCorrect = function() {
		var aryy = $('.inner-cell:not(.inserted)')

		return _.every(aryy, function(e) {
				console.log(e);
				var guessedVal = +($(e).find('span').text());
				var cellIndex = +($(e).attr('class').split(' ').pop());
				var correctVal = solved[cellIndex-1]

				return guessedVal == correctVal; 
		})
	}

	function cheat() {

	}

});