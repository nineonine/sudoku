createPuzzle = function() {

	return fixZeros(makePublicPuzzle);
}

createSolvedPuzzle = function() {

	return fixZeros(solvepuzzle(makeArray(81, null)));
}

playGame = function(diff) {
	solved = createSolvedPuzzle();
	prepared = setDifficulty(solved, diff);


	for(var i = 1; i<=81;i++) {
		var cellName = ".inner-cell." + i;
		var a = prepared.shift();
		var spanInside = $(cellName).find('span');
		if(a) {
			spanInside.text(a);
			$(cellName).addClass("inserted");
		} else {
			spanInside.text(" ");	
		}
	}
}

cheat = function() {

	var solvedCopy = solved.slice();

	for(var i = 1; i<=81;i++) {
		var cellName = ".inner-cell." + i;
		var a = solvedCopy.shift();
		var spanInside = $(cellName).find('span');
		spanInside.text(a);
		$(cellName).addClass("inserted");
	}

	$(".inner-cell.41").removeClass('inserted');
	$(".inner-cell.41").find('span').text(" ");
	$(".inner-cell.41").stop().css("background-color", "#C1FFC1").animate({ backgroundColor: "#90EE90"}, 1500);
}


fixZeros = function(board) {
	return _.map(board, function(e) {
		if(e != null) {
			return e+1;
		} else {
			return null;
		}
	})
}

backToZeros = function(p) {
	return p.map(function(e) {
		return e-1
	});	

}




setDifficulty = function(puzzle, level) {
	var splitPuzzle = split(puzzle, 9);
	var toRemove;

	switch(level) {
		case "easy":
		toRemove = 2;
		break;
		case "moderate":
		toRemove = 4;
		break;
		case "hardcore":
		toRemove = 6;
		break;
	}

	splitPuzzle.forEach(function(row) {
		replaceWithRandom(row, toRemove)
	});

	return _.reduce(splitPuzzle, function(acc, val) {
		return acc.concat(val)
	}, []);

}

replaceWithRandom = function(row, times) {

	while(times) {
		var item = row[Math.floor(Math.random()*row.length)];
		if(item == null) {
			continue;
		} else {
			row[row.indexOf(item)] = null;
			times--;
		}
	}

}


function split(a, n) {
	
	var len = a.length,out = [], i = 0;
	while (i < len) {
		var size = Math.ceil((len - i) / n--);
		out.push(a.slice(i, i += size));
	}
	return out;
}
