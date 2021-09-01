
//*****Drag and Drop program ACC */


//Start a function//

$(function(){
	// Set a variable called "answers" that is equal to an array of the answers.//
	var answers = [{
			"text":		"Teachers produce more complex answers", //The html.text that you retrieve in the javascript//
			"order":	"8"//Each answer is given an order so that we can calculate if the answer is in the correct spot or not//
		}, {
			"text":		"Japanese students average 8 hours per month more than US students in school",
			"order":	"6"
		}, {
			"text":		"Parents regard Math as important",
			"order":	"2"
		}, {
			"text":		"Students take more Math classes",
			"order":	"4"
		}, {
			"text":		"Japanese students go to school six days per week",
			"order":	"5"
		}, {
			"text":		"Parents motivate children",
			"order":	"3"
		}, {
			"text":		"Teachers and students give long explanations",
			"order":	"7"
		}, {
			"text":		"Parents provide tutoring",
			"order":	"1"
		}, {
			"text":		"Math in Japan has more verbal explanations",
			"order":	"9"
	}];


	//Create the 3 categories that will hold the answers//

	var subcontainers = [{
			"text":		"", //must define text as none to make box appear empty//
			"id":		"reason1"//The id selector for this specific container to calculate scores//
		}, {
			"text":		"",
			"id":		"reason2"
		}, {
			"text":		"",
			"id":		"reason3"
	}];



	/*
	**********************************************************
	***    Define which answers belong in which        ***
	***    categories. The numbers here (i.e. the 3 in     ***
	***    answer3, etc) are derived from the 'order'      ***
	***    element of the answers[] array.                 ***
	**********************************************************
	*/


	//Set 3 variables that are equal to an array containing the correct answer ids//
	var reason1_correct = new Array('answer1','answer2','answer3');
	var reason2_correct = new Array('answer4','answer5','answer6');
	var reason3_correct = new Array('answer7','answer8','answer9');

	reset_game();	//initializes the game
	
	$('#game_container #button_container #reset_button').click(function(){
		reset_game();
	});
	
	$('#game_container #button_container #check_button').click(function(){
		$("#game_container .qanswer").promise().done(function() { 				// promise().done() waits for any animations to complete before firing the function
			score_game();														// this is necessary because any divs that have not yet finished the "drop" animation will not be scored
		});
	});
	
	$('#game_container #ok_button').click(function(){
		$('#game_container #message').animate( {
			width: '0',
			height: '0',
			padding: '0',
			opacity: 0
		}, 1000).hide(1000);
	});

	function reset_game() {
		// empty the divs
		$('#game_container #draggable_container').html('').removeClass();
		$('#game_container #droppable_container').html('');
		
		// enable the "check" button
		$('#game_container #check_button').removeAttr('disabled');
		
		// hide the incomplete message and the game score if they are showing
		$('#game_container #message').hide();
		$('#game_container #score_container').hide();

		
		// now place the answer containers on the page and make them accept the dragged answers from above
		for (var j=0; j<3; j++) {
			$('<div><strong>' + subcontainers[j].text + '</strong></div>').attr('class', 'subcontainer').attr('id', subcontainers[j].id).appendTo('#game_container #droppable_container').sortable({
				containment: "#game_container",
				cursor: "move",
				items: "div",
				revert: 250,
				connectWith: "#game_container .subcontainer",
				receive: function(event, ui) {
					if (ui.item.parents('#game_container .subcontainer')) {
						ui.item.removeClass('dragthis').addClass('dropped');
					} else {
						ui.item.removeClass('dropped').addClass('dragthis');
					}
				}
			}).disableSelection();
		}

		// randomize the order of the answer divs
		answers.sort(function(){ return (Math.round(Math.random())-0.5); });
		
		//Animate Answerboxes and buttons in
		$("#game_container #droppable_container").addClass("animatedBoxes bounceInRight");
		$("#game_container #button_container").addClass("animatedBoxes bounceInRight");
		// place them on the page and make them sortable
		for (var i=0; i<answers.length; i++) {
			$('<div>' + answers[i].text + '</div>').attr('id', 'answer' + answers[i].order).attr('class', 'dragthis qanswer').appendTo('#game_container #draggable_container').disableSelection();
		}

		$("#game_container #draggable_container").sortable({
			connectWith: '#game_container .subcontainer',
			containment: '#game_container',
			cursor: 'move',
			items: 'div',
			revert: 250
		}).disableSelection();
	}
	
	function score_game() {
		// check to see if they are finished
		// do this by making sure that #draggable_container is empty
		if (!$("#game_container #draggable_container").is(":empty")) {
			// it's not empty! it would be madness to try to calculate this score.
			
			// fill the message div with text accordingly
			$('#game_container #message #text').html('The game is not complete! Please drag all answers to a category first.');
			
			// now we'll animate it growing and appearing
			$('#game_container #message').show().css({
				bottom: $("#game_container #droppable_container").position().bottom-50,
				right: $("#game_container #droppable_container").position().right+100
			}).animate( {
				width: '450px',
				height: '80px',
				padding: '20px',
				opacity: 1
			}, 500);
			
			// you don't get a score yet. stop here.
			return;
		}

		// if we got this far, it means each draggable has been dragged to one of the containers.

		// make the items no longer sortable by disabling them
		$("#game_container .subcontainer").each(function(index){
			$(this).sortable("option","disabled",true);
		});
		
		// also disable the "check" button
		$('#game_container #button_container #check_button').attr("disabled", "disabled");
		


		// go through each and see if it's in the right place
		$correctcounter = 0;																				// keep track of how many are right
		$("#game_container .dropped").each(function(index){
			$thisid = $(this).attr('id');																	// shortcuts
			$parentid = $(this).parent().attr('id');
			$(this).css('cursor','default');																// UI helper to help the user know the elements are no longer draggable
			if (																							// big long if statement to see if the element is in the right place
				($.inArray($thisid, reason1_correct) > -1 && $parentid == 'reason1') ||
				($.inArray($thisid, reason2_correct) > -1 && $parentid == 'reason2') ||
				($.inArray($thisid, reason3_correct) > -1 && $parentid == 'reason3')
			) {
				$(this).addClass('correct', 800).removeClass('dropped', 800);								// it's in the right place - make it all green and happy
				$correctcounter++;																			// +1 to the counter of correct answers
			} else {
				$(this).addClass('incorrect', 800).removeClass('dropped', 800);								// it's in the wrong place - make it all red and sad
			}
		});
		
		// tell the user their score, we'll use the heretofore hidden #score_container div for that.
		$('#game_container #message #text').html('You got <span class="score">' + $correctcounter + '</span> out of 9 correct!');
		$('#game_container #message').show().css({
			bottom: $("#game_container #droppable_container").position().bottom-50,
			right: $("#game_container #droppable_container").position().right+100
		}).animate( {
			width: '450px',
			height: '80px',
			padding: '20px',
			opacity: 1
		}, 500);
		
	}


	function getQueryVariable(variable) {
		let query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] == variable) {
			return pair[1];
			}
		}
		return false;
	}

	var blackboard = getQueryVariable('blackboard');

	if(blackboard !== "true") {
		$('.game_container').hide();
	}
})