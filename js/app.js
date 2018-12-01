/*
 * Create a list that holds all of your cards
 */

const listTypeCards = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bicycle","fa-bomb"];
//variaveis globais para o relogio
var count;
var time;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *   
  + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move timeer and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 //constroi o deck com 16 cards embaralhados
function constructionDeck(array) {
	let cards =[];
	for(let i=0; i < array.length; i++)
		//dobra o número de cards
		cards.push(array[i], array[i]);
	return shuffle(cards);
}

//adiciona id ao array de cards abertos
function addIdList(id,idList){
	if(!id)
		return
	if($("#"+id).hasClass("match"))
		return;
	idList.push(id);
}

//abre o card escolhido
function openCard(id,cards) {
	$("#"+id).children().addClass(cards[id]);
	$("#"+id).addClass("open show");
}

//fecha os cards
function closeCard(id,cards) {
	$("#"+id).children().removeClass(cards[id]);
	$("#"+id).removeClass("open show");
}

//define os cards que não serão mais abertos
function addMatch(id) {
	$("#"+id[0]).addClass("match");
	$("#"+id[0]).removeClass("open show");
	$("#"+id[1]).addClass("match");
	$("#"+id[1]).removeClass("open show");
}

//verifica se dois cards são iguais
function verifyCombination(idList, cards) {
	if(idList.length === 2) {
		if(idList[0]===idList[1]) {
			idList.length = 1;
			return;
		}
		if (cards[idList[0]] === cards[idList[1]]) {
			addMatch(idList);
			idList.length=0;

		}
		else {
			setTimeout(function(){
				closeCard(idList[0], cards);
				closeCard(idList[1], cards);
				idList.length=0;
			},400);
		}
		
	}
}
//função resnposável por capturar os cliques
function cardClick(event, idList, cards){
	if(idList.length<2){
			addIdList(event.target.id,idList);
			openCard(idList[idList.length-1],cards);
			verifyCombination(idList,cards);
		}
}

//adiciona os cards a interface
function constructionGameInterface(array) {
	for(let i=0; i < array.length; i++)
		$(".deck").append("<li class='card' id='"+i+"'><i class='fa'></i></li>");
}
function clock() {
	let seg = time%60;
	let min = parseInt(time/60);
	if(time > -1) {
		flag = 1;
		if(seg < 10)
			seg = "0"+ seg;
		if(min < 10)
			min="0" + min;
		$(".clock").html(min+":"+seg);
		time--;
					
	}
	if(time < 0){
		endGame();
	}
}

function initTime(minute, second){
	time = minute*60+second;
	count = setInterval(clock, 1000);
}

//termina o jogo
function endGame(){
	clearInterval(count);
}

//inicia o jogo
function initGame(cards, idList, minute, second){
	cards = constructionDeck(listTypeCards);
	idList = [];
	constructionGameInterface(cards);
	initTime(minute, second);


}

//reinicia jogo
function restart(cards,idList, minute, second){
	clearInterval(count);
	$(".deck").html("");
	initGame(cards, idList, minute, second);

}

$(document).ready(function(){
	//array com os cards do baralho
	let cards = constructionDeck(listTypeCards);
	//cards abertos
	let idList = [];
	//tempo máximo do jogo
	let minute = 0;
	let second = 10;
	
	$(".deck").on("click",function(event){
		cardClick(event, idList, cards)
	});

	$(".restart").on("click", function(event){
		restart(cards, idList, minute, second);
	});
	//inicia o jogo
 	initGame(cards, idList,  minute, second);
	
});